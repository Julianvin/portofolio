import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import CertificateCard from '../components/achievements/CertificateCard';
import CertificateModal from '../components/achievements/CertificateModal';
import { achievements } from '../components/achievements/data';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Achievements() {
  const { t } = useTranslation();
  useDocumentTitle('Achievements | Delvin Julian');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        '.animate-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );

      // Divider line grows in
      gsap.fromTo(
        '.animate-divider',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 }
      );

      // Subtitle fades in
      gsap.fromTo(
        '.animate-subtitle',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.5 }
      );

      // Cards cascade in with stagger
      gsap.fromTo(
        '.animate-card',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.4,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-4xl">
      {/* Header */}
      <div className="mb-8 md:mb-12 flex items-center gap-4">
         <h1 className="animate-header text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white">{t('achievements.title')}</h1>
         <div className="animate-divider h-px flex-grow bg-neutral-200 dark:bg-neutral-800"></div>
         <span className="animate-subtitle text-neutral-500 font-mono text-sm uppercase tracking-widest hidden md:block dark:text-neutral-400">
            {t('achievements.subtitle')}
         </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item) => (
          <div key={item.id} className="animate-card">
            <CertificateCard
              item={item}
              onClick={setSelectedAchievement}
            />
          </div>
        ))}
      </div>

      {/* Modal with Shared Element Transition */}
      <AnimatePresence>
        {selectedAchievement && (
          <CertificateModal
            item={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

