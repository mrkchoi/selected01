import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import logo from '/assets/images/logo.webp';
import { v4 as uuidv4 } from 'uuid';
import gsap from 'gsap';
import { useStore } from '../App';
// const lerp = (start, end, t) => {
//   return start * (1 - t) + end * t;
// };

function MeshLogo({}) {
  const isLoaded = useStore((state) => state.isLoaded);

  // const {
  //   frequency,
  //   amplitude,
  //   timeScale,
  //   // alpha,
  //   // noiseScale,
  //   dispersionSeed,
  //   dispersionScale,
  // } = useControls({
  //   frequency: {
  //     value: 3,
  //     min: 0,
  //     max: 10,
  //   },
  //   amplitude: {
  //     value: 0.03,
  //     min: 0,
  //     max: 0.1,
  //   },
  //   timeScale: {
  //     value: 1,
  //     min: 0,
  //     max: 10,
  //   },
  //   // alpha: {
  //   //   value: 1,
  //   //   min: 0,
  //   //   max: 1,
  //   // },
  //   // noiseScale: {
  //   //   value: 0,
  //   //   min: 0,
  //   //   max: 1,
  //   // },
  //   dispersionSeed: {
  //     value: 0,
  //     min: -1,
  //     max: 1,
  //   },
  //   dispersionScale: {
  //     value: 0,
  //     min: 0,
  //     max: 2,
  //   },
  // });
  const meshRef = useRef(null);
  const { camera, raycaster } = useThree();
  const mouse = useRef({
    world: new THREE.Vector2(0.5, 0),
    prev: new THREE.Vector2(0.5, 0),
    // uv: new THREE.Vector2(0, 0),
    isInit: false,
  });

  // textureRef.current = useMemo(() => new THREE.TextureLoader().load(logo), []);
  // const loader = new THREE.TextureLoader();

  useEffect(() => {
    // console.log('ref.current', ref.current);
    if (!camera) return;

    const handleMouseMove = (e) => {
      const event = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };

      mouse.current.world = event;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      gsap.to(meshRef.current.material.uniforms.dispersionSeed, {
        value: -0.4,
        duration: 1,
        ease: 'power3.inOut',
      });
      gsap.to(meshRef.current.material.uniforms.dispersionScale, {
        value: 1,
        duration: 1,
        ease: 'power3.inOut',
      });
    };

    const handleMouseUp = (e) => {
      gsap.to(meshRef.current.material.uniforms.dispersionScale, {
        value: 0,
        duration: 1,
        ease: 'power3.inOut',
      });
      gsap.to(meshRef.current.material.uniforms.dispersionSeed, {
        value: 0,
        duration: 1,
        ease: 'power3.inOut',
      });
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const tl = gsap.timeline();
      tl.to(
        meshRef.current.material.uniforms.alpha,
        {
          value: 1,
          duration: 1.5,
          // delay: 0.5,
          ease: 'power3.inOut',
        }
        // '<'
      );
      tl.to(
        meshRef.current.material.uniforms.dispersionSeed,
        {
          value: 0,
          duration: 1.5,
          // ease: 'elastic.inOut',
        },
        '<'
      );
      tl.to(
        meshRef.current.material.uniforms.dispersionScale,
        {
          value: 0,
          duration: 2,
          // delay: 0.75,
          ease: 'sin.out',
          // ease: 'elastic.out',
          // ease: 'bounce.out',
          // onComplete: () => {
          //   meshRef.current.material.uniforms.mousePos.value =
          //     new THREE.Vector2(1, 1);
          // },
        },
        '<'
      );
    }
  }, [isLoaded]);

  useFrame((state, delta) => {
    // console.log('mouse.current.world', mouse.current.world);
    const parentWrapper = document.querySelector('.artists__logoContainer');
    const {
      width: parentWidth,
      height: parentHeight,
      left: parentLeft,
      top: parentTop,
    } = parentWrapper.getBoundingClientRect();

    // console.log('parentTop', parentTop);

    const activeImgWrapper = document.querySelector('.artists__logoWrapper');
    const { width, height, top, left } =
      activeImgWrapper.getBoundingClientRect();

    // console.log(width, height, top, left);
    if (meshRef.current) {
      // TODO: Account for width of scrollbar in width offset calculation
      // SYNC MESH POSITION + SCALE WITH DOM IMAGE
      meshRef.current.position.x =
        parentLeft - (window.innerWidth - 16) / 2 + parentWidth / 2;
      meshRef.current.position.y =
        -parentTop + window.innerHeight / 2 - parentHeight / 2;

      meshRef.current.scale.x = parentWidth;
      meshRef.current.scale.y = parentHeight;

      meshRef.current.material.uniforms.uTime.value += delta;
      mouse.current.prev.x = THREE.MathUtils.lerp(
        mouse.current.prev.x,
        mouse.current.world.x,
        0.05
      );
      mouse.current.prev.y = THREE.MathUtils.lerp(
        mouse.current.prev.y,
        mouse.current.world.y,
        0.05
      );

      meshRef.current.material.uniforms.mousePos.value = mouse.current.prev;
      // meshRef.current.material.uniforms.mousePos.value;

      // update shader uniforms to set imgWidth and imgHeight to scale the logo texture
      // meshRef.current.material.uniforms.boxPosition.value.set(
      //   (left - (window.innerWidth - 16) / 2 + imgWidth / 2) / width,
      //   (-top + window.innerHeight / 2 - imgHeight / 2) / height
      // );
      // meshRef.current.material.uniforms.boxScale.value.set(
      //   imgWidth / width,
      //   imgHeight / height
      // );

      // UPDATE SHADER UNIFORMS
      // meshRef.current.material.uniforms.frequency.value = frequency;
      // meshRef.current.material.uniforms.amplitude.value = amplitude;
      // meshRef.current.material.uniforms.timeScale.value = timeScale;
      // meshRef.current.material.uniforms.alpha.value = alpha;
      // meshRef.current.material.uniforms.noiseScale.value = noiseScale;
      // meshRef.current.material.uniforms.dispersionSeed.value = dispersionSeed;
      // meshRef.current.material.uniforms.dispersionScale.value = dispersionScale;

      // update parent resolution and image resolution and image offset
      meshRef.current.material.uniforms.uParentResolution.value.set(
        parentWidth,
        parentHeight
      );
      meshRef.current.material.uniforms.uImageResolution.value.set(
        width,
        height
      );
      meshRef.current.material.uniforms.uImageOffset.value.set(
        left - parentLeft,
        top - parentTop
      );
    }
  });

  const uniforms = useMemo(() => {
    return {
      uTexture: {
        value: new THREE.TextureLoader().load(logo),
      },
      uParentResolution: {
        value: new THREE.Vector2(0, 0),
      },
      uImageResolution: {
        value: new THREE.Vector2(0, 0),
      },
      uImageOffset: {
        value: new THREE.Vector2(0, 0),
      },
      uOpacity: {
        value: 1,
      },
      waveScale: {
        value: new THREE.Vector2(1, 1),
      },
      frequency: {
        value: 3,
      },
      amplitude: {
        value: 0.03,
      },
      timeScale: {
        value: 1,
      },
      uTime: {
        value: 0,
      },
      alpha: {
        value: 0.3,
      },
      noiseScale: {
        value: 0,
      },
      mousePos: {
        value: new THREE.Vector2(1, 1),
      },
      dispersionSeed: {
        value: 2,
        // value: -0.4,
      },
      dispersionScale: {
        value: 3,
      },
      boxPosition: {
        value: new THREE.Vector2(1, 1),
      },
      boxScale: {
        value: new THREE.Vector2(1, 1),
      },
    };
  }, []);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        // wireframe={true}
        key={uuidv4()}
        depthWrite={false}
        uniforms={uniforms}
        transparent={true}
        vertexShader={
          /* glsl */
          `
          attribute vec4 vertCoord;
          attribute vec2 texCoord;

          // uniform vec2 uOffset;
          uniform vec2 waveScale;
          uniform float frequency;
          uniform float amplitude;
          uniform float timeScale;    
          uniform float uTime;                

          varying vec2 vUv;
          varying vec2 vTexCoord;
          varying vec4 vVertCoord;
          varying vec3 vPos;

          void main() {
            vUv = uv;
            vTexCoord = texCoord;
            vVertCoord = vertCoord;
            vPos = position;

            vec3 pos = position;
            // pos.z = sin((pos.x+pos.y)*frequency+uTime*timeScale)*amplitude;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */
          `
          uniform sampler2D uTexture;
          uniform vec2 uParentResolution;
          uniform vec2 uImageResolution;
          uniform vec2 uImageOffset;
          uniform float uTime;
          uniform float timeScale;
          uniform float alpha;
          uniform float noiseScale;
          uniform vec2 mousePos;
          uniform float dispersionSeed;
          uniform float dispersionScale;
          uniform vec2 boxPosition;
          uniform vec2 boxScale;

          varying vec2 vTexCoord;
          varying vec4 vVertCoord;      
          varying vec2 vUv;    
          varying vec3 vPos;

          vec3 permute(vec3 x) {
              return mod(((x*34.0)+1.0)*x, 289.0);
          }
          float rand(vec2 co) {
              return fract(sin(dot(co.xy, vec2(12.9898, 78.233)))*43758.5453);
          }
          float rand(vec2 co, float l) {
              return rand(vec2(rand(co), l));
          }
          float rand(vec2 co, float l, float t) {
              return rand(vec2(rand(co, l), t));
          }
          float circle(vec2 pos, float radius) {
              return 1.0-smoothstep(0.0, 1.0, length(pos)+(1.0-radius));
          }
          float simplex(vec2 v) {
              const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
              vec2 i = floor(v+dot(v, C.yy));
              vec2 x0 = v-i+dot(i, C.xx);
              vec2 i1;
              i1 = (x0.x>x0.y)?vec2(1.0, 0.0):vec2(0.0, 1.0);
              vec4 x12 = x0.xyxy+C.xxzz;
              x12.xy -= i1;
              i = mod(i, 289.0);
              vec3 p = permute(permute(i.y+vec3(0.0, i1.y, 1.0))+i.x+vec3(0.0, i1.x, 1.0));
              vec3 m = max(0.5-vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
              m = m*m;
              m = m*m;
              vec3 x = 2.0*fract(p*C.www)-1.0;
              vec3 h = abs(x)-0.5;
              vec3 ox = floor(x+0.5);
              vec3 a0 = x-ox;
              m *= 1.79284291400159-0.85373472095314*(a0*a0+h*h);
              vec3 g;
              g.x = a0.x*x0.x+h.x*x0.y;
              g.yz = a0.yz*x12.xz+h.yz*x12.yw;
              return 130.0*dot(m, g);
          }
                        
          void main() {
            vec3 position = vPos;
            vec2 uv = vUv;
            vec2 centerPoint = position.xy-mousePos.xy;
            vec2 texCoord = (uv-boxPosition)/boxScale;
            float radius = 0.7;
            float dispersion = 5.0*dispersionScale;
            float dispersionSeedScale = 0.6*(1.0-dispersionSeed);
            float dispersionNoise = simplex(sin(uv+uTime*timeScale*dispersionSeedScale)+uTime*timeScale*dispersionSeedScale)*dispersion;
            float scopeNoise = simplex(uv+uTime*timeScale)*0.01;
            float noiseScope = circle(centerPoint+scopeNoise, radius);
            float randNoise = rand(uv+mod(uTime*timeScale, 1.0))*noiseScope*0.009;
            float simplexNoise = simplex(uv+uTime*timeScale*0.3)*noiseScope*0.12;
            // vec4 image = texture2D(uTexture, uv+randNoise+simplexNoise+dispersionNoise);

            // vec2 uv = vUv;

            // center image texture to center of plane based on parent resolution, image resolution, and image offset
            // vec2 uv = vUv;
            vec2 parentResolution = uParentResolution;
            vec2 imageResolution = uImageResolution;
            vec2 imageOffset = uImageOffset;
            vec2 uv2 = (uv * parentResolution - imageOffset) / imageResolution;
            vec4 image = texture2D(uTexture, uv2 + randNoise + simplexNoise + dispersionNoise);
            // vec4 image = texture2D(uTexture, uv + randNoise+simplexNoise+dispersionNoise);
            vec4 color = vec4(image.rgb, image.a*alpha);
            // color.rgb += (rand(texCoord+mod(uTime*timeScale, 5.0))-0.5)*noiseScope;
            gl_FragColor = color;

            // gl_FragColor = vec4(uv + color.rg, 1.0, 1.0);
          }
        `
        }
      />
    </mesh>
  );
}

export default MeshLogo;
