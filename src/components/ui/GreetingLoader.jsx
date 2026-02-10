import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const greetings = [
  'Hello', 'Bonjour', 'Hola', 'Ciao', 'Hallo',
  'Olá', 'Privet', 'Konnichiwa', 'Annyeong', 'Nǐ hǎo',
  'Merhaba', 'Sawadee', 'Xin chào', 'Namaste', 'Salam',
  'Habari', 'Kamusta', 'Aloha', 'Hej', 'Selamat Pagi',
];

const DISPLAY_DURATION = 150; // ms each word stays visible

const curtainVariants = {
  visible: { y: '0%' },
  exit: {
    y: '-100%',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

export default function GreetingLoader({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [isCycleComplete, setIsCycleComplete] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Cycle through greetings instantly
  useEffect(() => {
    if (isCycleComplete) return;

    const timer = setTimeout(() => {
      if (index < greetings.length - 1) {
        setIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsCycleComplete(true), DISPLAY_DURATION);
      }
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [index, isCycleComplete]);

  const handleCurtainComplete = useCallback(() => {
    setIsDone(true);
    onComplete?.();
  }, [onComplete]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="greeting-loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          variants={curtainVariants}
          initial="visible"
          animate={isCycleComplete ? 'exit' : 'visible'}
          onAnimationComplete={(definition) => {
            if (definition === 'exit') handleCurtainComplete();
          }}
        >
          {/* Organic SVG curve at the bottom edge */}
          <div className="absolute bottom-0 left-0 w-full translate-y-[1px]">
            <svg
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              className="w-full h-12 md:h-16 block"
              fill="black"
            >
              <path d="M0,0 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,0 Z" />
            </svg>
          </div>

          {/* Greeting text — instant swap, no fade */}
          {!isCycleComplete && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight select-none">
              {greetings[index]}
            </h1>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/60 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((index + 1) / greetings.length) * 100}%` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

