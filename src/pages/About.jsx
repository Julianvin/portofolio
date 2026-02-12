import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GoLocation, GoCalendar, GoChevronDown } from 'react-icons/go';
import { motion, AnimatePresence } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';

const responsibilities = [
  {
    title: 'Pengembangan Sistem Manajemen Proyek',
    desc: 'Merancang database dan logika aplikasi untuk fitur pengelolaan proyek serta pelacakan tugas (task tracking) karyawan.',
  },
  {
    title: 'Integrasi Dashboard Admin',
    desc: 'Mengembangkan sistem dashboard interaktif yang menampilkan diagram data, statistik, dan perhitungan kinerja perusahaan secara otomatis.',
  },
  {
    title: 'Manajemen Inventaris & Event',
    desc: 'Membangun modul sistem untuk pengelolaan barang aset perusahaan dan fitur perencanaan event internal.',
  },
  {
    title: 'Fitur Komunikasi Real-Time',
    desc: 'Mengimplementasikan sistem chat internal untuk memfasilitasi komunikasi antar pengguna dalam aplikasi.',
  },
  {
    title: 'Perancangan Database (ERD)',
    desc: 'Membuat Entity Relationship Diagram (ERD) yang efisien dan mengelola struktur database MySQL untuk memastikan integritas data.',
  },
];

export default function About() {
  useDocumentTitle('About | Delvin Julian');
  const containerRef = useRef(null);
  const [isCareerOpen, setIsCareerOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.animate-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-4xl">
      {/* Header */}
      <div className="mb-8 md:mb-12 animate-item">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">About</h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-500">A brief introduction to who I am and my professional journey.</p>
      </div>

      {/* Bio */}
      <section className="mb-10 md:mb-16 animate-item">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Introduction</h2>
        <div className="prose prose-invert max-w-none text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            I'm <span className="text-gray-900 dark:text-white font-medium">Muhammad Delvin Julian</span>, a software developer dedicated to building impactful digital solutions.
            I specialize in <span className="text-gray-900 dark:text-white font-medium">Backend Development</span> using Laravel, PHP, and MySQL, with a strong foundation in MVC architecture and RESTful API design.
          </p>
          <p className="mt-4">
            Currently, I'm an undergraduate student at <span className="text-gray-900 dark:text-white font-medium">SMK Wikrama Bogor</span>, driven by logic and performance optimizations.
          </p>
        </div>
      </section>

      {/* Career */}
      <section className="mb-10 md:mb-16 animate-item">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Career</h2>

        {/* Card */}
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-4 md:p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-colors group shadow-sm dark:shadow-none">
          {/* Card Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden shrink-0">
                <img src="/images/ptHexa.png" alt="PT Hexa" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Backend Developer Intern</h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">PT. HEXA WIRA UTAMA</p>
              </div>
            </div>
            <span className="text-[10px] md:text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-[#0d1117] px-2 py-1 rounded border border-gray-200 dark:border-[#30363d] whitespace-nowrap w-fit">
              Januari 2025 - Juni 2025
            </span>
          </div>

          {/* Summary & Toggle */}
          <div className="pl-0 md:pl-16">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Bertanggung jawab membangun logika backend dan manajemen database untuk sistem internal perusahaan guna meningkatkan efisiensi operasional.
            </p>

            <button
              onClick={() => setIsCareerOpen((prev) => !prev)}
              className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium hover:underline cursor-pointer"
            >
              {isCareerOpen ? 'Hide details' : 'Show details'}
              <motion.span
                animate={{ rotate: isCareerOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <GoChevronDown />
              </motion.span>
            </button>

            {/* Expandable Details */}
            <AnimatePresence initial={false}>
              {isCareerOpen && (
                <motion.div
                  key="career-details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 space-y-3">
                    {responsibilities.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                        <span className="text-blue-500 dark:text-blue-400 mt-0.5 font-bold select-none">{idx + 1}.</span>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="text-gray-900 dark:text-white font-semibold">{item.title}:</span>{' '}
                          {item.desc}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mb-10 md:mb-16 animate-item">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Education</h2>
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-4 md:p-6 flex items-center gap-3 md:gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden shrink-0">
            <img src="/images/wikrama.png" alt="SMK Wikrama" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">SMK WIKRAMA BOGOR</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Software Engineering (PPLG)</p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1 flex items-center gap-1.5 md:gap-2 flex-wrap">
              <GoLocation className="w-3 h-3 shrink-0" /> Bogor, Indonesia
              <span className="mx-0.5 md:mx-1">•</span>
              <GoCalendar className="w-3 h-3 shrink-0" /> July 2023 - Present
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
