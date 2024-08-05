import { Suspense, useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { Canvas, addEffect } from '@react-three/fiber';
import {
  OrthographicCamera,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { EffectComposer, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useStore } from '../App';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import Scene from './Scene';

import img05 from '/assets/images/img1.jpeg';
import img02 from '/assets/images/img2.jpeg';
import img03 from '/assets/images/img3.jpeg';
import img04 from '/assets/images/img4.jpeg';
import img01 from '/assets/images/img5.jpeg';
import img06 from '/assets/images/img6.jpeg';
import img07 from '/assets/images/img7.jpeg';
import img08 from '/assets/images/img8.jpeg';
import img09 from '/assets/images/img9.jpeg';
import img10 from '/assets/images/img10.jpeg';
import img11 from '/assets/images/img11.jpeg';
import img12 from '/assets/images/img12.jpeg';
import img13 from '/assets/images/img13.jpeg';
import img14 from '/assets/images/img14.jpeg';
import img15 from '/assets/images/img15.jpeg';
import logo from '/assets/images/logo.webp';

const ARTIST_DATA = [
  {
    id: 1,
    name: 'Sonny Fodera',
    releases: '2 Releases',
    img: img01,
    link: '/artists',
  },
  {
    id: 2,
    name: 'Joel Corry',
    releases: '1 Release',
    img: img02,
    link: '/artists',
  },
  {
    id: 3,
    name: 'Biscits',
    releases: '2 Releases',
    img: img03,
    link: '/artists',
  },
  {
    id: 4,
    name: 'Jem Cooke',
    releases: '3 Releases',
    img: img04,
    link: '/artists',
  },
  {
    id: 5,
    name: 'Goodboys',
    releases: '1 Release',
    img: img05,
    link: '/artists',
  },
  {
    id: 6,
    name: 'AVAION',
    releases: '2 Releases',
    img: img06,
    link: '/artists',
  },
  {
    id: 14,
    name: 'Benny Benassi',
    releases: '1 Release',
    img: img14,
    link: '/artists',
  },
  {
    id: 8,
    name: 'Just Kiddin',
    releases: '1 Release',
    img: img08,
    link: '/artists',
  },
  {
    id: 9,
    name: 'Tobtok',
    releases: '1 Release',
    img: img09,
    link: '/artists',
  },
  {
    id: 10,
    name: 'Shells',
    releases: '2 Releases',
    img: img10,
    link: '/artists',
  },
  {
    id: 11,
    name: 'Kideko',
    releases: '1 Release',
    img: img11,
    link: '/artists',
  },
  {
    id: 12,
    name: 'FAST BOY',
    releases: '3 Releases',
    img: img12,
    link: '/artists',
  },
  {
    id: 13,
    name: 'Shift K3Y',
    releases: '1 Release',
    img: img13,
    link: '/artists',
  },
  {
    id: 7,
    name: 'TCTS',
    releases: '2 Releases',
    img: img07,
    link: '/artists',
  },
  {
    id: 15,
    name: 'Nonô',
    releases: '2 Releases',
    img: img15,
    link: '/artists',
  },
];

const PERSPECTIVE = 1000;
const FOV =
  (180 * (2 * Math.atan(window.innerHeight / 2 / PERSPECTIVE))) / Math.PI;

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};
let current = 0;
let target = 0;
let ease = 0.075;

let currentMouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };

