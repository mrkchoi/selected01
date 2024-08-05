import React, { useEffect } from 'react';
import MeshImage from './MeshImage';
import MeshLogo from './MeshLogo';
import * as THREE from 'three';

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
import { useStore } from '../App';

function Scene({ activeImg, imgOpacity, offset }) {
  const setTextures = useStore((state) => state.setTextures);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const images = [
      img01,
      img02,
      img03,
      img04,
      img05,
      img06,
      img07,
      img08,
      img09,
      img10,
      img11,
      img12,
      img13,
      img14,
      img15,
    ];

    for (let i = 0; i < images.length; i++) {
      const texture = loader.load(images[i]);
      setTextures(i + 1, texture);
    }
  }, [setTextures]);

  return (
    <>
      <MeshImage
        activeImg={activeImg}
        imgOpacity={imgOpacity}
        offset={offset}
      />
      <MeshLogo />
    </>
  );
}

export default Scene;
