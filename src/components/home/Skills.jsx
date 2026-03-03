import React from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import useCachedFetch from '../../hooks/useCachedFetch';
import TechPill from '../ui/TechPill';

// ── Animation variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
};

// ── Main Component ──
export default function Skills({ ready = false }) {
  const { data: techStacks, isLoading: loading } = useCachedFetch(
    'techStacks',
    async () => {
      const { data, error } = await supabase
        .from('tech_stacks')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-full bg-white/5 border border-white/5 animate-pulse"
            style={{ width: `${80 + Math.random() * 60}px` }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3"
      variants={containerVariants}
      initial="hidden"
      animate={ready ? 'visible' : 'hidden'}
    >
      {techStacks.map((tech) => (
        <TechPill key={tech.id} tech={tech} variants={pillVariants} />
      ))}
    </motion.div>
  );
}
