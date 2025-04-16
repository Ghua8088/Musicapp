import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CarController, engineSound } from '../utils/engineSounds';

const Car = () => {
  const carRef = useRef(null);
  const carController = useRef(new CarController());
  const controls = useAnimation();
  const [isEngineStarted, setIsEngineStarted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEngineStarted) return;
      
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          carController.current.accelerate();
          break;
        case 's':
        case 'arrowdown':
          carController.current.brake();
          break;
        case 'a':
        case 'arrowleft':
          carController.current.turn(-1);
          break;
        case 'd':
        case 'arrowright':
          carController.current.turn(1);
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (!isEngineStarted) return;
      
      switch(e.key.toLowerCase()) {
        case 'a':
        case 'd':
        case 'arrowleft':
        case 'arrowright':
          carController.current.turn(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      engineSound.stopAll();
    };
  }, [isEngineStarted]);

  useEffect(() => {
    if (!isEngineStarted) return;

    const updateCarPosition = () => {
      const { position, speed, turning } = carController.current.update();
      
      controls.start({
        x: position.x,
        rotateY: turning * 30,
        scale: 1 + speed * 0.002,
      });

      requestAnimationFrame(updateCarPosition);
    };

    updateCarPosition();
    engineSound.playIdle();

    return () => {
      engineSound.stopAll();
    };
  }, [isEngineStarted, controls]);

  const startEngine = () => {
    setIsEngineStarted(true);
    engineSound.playRev();
  };

  return (
    <div className="interactive-car-container">
      {!isEngineStarted && (
        <motion.button
          className="start-engine-btn"
          onClick={startEngine}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Engine
        </motion.button>
      )}
      
      <motion.div
        ref={carRef}
        className="interactive-car"
        animate={controls}
        initial={{ scale: 1 }}
      >
        <div className="car-body">
          <div className="car-window" />
          <motion.div 
            className="car-wheel front"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="car-wheel back"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="car-neon" />
          <motion.div 
            className="exhaust-flames"
            animate={{ 
              scaleX: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {isEngineStarted && (
        <div className="car-controls-hint">
          <p>Use W,A,S,D or Arrow keys to drive</p>
        </div>
      )}
    </div>
  );
};

export default Car;