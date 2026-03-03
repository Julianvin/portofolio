import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import CertificateCard from '../components/achievements/CertificateCard';
import CertificateModal from '../components/achievements/CertificateModal';
import FilterDropdown from '../components/achievements/FilterDropdown';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useCachedFetch from '../hooks/useCachedFetch';
import { getPublicAchievements } from '../admin/services/achievementService';

const ACHIEVEMENT_TYPES = [
  'Course',
  'Award',
  'Badge',
  'Professional',
  'Recognition'
];

const ACHIEVEMENT_CATEGORIES = [
  'Frontend',
  'Backend',
  'Mobile',
  'Cloud Computing',
  'General',
  'Freelance',
  'Development Tools',
  'Algorithm',
  'AI',
  'Organization'
];

export default function Achievements() {
  useDocumentTitle('Pencapaian | Delvin Julian');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const containerRef = useRef(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch real data from Supabase
  const { data: achievements, isLoading, error } = useCachedFetch('publicAchievements', getPublicAchievements);

  // Filtering Logic (AND Condition)
  const filteredAchievements = useMemo(() => {
    if (!achievements) return [];
    
    return achievements.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === '' || item.type === selectedType;
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [achievements, searchQuery, selectedType, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedCategory('');
  };

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

      // Animate filter bar
      gsap.fromTo(
        '.animate-filters',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.6 }
      );

      // Only animate cards after loading completes and items exist
      if (!isLoading) {
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
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]); // Re-run GSAP when loading finishes

  return (
    <div ref={containerRef} className="max-w-4xl pt-20 md:pt-0">
      {/* Header */}
      <div className="mb-8 md:mb-12 flex items-center gap-4">
         <h1 className="animate-header text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white">Pencapaian</h1>
         <div className="animate-divider h-px flex-grow bg-neutral-200 dark:bg-neutral-800"></div>
         <span className="animate-subtitle text-neutral-500 font-mono text-sm uppercase tracking-widest hidden md:block dark:text-neutral-400">
            Sertifikasi & Penghargaan
         </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="animate-filters mb-8 flex flex-col md:flex-row gap-4 items-center relative z-10">
        {/* Search Input */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari sertifikat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:font-normal"
          />
        </div>

        {/* Filters Group for Mobile Stack / Desktop Side-by-Side */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative">
          {/* Type Filter */}
          <FilterDropdown
            value={selectedType}
            options={ACHIEVEMENT_TYPES}
            onChange={setSelectedType}
            placeholder="Semua Tipe"
          />

          {/* Category Filter */}
          <FilterDropdown
            value={selectedCategory}
            options={ACHIEVEMENT_CATEGORIES}
            onChange={setSelectedCategory}
            placeholder="Semua Kategori"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 min-h-[400px] relative z-0">
        {isLoading ? (
          // Skeleton Loader
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div className="h-[180px] w-full bg-neutral-200 dark:bg-neutral-800"></div>
              <div className="flex flex-1 flex-col p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800"></div>
                <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800"></div>
                <div className="mt-2 flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
                  <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
                </div>
                <div className="mt-auto pt-3">
                  <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800"></div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
           <div className="col-span-full py-12 text-center text-sm text-red-500">
             Gagal mengambil data pencapaian. Silakan coba lagi.
           </div>
        ) : filteredAchievements.length === 0 ? (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
               <FiFilter className="text-neutral-400 w-8 h-8" />
             </div>
             <p className="text-neutral-500 dark:text-neutral-400 mb-6">
               Tidak ditemukan pencapaian dengan filter tersebut.
             </p>
             <button
               onClick={handleResetFilters}
               className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
             >
               <FiX className="w-4 h-4" />
               Reset Filter
             </button>
           </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="animate-card"
              >
                <CertificateCard
                  item={item}
                  onClick={setSelectedAchievement}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
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