// Reference: https://selectedbase.com/artists
function Artists() {
  const activeCursor = useStore((state) => state.activeCursor);
  const setActiveCursor = useStore((state) => state.setActiveCursor);
  const isScrollLocked = useStore((state) => state.isScrollLocked);
  const isLoaded = useStore((state) => state.isLoaded);
  const scrollableRef = useRef(null);
  const artistListRef = useRef(null);
  const imageRef = useRef(null);
  const mainRef = useRef(null);
  const [activeImg, setActiveImg] = useState(1);
  const [imgOpacity, setImgOpacity] = useState(0);
  const [offset, setOffset] = useState({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
  });
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (isScrollLocked || !isLoaded) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isLoaded, isScrollLocked]);

  // SMOOTH SCROLL SYNC SETUP
  useEffect(() => {
    // SET VIRTUAL SCROLL PARENT HEIGHT, UPDATE ON RESIZE
    const init = () => {
      document.body.style.height = `${
        scrollableRef.current.getBoundingClientRect().height
      }px`;
    };
    init();
    window.addEventListener('resize', init);

    // UPDATE SCROLLABLE CONTAINER Y POSITION IN ANIMATION LOOP
    const smoothScroll = () => {
      target = window.scrollY;
      current = lerp(current, target, ease);
      if (scrollableRef.current) {
        scrollableRef.current.style.transform = `
        translate3d(0, -${current}px, 0)
        `;
      }

      // lerp current mouse position to target mouse position for use in shader material uniform
      currentMouse.x = lerp(currentMouse.x, targetMouse.x, 0.06);
      currentMouse.y = lerp(currentMouse.y, targetMouse.y, 0.06);

      setOffset({
        targetX: targetMouse.x,
        targetY: targetMouse.y,
        currentX: currentMouse.x,
        currentY: currentMouse.y,
      });
      requestAnimationFrame(smoothScroll);
    };
    smoothScroll();

    return () => {
      cancelAnimationFrame(smoothScroll);
      window.removeEventListener('resize', init);
      document.body.style.height = '';
    };
  }, []);

  useGSAP(
    () => {
      const xTo = gsap.quickTo(imageRef.current, 'x', { duration: 0.2 });
      const yTo = gsap.quickTo(imageRef.current, 'y', { duration: 0.2 });

      const handleMouseMove = (e) => {
        const translateValueX =
          e.clientX - imageRef.current.getBoundingClientRect().width / 2;
        const translateValueY =
          e.clientY - imageRef.current.getBoundingClientRect().height / 2;

        xTo(translateValueX);
        yTo(translateValueY);

        // use current mouse position and target mouse position to lerp mouse position for use in shader material uniform
        targetMouse.x = e.clientX;
        targetMouse.y = e.clientY;
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    },
    {
      scope: mainRef.current,
    }
  );

  return (
    <div ref={mainRef} className="artists__main">
      <header className="artists__header">
        <div className="artists__headerLogoWrapper">
          <a href="/artists" className="artists__headerLogoLink">
            selected.
          </a>
        </div>
        <div className="artists__headerMenuWrapper">
          <button className="artists__headerMenuBtn">Menu</button>
        </div>
      </header>
      <div ref={scrollableRef} className="artists__scrollable">
        <div
          className="artists__logoContainer flex h-screen w-full cursor-pointer items-center justify-center"
          onMouseEnter={() => setActiveCursor(true)}
          onMouseLeave={() => setActiveCursor(false)}
        >
          <div className="artists__logoWrapper max-w-[70vw]">
            <img src={logo} alt="selected logo" className="artists__logo" />
          </div>
        </div>
        <div className="artists__heroWrapper">
          <div className="artists__heroTitle">
            <span>ARTISTS WHO</span>
            <span>ARE A PART OF</span>
            <span>OUR FAMILY</span>
          </div>
        </div>
        <div className="artists__contentWrapper">
          <div className="artists__content">
            <ul
              ref={artistListRef}
              className="artists__list"
              onMouseEnter={() => {
                setImgOpacity(0.85);
              }}
              onMouseLeave={() => {
                setImgOpacity(0);
              }}
            >
              {ARTIST_DATA.map((artist, idx) => (
                <ArtistItem
                  key={idx}
                  artist={artist}
                  setActiveImg={setActiveImg}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="artists__footerWrapper">
          <div className="artists__footerTop">
            <span className="artists__footerTopSubtitle">Demo Drop</span>
            <span className="artists__footerTopTitle">
              <span>Submit your track and</span>
              <span>become one of our artists.</span>
            </span>
          </div>
          <div className="artists__footerBottom">
            <span className="artists__footerBottomLogo">selected.</span>
          </div>
        </div>
      </div>
      <div className="artists__imgWrapper" ref={imageRef}>
        <img src={img01} alt="artist" className="artists__img" />
      </div>
      <div className="artists__canvasWrapper">
        <Canvas
          style={{
            pointerEvents: 'none',
          }}
        >
          <OrthographicCamera
            makeDefault
            position={[0, 0, PERSPECTIVE]}
            zoom={1}
            fov={FOV}
            aspect={window.innerWidth / window.innerHeight}
            near={1}
            far={1000}
          />
          {/* <OrthographicCamera
            makeDefault
            position={[0, 0, PERSPECTIVE]}
            zoom={1}
            fov={FOV}
            aspect={window.innerWidth / window.innerHeight}
            near={1}
            far={1000}
          /> */}
          {/* <OrbitControls /> */}
          <Suspense fallback={<span>loading...</span>}>
            <Scene
              activeImg={activeImg}
              imgOpacity={imgOpacity}
              offset={offset}
            />
            <EffectComposer>
              <Noise
                blendFunction={BlendFunction.OVERLAY}
                opacity={0.8}
                premultiply
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

function ArtistItem({ artist, setActiveImg }) {
  // const imageRef = useRef(null);
  const itemRef = useRef(null);
  const backgroundRef = useRef(null);

  const handleMouseEnter = (e) => {
    setActiveImg(artist.id);
    // depending on whether user enters from top or bottom, animate background in or out
    const bounds = itemRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const top = bounds.top;
    const bottom = bounds.bottom;
    const middle = top + (bottom - top) / 2;
    const isTop = mouseY < middle;
    const isBottom = mouseY > middle;

    if (isTop) {
      gsap.set(backgroundRef.current, {
        y: '-100%',
      });
      gsap.to(backgroundRef.current, {
        duration: 0.2,
        // ease: "akaruEase",
        y: 0,
      });
    } else if (isBottom) {
      gsap.set(backgroundRef.current, {
        y: '100%',
      });
      gsap.to(backgroundRef.current, {
        duration: 0.2,
        // ease: "akaruEase",
        y: 0,
      });
    }
  };

  const handleMouseLeave = (e) => {
    setActiveImg(img01);
    // depending on whether user exits from top or bottom, animate background in or out
    const bounds = itemRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const top = bounds.top;
    const bottom = bounds.bottom;
    const middle = top + (bottom - top) / 2;
    const isTop = mouseY < middle;
    const isBottom = mouseY > middle;

    if (isTop) {
      gsap.to(backgroundRef.current, {
        duration: 0.2,
        // ease: "akaruEase",
        y: '-100%',
      });
    } else if (isBottom) {
      gsap.to(backgroundRef.current, {
        duration: 0.2,
        // ease: "akaruEase",
        y: '100%',
      });
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <li
      ref={itemRef}
      key={artist.name}
      className="artists__listItem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div ref={backgroundRef} className="artists__listItemBackground"></div>
      <a href="/" className="artists__listItemLink">
        <div className="artists__itemLeftWrapper">
          <div className="artists__itemArrowWrapper">
            <svg
              fill="#000000"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="artists__itemArrow"
            >
              <path d="M3.293,20.707a1,1,0,0,1,0-1.414L17.586,5H12a1,1,0,0,1,0-2h8a1,1,0,0,1,1,1v8a1,1,0,0,1-2,0V6.414L4.707,20.707a1,1,0,0,1-1.414,0Z" />
            </svg>
          </div>
          <span className="artists__itemTitle">{artist.name}</span>
        </div>
        <div className="artists__itemRightWrapper">
          <span className="artists__itemReleases">{artist.releases}</span>
        </div>
        {/* <div className="artists__imgWrapper" ref={imageRef}>
          <img src={artist.img} alt={artist.name} className="artists__img" />
        </div> */}
      </a>
    </li>
  );
}

export default Artists;
