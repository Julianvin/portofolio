import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';


// ── Characters for scramble effect ──
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>/{}[]';

// ── Floating code symbols config ──
const CODE_SYMBOLS = ['</>', '{ }', '=>', '//', '( )', '[ ]', '&&', '||', '===', '++', '**', '::'];

// ── Track real website resource loading ──
function useResourceLoading() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const checkResources = async () => {
      await document.fonts.ready;

      const images = Array.from(document.querySelectorAll('img'));
      if (images.length > 0) {
        let loadedCount = 0;
        await Promise.all(
          images.map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete) {
                  loadedCount++;
                  resolve();
                } else {
                  img.onload = img.onerror = () => {
                    loadedCount++;
                    resolve();
                  };
                }
              })
          )
        );
      }

      // NOTE: Do NOT setLoaded(true) here!
      // Only Promise.all below should control when loading is "done",
      // to guarantee the minimum display time is respected.
    };

    // Minimum 5s display time so all enhanced animations play out
    const minDelay = new Promise((r) => setTimeout(r, 5000));
    Promise.all([checkResources(), minDelay]).then(() => {
      if (!cancelled) {
        setProgress(100);
        setLoaded(true);
      }
    });

    return () => { cancelled = true; };
  }, []);

  return { loaded, progress };
}

// ── Mouse parallax hook ──
function useMouseParallax() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      // Normalize to -1 to 1 range from center
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      // Lerp for smooth movement
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.08;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.08;
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return smoothRef;
}

