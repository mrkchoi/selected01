import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../App';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
// import Logo from '../Logo';
// import { loadJSON } from '../../util/curveTools/JSONHelper';

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

function LoaderCustom() {
  const loader = useRef(null);

  const progressNumber = useRef(null);
  const totalAssets = useStore((state) => state.totalAssets);
  const setIsLoaded = useStore((state) => state.setIsLoaded);
  const setIsScrollLocked = useStore((state) => state.setIsScrollLocked);

  const [loadedAssets, setLoadedAssets] = useState(0);
  const currentAssets = useRef(0);
  const [maxAssets, setMaxAssets] = useState(totalAssets);

  useEffect(() => {
    // THREE.DefaultLoadingManager.onStart = function (
    //   url,
    //   itemsLoaded,
    //   itemsTotal
    // ) {
    //   console.log(
    //     'Started loading file: ' +
    //       url +
    //       '.\nLoaded ' +
    //       itemsLoaded +
    //       ' of ' +
    //       itemsTotal +
    //       ' files.'
    //   );
    // };

    // THREE.DefaultLoadingManager.onLoad = function () {
    //   console.log('Loading Complete!');
    // };

    THREE.DefaultLoadingManager.onProgress = function (
      url,
      itemsLoaded,
      itemsTotal
    ) {
      currentAssets.current = itemsLoaded;
      setMaxAssets(Math.max(itemsTotal, maxAssets));
      setLoadedAssets(itemsLoaded);
      // console.log(
      //   'Loading file: ' +
      //     url +
      //     '.\nLoaded ' +
      //     itemsLoaded +
      //     ' of ' +
      //     itemsTotal +
      //     ' files.'
      // );
    };

    // THREE.DefaultLoadingManager.onError = function (url) {
    //   console.log('There was an error loading ' + url);
    // };
  }, []);

  // useEffect(() => {
  //   setIsScrollLocked(true);
  // }, [setIsScrollLocked]);

  // const [isExitTransitionStart, setIsExitTransitionStart] = useState(false);
  // const [isAssetLoaded, setIsAssetLoaded] = useState(false);

  useGSAP(() => {
    if (loadedAssets >= maxAssets || currentAssets.current >= maxAssets) {
      gsap.to(loader.current, {
        duration: 0.5,
        opacity: 0,
        delay: 1,
        onComplete: () => {
          setIsLoaded(true);
          setIsScrollLocked(false);
        },
      });
    }
  }, [loadedAssets, maxAssets]);

  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);

      setLoadedAssets((prev) => lerp(prev, currentAssets.current, 0.1));
    };

    const raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={loader}
      className="loaderMain fixed z-[999] flex h-screen w-full flex-col items-center justify-center bg-white"
    >
      <span
        ref={progressNumber}
        className="mb-2 text-center text-[1rem] leading-none will-change-transform"
      >
        {/* <span className="absolute bottom-12 right-12 text-[5vw] font-bold leading-none tracking-tighter"> */}
        {Math.round(Math.min(loadedAssets / totalAssets, 1) * 100)}%
      </span>
    </div>
  );
}

export default LoaderCustom;
