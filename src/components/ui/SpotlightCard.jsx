import React, { useRef, useState, useCallback } from 'react';

export default function SpotlightCard({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.1)' }) {
  const divRef = useRef(null);
  const rafRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e) => {
    if (!divRef.current || rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const rect = divRef.current?.getBoundingClientRect();
      if (rect) {
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
      rafRef.current = null;
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
    // Cancel any pending rAF on leave
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}
