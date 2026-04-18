import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoOrganization, GoLocation, GoCheckCircleFill, GoBriefcase } from 'react-icons/go';
import Skills from '../components/home/Skills';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle('Delvin Julian | Software Developer');
  const containerRef = useRef(null);
  const [skillsReady, setSkillsReady] = useState(false);

  useEffect(() => {
    // Reset state dulu untuk memastikan animasi ulang saat refresh (opsional, tapi bagus untuk debug)
    setSkillsReady(false);

    const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Hero Fade Up
        tl.fromTo(
            '.hero-animate',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15 } // Stagger teks header
        )
        // Bio Fade Up
        .fromTo(
            '.bio-animate',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            '-=0.5' 
        )
        // Set state skill menjadi true SETELAH animasi selesai
        .to({}, { duration: 0.2 }) // Dummy wait sebentar
        .call(() => {
             console.log("Triggering Skills Animation..."); // Cek console browser
             setSkillsReady(true);
        });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-4xl py-8">
      {/* Hero Header */}
      <section className="mb-16">
          <h1 className="hero-animate text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Halo, Saya <br/>
              <span className="text-blue-600 dark:text-blue-500">Muhammad Delvin Julian</span>
          </h1>
          <div className="hero-animate flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">
              {/* Location Pill */}
              <div className="relative group cursor-default">
                  <span className="relative flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_4px_15px_-3px_rgba(59,130,246,0.3)] group-hover:border-blue-500/30">
                      <GoLocation className="w-4 h-4 text-blue-500 transition-transform duration-300 group-hover:scale-110" /> 
                      Bogor, Indonesia
                  </span>
              </div>
              
              {/* Open To Work Status Pill */}
              <div className="relative group cursor-default mt-1 md:mt-0">
                  {/* Noticeable ambient glow to make it pop */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 via-green-500/50 to-emerald-500/50 dark:from-emerald-500/40 dark:via-green-500/40 dark:to-emerald-500/40 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  <span className="relative flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-500/10 dark:via-green-500/10 dark:to-emerald-500/10 border-emerald-400/80 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 transition-all duration-300 group-hover:-translate-y-1 shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:shadow-[0_4px_20px_-3px_rgba(16,185,129,0.6)]">
                      {/* Pinging dot for attention */}
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
                      </span>
                      <span className="font-bold tracking-wide">Open To Work</span>
                  </span>
              </div>
          </div>
      </section>

      {/* Bio Text */}
      <section className="mb-20">
          <p className="bio-animate text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light max-w-3xl">
            Memadukan <span className="text-gray-900 dark:text-white font-medium">logika sistem yang solid</span> dengan antarmuka UI yang interaktif. Saya berfokus merancang <span className="text-gray-900 dark:text-white">solusi teknologi end-to-end</span> yang <span className="text-gray-900 dark:text-white">berperforma tinggi</span>, <span className="text-gray-900 dark:text-white">aman</span>, dan <span className="text-gray-900 dark:text-white">mudah dikembangkan</span>.
          </p>
      </section>

      {/* Premium Skills Grid */}
      <section>
          <div className="bio-animate mb-8 flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Teknologi yang saya gunakan</h2>
              <span className="text-blue-600 dark:text-blue-500 font-mono text-xs bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">Alat</span>
          </div>
          
          <div className="w-full">
            <Skills ready={skillsReady} />
          </div>
      </section>

    </div>
  );
}