import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CertificateCard from '../components/achievements/CertificateCard';
import CertificateModal from '../components/achievements/CertificateModal';
import { achievements } from '../components/achievements/data';

export default function Achievements() {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  return (
    <div className="min-h-screen container mx-auto px-4 py-24">
      {/* Header */}
      <div className="mb-12 flex items-center gap-4">
         <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white">Achievements</h1>
         <div className="h-px flex-grow bg-neutral-200 dark:bg-neutral-800"></div>
         <span className="text-neutral-500 font-mono text-sm uppercase tracking-widest hidden md:block dark:text-neutral-400">
            Certifications & Awards
         </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {achievements.map((item) => (
          <CertificateCard
            key={item.id}
            item={item}
            onClick={setSelectedAchievement}
          />
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