// ── Particle Field Component ──
function ParticleField({ mouseRef }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const PARTICLE_COUNT = 80;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseOffset: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.8 + 0.2, // For parallax layering
    }));

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      const mx = mouseRef?.current?.x || 0;
      const my = mouseRef?.current?.y || 0;

      particlesRef.current.forEach((p) => {
        // Natural movement
        p.x += p.speedX;
        p.y += p.speedY;

        // Parallax offset based on depth
        const parallaxX = mx * p.depth * 20;
        const parallaxY = my * p.depth * 20;

        // Wrap around screen
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Pulse opacity
        const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.5 + 0.5;
        const alpha = p.opacity * (0.5 + pulse * 0.5);

        const drawX = p.x + parallaxX;
        const drawY = p.y + parallaxY;

        // Draw glow
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.size * 3);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 187, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw subtle connection lines between close particles
      particlesRef.current.forEach((p1, i) => {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = (p1.x + mx * p1.depth * 20) - (p2.x + mx * p2.depth * 20);
          const dy = (p1.y + my * p1.depth * 20) - (p2.y + my * p2.depth * 20);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.06;
            ctx.beginPath();
            ctx.moveTo(p1.x + mx * p1.depth * 20, p1.y + my * p1.depth * 20);
            ctx.lineTo(p2.x + mx * p2.depth * 20, p2.y + my * p2.depth * 20);
            ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

// ── Floating Code Symbols Component ──
function FloatingSymbols({ mouseRef }) {
  const symbols = useMemo(() =>
    CODE_SYMBOLS.map((symbol, i) => ({
      symbol,
      id: i,
      x: 5 + Math.random() * 90, // percentage
      y: 5 + Math.random() * 90,
      size: 10 + Math.random() * 6,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
      depth: 0.3 + Math.random() * 0.7,
      rotateRange: (Math.random() - 0.5) * 30,
    })), []);

  const symbolRefs = useRef([]);

  useEffect(() => {
    // Animate each symbol with GSAP
    symbolRefs.current.forEach((el, i) => {
      if (!el) return;
      const s = symbols[i];

      // Floating animation
      gsap.to(el, {
        y: `${-30 + Math.random() * 60}px`,
        x: `${-20 + Math.random() * 40}px`,
        rotation: s.rotateRange,
        duration: s.duration / 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: s.delay,
      });

      // Fade in
      gsap.fromTo(el,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, delay: s.delay * 0.3, ease: 'power2.out' }
      );
    });
  }, [symbols]);

  // Mouse parallax update via RAF
  useEffect(() => {
    let raf;
    const update = () => {
      const mx = mouseRef?.current?.x || 0;
      const my = mouseRef?.current?.y || 0;

      symbolRefs.current.forEach((el, i) => {
        if (!el) return;
        const depth = symbols[i].depth;
        const px = mx * depth * 25;
        const py = my * depth * 25;
        el.style.setProperty('--px', `${px}px`);
        el.style.setProperty('--py', `${py}px`);
      });

      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, [mouseRef, symbols]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {symbols.map((s, i) => (
        <span
          key={s.id}
          ref={(el) => (symbolRefs.current[i] = el)}
          className="absolute select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            color: 'rgba(59, 130, 246, 0.08)',
            fontWeight: 300,
            opacity: 0,
            transform: 'translate(var(--px, 0), var(--py, 0))',
            willChange: 'transform',
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}

// ── Text Scramble Hook ──
function useTextScramble(targetText, options = {}) {
  const { startDelay = 0, duration = 1500, staggerPerChar = 50 } = options;
  const [displayChars, setDisplayChars] = useState(
    targetText.split('').map(() => ({ char: ' ', isResolved: false }))
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    const chars = targetText.split('');
    const totalChars = chars.length;
    const resolveOrder = chars.map((_, i) => i);

    // Start scrambling after delay
    const startTimeout = setTimeout(() => {
      let scrambleCount = 0;
      const maxScrambles = Math.floor(duration / 30); // ~30ms per frame
      const resolveInterval = duration / totalChars;

      intervalRef.current = setInterval(() => {
        scrambleCount++;
        const elapsed = scrambleCount * 30;

        setDisplayChars(
          chars.map((targetChar, i) => {
            // Resolve characters progressively
            const charResolveTime = i * staggerPerChar;
            if (elapsed >= charResolveTime + resolveInterval) {
              return { char: targetChar, isResolved: true };
            }
            // Still scrambling
            if (targetChar === ' ') return { char: '\u00A0', isResolved: false };
            const randomChar = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            return { char: randomChar, isResolved: false };
          })
        );

        // All resolved
        if (elapsed >= duration + staggerPerChar * totalChars) {
          clearInterval(intervalRef.current);
          setDisplayChars(chars.map((c) => ({ char: c === ' ' ? '\u00A0' : c, isResolved: true })));
        }
      }, 30);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetText, startDelay, duration, staggerPerChar]);

  return displayChars;
}

export default function GreetingLoader({ onComplete }) {
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef(null);
  const mainContentRef = useRef(null);
  const tlRef = useRef(null);
  const counterRef = useRef(null);
  const hasExitedRef = useRef(false);
  const { loaded } = useResourceLoading();
  const mouseSmooth = useMouseParallax();

  // Text scramble for the name — starts after 800ms (after line draws)
  const name = 'DELVIN JULIAN';
  const scrambledChars = useTextScramble(name, {
    startDelay: 600,
    duration: 1200,
    staggerPerChar: 60,
  });

  // ── Mouse parallax for main content ──
  useEffect(() => {
    let raf;
    const update = () => {
      if (mainContentRef.current) {
        const mx = mouseSmooth.current.x;
        const my = mouseSmooth.current.y;
        mainContentRef.current.style.transform =
          `translate(${mx * 8}px, ${my * 8}px)`;
      }
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, [mouseSmooth]);

  // ── Build the intro timeline on mount ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
      });

      // Phase 1: Draw the horizontal line from center
      tl.fromTo('.intro-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }
      )

      // Phase 2: Reveal name letters with stagger (clip-path mask)
      // Now combined with scramble effect
      .fromTo('.intro-char',
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.6, stagger: 0.035, ease: 'power3.out' },
        '-=0.3'
      )

      // Phase 3: Role text — blur-to-sharp + fade in
      .fromTo('.intro-role',
        { opacity: 0, filter: 'blur(12px)', y: 15 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      )

      // Phase 4: Counter — 0 → value
      .fromTo('.intro-counter',
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.6'
      );

      // Animate the counter number
      tl.to(counterRef, {
        current: 100,
        duration: 2.5,
        ease: 'power1.inOut',
        snap: { current: 1 },
        onUpdate: () => {
          const el = document.querySelector('.intro-counter-value');
          if (el) el.textContent = Math.floor(counterRef.current);
        },
      }, '-=0.8');

      tlRef.current = tl;
    }, containerRef);

    counterRef.current = 0;

    return () => ctx.revert();
  }, []);

  // ── When resources loaded → play exit animation ──
  useEffect(() => {
    if (loaded && !hasExitedRef.current) {
      hasExitedRef.current = true;

      // Wait for counter to finish, then exit
      const exitDelay = setTimeout(() => {
        const ctx = gsap.context(() => {
          const exitTl = gsap.timeline({
            onComplete: () => {
              setIsDone(true);
              onComplete?.();
            },
          });

          // Fade out particles & symbols
          exitTl.to('.intro-particles, .intro-symbols', {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.in',
          })

          // Fade out the counter and role
          .to('.intro-counter, .intro-role', {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: 'power2.in',
          }, '-=0.4')

          // Collapse the line
          .to('.intro-line', {
            scaleX: 0,
            duration: 0.5,
            ease: 'power3.inOut',
          }, '-=0.2')

          // Name characters slide up and out
          .to('.intro-char', {
            y: '-110%',
            opacity: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: 'power3.in',
          }, '-=0.4')

          // Whole container slides up dramatically
          .to(containerRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
          }, '-=0.1');
        }, containerRef);
      }, 800);

      return () => clearTimeout(exitDelay);
    }
  }, [loaded, onComplete]);

  if (isDone) return null;

  const chars = name.split('');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0d1117' }}
    >
      {/* ── Ambient background grain texture ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Particle field ── */}
      <div className="intro-particles absolute inset-0">
        <ParticleField mouseRef={mouseSmooth} />
      </div>

      {/* ── Floating code symbols ── */}
      <div className="intro-symbols absolute inset-0">
        <FloatingSymbols mouseRef={mouseSmooth} />
      </div>

      {/* ── Radial vignette overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(13,17,23,0.7) 100%)',
        }}
      />

      {/* ── Top-left corner mark ── */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <p
          className="intro-counter text-[11px] tracking-[0.3em] uppercase font-light"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: 'rgba(255,255,255,0.3)',
            opacity: 0,
          }}
        >
          Portfolio · 2026
        </p>
      </div>

      {/* ── Counter (bottom-right) ── */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <p
          className="intro-counter flex items-baseline gap-1"
          style={{ opacity: 0 }}
        >
          <span
            className="intro-counter-value text-5xl md:text-7xl font-extralight tabular-nums"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: 'rgba(255,255,255,0.08)',
              lineHeight: 1,
            }}
          >
            0
          </span>
        </p>
      </div>

      {/* ── Main content (with mouse parallax) ── */}
      <div ref={mainContentRef} className="relative flex flex-col items-center gap-6" style={{ willChange: 'transform' }}>
        {/* Horizontal accent line */}
        <div
          className="intro-line w-12 md:w-16 h-px origin-center"
          style={{
            backgroundColor: '#3b82f6',
            boxShadow: '0 0 20px rgba(59,130,246,0.3)',
            transform: 'scaleX(0)',
          }}
        />

        {/* Name — split characters with scramble effect */}
        <h1 className="flex overflow-hidden">
          {chars.map((char, i) => (
            <span
              key={i}
              className="intro-char inline-block relative"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                fontWeight: 200,
                letterSpacing: '0.15em',
                color: scrambledChars[i]?.isResolved ? '#e6edf3' : '#3b82f6',
                transform: 'translateY(110%)',
                opacity: 0,
                transition: 'color 0.15s ease',
                ...(char === ' ' ? { width: '0.3em' } : {}),
              }}
            >
              {scrambledChars[i]?.char || (char === ' ' ? '\u00A0' : char)}
            </span>
          ))}
        </h1>

        {/* Role subtitle */}
        <p
          className="intro-role text-xs md:text-sm tracking-[0.35em] uppercase font-light"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: 'rgba(255,255,255,0.4)',
            opacity: 0,
            filter: 'blur(12px)',
          }}
        >
          Software Developer
        </p>

        {/* Bottom accent line */}
        <div
          className="intro-line w-12 md:w-16 h-px origin-center"
          style={{
            backgroundColor: '#3b82f6',
            boxShadow: '0 0 20px rgba(59,130,246,0.3)',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* ── Reduced motion fallback ── */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .intro-char, .intro-line, .intro-role, .intro-counter {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
            filter: none !important;
          }
        }
      `}</style>
    </div>
  );
}
