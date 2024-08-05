import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../App';

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

function MeshImage({ activeImg, imgOpacity, offset }) {
  const textures = useStore((state) => state.textures);
  const meshRef = useRef(null);
  const textureRef = useRef(null);
  const opacityRef = useRef(0);

  textureRef.current = useMemo(
    () => textures[activeImg],
    [activeImg, textures]
  );

  useFrame(({ clock }) => {
    const activeImgWrapper = document.querySelector('.artists__imgWrapper');
    const { width, height, top, left } =
      activeImgWrapper.getBoundingClientRect();
    if (meshRef.current) {
      // TODO: Account for width of scrollbar in width offset calculation
      // SYNC MESH POSITION + SCALE WITH DOM IMAGE
      meshRef.current.position.x =
        left - (window.innerWidth - 16) / 2 + width / 2;
      meshRef.current.position.y = -top + window.innerHeight / 2 - height / 2;
      meshRef.current.scale.x = width;
      meshRef.current.scale.y = height;

      // UPDATE SHADER UNIFORMS
      meshRef.current.material.uniforms.uOffset.value.set(
        (offset.targetX - offset.currentX) * 0.00075,
        -(offset.targetY - offset.currentY) * 0.00075
      );
      meshRef.current.material.uniforms.uTexture.value = textureRef.current;
      // meshRef.current.material.uniforms.uOpacity.value = imgOpacity;
      // lerp opacity to target opacity
      opacityRef.current = lerp(opacityRef.current, imgOpacity, 0.3);
      meshRef.current.material.uniforms.uOpacity.value = opacityRef.current;
    }
  });

  const uniforms = useMemo(() => {
    return {
      uTexture: {
        value: 0,
      },
      uOffset: {
        value: new THREE.Vector2(0, 0),
      },
      uOpacity: {
        value: 0,
      },
    };
  }, []);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        // wireframe={true}
        depthWrite={false}
        uniforms={uniforms}
        transparent={true}
        vertexShader={`
          uniform vec2 uOffset;

          varying vec2 vUv;

          float PI = 3.141592653589793238;

          vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
            position.x = position.x + (sin(uv.y * PI) * offset.x);
            position.y = position.y + (sin(uv.x * PI) * offset.y);
            return position;
          }

          void main() {
            vUv = uv;

            vec3 newPosition = position;
            newPosition = deformationCurve(newPosition, uv, uOffset);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform vec2 uOffset;
          uniform float uOpacity;
          varying vec2 vUv;

          vec3 rgbShift(sampler2D imageTexture, vec2 uv, vec2 offset) {
            float r = texture2D(imageTexture, uv + offset * 0.5).r;
            vec2 gb = texture2D(imageTexture, uv).gb;
            return vec3(r, gb);
          }

          void main() {
            vec3 color = rgbShift(uTexture, vUv, uOffset);
            gl_FragColor = vec4(color, uOpacity);
            // gl_FragColor = vec4(vUv.x, 0, vUv.y, uOpacity);
          }
        `}
      />
    </mesh>
  );
}

export default MeshImage;
