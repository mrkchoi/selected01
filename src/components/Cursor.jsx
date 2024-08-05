import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../App';
// import { useStore } from '../App';

const SPEED = 0.07;

// Create objects to track mouse position and custom cursor position
const mouse = { x: 0, y: 0 }; // Track current mouse position
const previousMouse = { x: 0, y: 0 }; // Store the previous mouse position
const circle = { x: 0, y: 0 }; // Track the circle position

// Initialize variables to track scaling and rotation
let currentScale = 0; // Track current scale value
let currentAngle = 0; // Track current angle value

function Cursor() {
  const activeCursor = useStore((state) => state.activeCursor);
  const cursor = useRef(null);
  // const activeCursor = useStore((state) => state.activeCursor);
  // const activeProject = useStore((state) => state.activeProject);
  const [text, setText] = useState('Hold');

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (activeCursor) {
      cursor.current.classList.add('active');
      // setText('Hold');
    } else {
      cursor.current.classList.remove('active');
      // setText('');
    }
  }, [activeCursor]);

  // useEffect(() => {
  //   if (activeProject) {
  //     setText(
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="16"
  //         height="16"
  //         fill="currentColor"
  //         viewBox="0 0 16 16"
  //       >
  //         <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
  //       </svg>
  //     );
  //   } else {
  //     setText('View');
  //   }
  // }, [activeProject]);

  useEffect(() => {
    const tick = () => {
      // MOVE
      // Calculate circle movement based on mouse position and smoothing
      circle.x += (mouse.x - circle.x) * SPEED;
      circle.y += (mouse.y - circle.y) * SPEED;
      // Create a transformation string for cursor translation
      const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

      // SQUEEZE
      // 1. Calculate the change in mouse position (deltaMouse)
      const deltaMouseX = mouse.x - previousMouse.x;
      const deltaMouseY = mouse.y - previousMouse.y;
      // Update previous mouse position for the next frame
      previousMouse.x = mouse.x;
      previousMouse.y = mouse.y;
      // 2. Calculate mouse velocity using Pythagorean theorem and adjust speed
      const mouseVelocity = Math.min(
        Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4,
        150
      );
      // 3. Convert mouse velocity to a value in the range [0, 0.5]
      const scaleValue = (mouseVelocity / 150) * 0.5;
      // 4. Smoothly update the current scale
      currentScale += (scaleValue - currentScale) * SPEED;
      // 5. Create a transformation string for scaling
      const scaleTransform = `scale(${1}, ${1})`;
      // const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

      // ROTATE
      // 1. Calculate the angle using the atan2 function
      const angle = (Math.atan2(deltaMouseY, deltaMouseX) * 180) / Math.PI;
      // 2. Check for a threshold to reduce shakiness at low mouse velocity
      if (mouseVelocity > 20) {
        currentAngle = angle;
      }
      // 3. Create a transformation string for rotation
      // const rotateTransform = `rotate(${currentAngle}deg)`;
      const rotateTransform = `rotate(${0}deg)`;
      // Apply all transformations to the circle element in a specific order: translate -> rotate -> scale
      if (cursor.current) {
        cursor.current.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;
      }

      // Request the next frame to continue the animation
      window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.cancelAnimationFrame(tick);
    };
  }, []);

  return (
    <div
      ref={cursor}
      className="circle z-[99] flex items-center justify-center"
    >
      <span className="circleText font-extralight">{text}</span>
    </div>
  );
}

export default Cursor;
