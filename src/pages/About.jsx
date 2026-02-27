import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GoLocation, GoCalendar, GoChevronDown } from 'react-icons/go';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function About() {
  const { t, i18n } = useTranslation();
  useDocumentTitle('About | Delvin Julian');
  const containerRef = useRef(null);
  
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  // Helper to toggle detail for a specific item
  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get other data from translation
  const educationItems = t('about.education_items', { returnObjects: true });
  const school = educationItems[0];

  useEffect(() => {
    async function loadExperiences() {
      try {
        const { getPublicExperiences } = await import('../admin/services/experienceService');
        const data = await getPublicExperiences();
        setExperiences(data);
      } catch (err) {
        console.error("Failed to load experiences:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadExperiences();

    const ctx = gsap.context(() => {
      // Small delay to ensure items are in DOM if loading finishes fast
      setTimeout(() => {
        gsap.fromTo(
          '.animate-item',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
        );
      }, 300);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return t('common.present') || 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div ref={containerRef} className="max-w-4xl">
      {/* Header */}
      <div className="mb-8 md:mb-12 animate-item">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">{t('about.title')}</h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-500">{t('about.subtitle')}</p>
      </div>

      {/* Bio */}
      <section className="mb-10 md:mb-16 animate-item">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">{t('about.intro_title')}</h2>
        <div className="prose prose-invert max-w-none text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            <Trans i18nKey="about.intro_text_1" components={{ 
              1: <span className="text-gray-900 dark:text-white font-medium" />,
              3: <span className="text-gray-900 dark:text-white font-medium" />
            }} />
          </p>
          <p className="mt-4">
             <Trans i18nKey="about.intro_text_2" components={{ 
              1: <span className="text-gray-900 dark:text-white font-medium" />
            }} />
          </p>
        </div>
      </section>

      {/* Career */}
      <section className="mb-10 md:mb-16 animate-item">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">{t('about.career_title')}</h2>

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
              const displayRole = i18n.language === 'id' && exp.role_id ? exp.role_id : exp.role;
              const displayDescription = i18n.language === 'id' && exp.description_id ? exp.description_id : exp.description;
              const responsibilities = (i18n.language === 'id' && exp.responsibilities_id && exp.responsibilities_id.length > 0) 
                ? exp.responsibilities_id 
                : (exp.responsibilities || []);
              
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
                      {isExpanded ? t('about.career_toggle_hide') : t('about.career_toggle_show')}
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
                                  {item}
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
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">{t('about.education_title')}</h2>
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
