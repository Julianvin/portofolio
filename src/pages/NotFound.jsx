import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiArrowLeft, FiBookOpen, FiCode, FiUser } from 'react-icons/fi';

// ── Floating Particle Component ────────────────────────────────────
function seededValue(seed) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: seededValue(i + 1) * 100,
  y: seededValue(i + 31) * 100,
  size: seededValue(i + 61) * 4 + 1,
  duration: seededValue(i + 91) * 20 + 10,
  delay: seededValue(i + 121) * 5,
  opacity: seededValue(i + 151) * 0.3 + 0.1,
}));

function FloatingParticles() {

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-500"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ── Glitch Text Component ──────────────────────────────────────────
function GlitchText({ text }) {
  return (
    <div className="relative select-none">
      <span className="text-[8rem] md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-400 dark:from-white/20 dark:to-white/5 leading-none tracking-tighter">
        {text}
      </span>
      {/* Glitch layers */}
      <motion.span
        className="absolute inset-0 text-[8rem] md:text-[12rem] font-black text-blue-500/30 leading-none tracking-tighter"
        animate={{ x: [0, -3, 2, 0], opacity: [0, 1, 0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-[8rem] md:text-[12rem] font-black text-purple-500/30 leading-none tracking-tighter"
        animate={{ x: [0, 3, -2, 0], opacity: [0, 0.5, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, delay: 0.1 }}
      >
        {text}
      </motion.span>
    </div>
  );
}

// ── Interactive Mouse Tracker ──────────────────────────────────────
function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px] transition-all duration-500 ease-out"
        style={{
          left: pos.x - 250,
          top: pos.y - 250,
          background: 'radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(147,51,234,0.5) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}

// ── Quick Links ────────────────────────────────────────────────────
const quickLinks = [
  { to: '/', icon: FiHome, label: 'Beranda', desc: 'Halaman utama' },
  { to: '/about', icon: FiUser, label: 'Tentang', desc: 'Kenalan dulu' },
  { to: '/projects', icon: FiCode, label: 'Proyek', desc: 'Karya saya' },
  { to: '/blogs', icon: FiBookOpen, label: 'Blog', desc: 'Artikel & tutorial' },
];

// ── Main Component ─────────────────────────────────────────────────
export default function NotFound() {
  const location = useLocation();
  const [countdown, setCountdown] = useState(15);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-4 overflow-hidden selection:bg-blue-500/30">
      <Helmet>
        <title>404 — Halaman Tidak Ditemukan | Delvin Julian</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background Effects */}
      <FloatingParticles />
      <MouseGlow />

      {/* Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">

        {/* 404 Glitch Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <GlitchText text="404" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="-mt-4 mb-3"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            Sepertinya Anda tersesat. Halaman{' '}
            <code className="px-2 py-1 bg-gray-200 dark:bg-white/10 text-blue-600 dark:text-blue-400 rounded text-sm font-mono font-medium">
              {location.pathname}
            </code>{' '}
            tidak ada di website ini.
          </p>
        </motion.div>

        {/* Auto-redirect notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-gray-400 dark:text-gray-500 mb-8"
        >
          Otomatis kembali ke Beranda dalam{' '}
          <span className="font-mono font-bold text-blue-500">{countdown}</span> detik
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mb-12"
        >
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <FiHome className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/15 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <FiArrowLeft className="w-4 h-4" /> Halaman Sebelumnya
          </button>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full"
        >
          <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-mono font-semibold mb-4">
            Atau kunjungi halaman ini
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                <Link
                  to={link.to}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 group-hover:bg-blue-500/10 flex items-center justify-center transition-colors duration-300">
                    <link.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{link.label}</span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">{link.desc}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
