import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only activate on fine-pointer (mouse/trackpad) devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafId;

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const tick = () => {
      dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    };

    const onLeave  = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };
    const onEnter  = () => { dot.style.opacity = '1'; ring.style.opacity = '1'; };

    const onOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, select, textarea, label, [tabindex]');
      dot.classList.toggle('is-hovered',  !!el);
      ring.classList.toggle('is-hovered', !!el);
    };

    rafId = requestAnimationFrame(tick);
    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover',  onOver,  { passive: true });
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover',  onOver);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  id="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} id="cursor-ring" aria-hidden="true" />
    </>
  );
}
