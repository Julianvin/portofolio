import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GoLocation, GoCalendar, GoChevronDown } from 'react-icons/go';
import { FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useCachedFetch from '../hooks/useCachedFetch';
import { getPublicExperiences } from '../admin/services/experienceService';

export default function About() {
  useDocumentTitle('Tentang Saya | Delvin Julian');
  const containerRef = useRef(null);
  
  const { data: experiences, isLoading } = useCachedFetch('publicExperiences', getPublicExperiences);
  const [expandedItems, setExpandedItems] = useState({});

  // Helper to toggle detail for a specific item
  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Hardcoded education data in Indonesian
  const school = {
    school: 'SMK Wikrama Bogor',
    major: 'Pengembangan Perangkat Lunak dan Gim',
    location: 'Bogor, Indonesia',
    period: '2022 - 2026'
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.animate-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sekarang';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Format responsibility text: bold the part before the first colon
  const formatResponsibility = (text) => {
    if (!text) return text;
    const colonIndex = text.indexOf(':');
    if (colonIndex === -1) return text;

    const before = text.substring(0, colonIndex + 1);
    const after = text.substring(colonIndex + 1);

    return (
      <>
        <span className="font-semibold text-gray-800 dark:text-gray-100">{before}</span>
        {after}
      </>
    );
  };

  return (
    <div ref={containerRef} className="w-full min-h-[80vh] px-2 md:px-8 py-8 md:py-12">
      {/* Header (Matching Site Style) */}
      <div className="mb-8 md:mb-12 flex items-center gap-4">
         <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 hidden sm:flex"
         >
           <FiUser className="w-5 h-5 text-blue-500" />
         </motion.div>
         <motion.h1
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight"
         >
           Tentang Saya
         </motion.h1>
         <motion.div
           initial={{ scaleX: 0 }}
           animate={{ scaleX: 1 }}
           style={{ transformOrigin: 'left' }}
           className="h-px flex-grow bg-neutral-200 dark:bg-neutral-800"
         />
         <motion.span
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-neutral-500 font-mono text-sm uppercase tracking-widest hidden md:block dark:text-neutral-400"
         >
            Profil & Perjalanan
         </motion.span>
      </div>

      <div className="mb-10 animate-item">
        <p className="text-[#656d76] dark:text-[#7d8590] text-lg max-w-2xl leading-relaxed">
          Membangun pengalaman digital yang bermakna melalui baris kode.
        </p>
      </div>

      {/* Bio */}
      <section className="mb-10 md:mb-16 animate-item">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Kisah Saya</h2>
        <div className="prose prose-invert max-w-none text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            Halo! Saya <span className="text-gray-900 dark:text-white font-medium">Delvin Julian</span>, seorang Pengembang Fullstack yang berdedikasi untuk menciptakan aplikasi web yang intuitif dan berorientasi pengguna. Perjalanan saya dimulai dengan rasa ingin tahu tentang bagaimana hal-hal bekerja di balik layar, yang kemudian berkembang menjadi hasrat untuk membangun <span className="text-gray-900 dark:text-white font-medium">solusi digital yang elegan dan skalabel</span>.
          </p>
          <p className="mt-4">
            Saya percaya bahwa teknologi harus memberdayakan orang lain, dan saya berusaha untuk mencapainya dengan menulis <span className="text-gray-900 dark:text-white font-medium">kode yang bersih dan efisien</span> serta terus mempelajari teknologi terbaru.
          </p>
        </div>
      </section>

      {/* Career */}
      <section className="mb-10 md:mb-16 animate-item">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Pengalaman Karir</h2>

        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/4" />
                      <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            experiences.map((exp) => {
              const displayRole = exp.role;
              const displayDescription = exp.description;
              const responsibilities = exp.responsibilities || [];
              
              const isExpanded = expandedItems[exp.id];
              const period = `${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`;

              return (
                <div key={exp.id} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-4 md:p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-colors group shadow-sm dark:shadow-none">
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden shrink-0">
                        {exp.image_url ? (
                          <img src={exp.image_url} alt={exp.company_name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                            <span className="text-[10px] font-bold">{exp.company_name?.substring(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{displayRole}</h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{exp.company_name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] md:text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-[#0d1117] px-2 py-1 rounded border border-gray-200 dark:border-[#30363d] whitespace-nowrap w-fit">
                      {period}
                    </span>
                  </div>

                  {/* Summary & Toggle */}
                  <div className="pl-0 md:pl-16">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {displayDescription}
                    </p>

                    <button
                      onClick={() => toggleItem(exp.id)}
                      className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                    >
                      {isExpanded ? 'Sembunyikan Detail' : 'Lihat Detail'}
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="inline-flex"
                      >
                        <GoChevronDown />
                      </motion.span>
                    </button>

                    {/* Expandable Details */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key={`career-details-${exp.id}`}
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
                                  {formatResponsibility(item)}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Education */}
      <section className="mb-10 md:mb-16 animate-item">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Pendidikan</h2>
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-4 md:p-6 flex items-center gap-3 md:gap-4 shadow-sm dark:shadow-none">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden shrink-0">
            <img src="/images/wikrama.png" alt="SMK Wikrama" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{school.school}</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{school.major}</p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1 flex items-center gap-1.5 md:gap-2 flex-wrap">
              <GoLocation className="w-3 h-3 shrink-0" /> {school.location}
              <span className="mx-0.5 md:mx-1">•</span>
              <GoCalendar className="w-3 h-3 shrink-0" /> {school.period}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
