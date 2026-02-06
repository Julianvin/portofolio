import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoOrganization, GoLocation } from 'react-icons/go';
import Skills from '../components/home/Skills';

export default function Home() {
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
              Hi, I'm <br/>
              <span className="text-blue-600 dark:text-blue-500">Muhammad Delvin Julian</span>
          </h1>
          <div className="hero-animate flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] shadow-sm dark:shadow-none">
                  <GoLocation className="w-4 h-4" /> Based in Bogor, Indonesia
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] shadow-sm dark:shadow-none">
                    <GoOrganization className="w-4 h-4" /> Remote / Onsite
              </span>
          </div>
      </section>

      {/* Bio Text */}
      <section className="mb-20">
          <p className="bio-animate text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light max-w-3xl">
               I'm a <span className="text-gray-900 dark:text-white font-medium">Backend Developer</span> specialized in building secure, efficient, and scalable web systems. 
               Proficient in <span className="text-gray-900 dark:text-white">Laravel</span>, <span className="text-gray-900 dark:text-white">PHP</span>, and <span className="text-gray-900 dark:text-white">MySQL</span>, with a strong foundation in software developer from SMK Wikrama Bogor.
          </p>
      </section>

      {/* Premium Skills Grid */}
      <section>
          <div className="bio-animate mb-8 flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Skills</h2>
              <span className="text-blue-600 dark:text-blue-500 font-mono text-xs bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">Tech Stack</span>
          </div>
          
          <div className="w-full">
            <Skills ready={skillsReady} />
          </div>
      </section>

    </div>
  );
}