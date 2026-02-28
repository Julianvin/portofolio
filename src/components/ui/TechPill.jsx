import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DynamicIcon from '../../admin/components/DynamicIcon';

/**
 * TechPill — A reusable, highly-optimized tech stack badge with dynamic glow effects.
 * 
 * @param {Object} tech - Tech object containing name, color, and icon_identifier (or iconIdentifier).
 * @param {Object} [variants] - Optional Framer Motion variants for staggered animations.
 */
export default function TechPill({ tech, variants }) {
  const [isHovered, setIsHovered] = useState(false);
  const brandColor = tech.color || '#656d76';
  
  // Standardize icon identifier access across different data sources
  const iconId = tech.icon_identifier || tech.iconIdentifier;

  return (
    <motion.div
      variants={variants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-flex items-center gap-2 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border cursor-default select-none transition-all duration-300 active:scale-95"
      style={{
        backgroundColor: isHovered ? `${brandColor}15` : 'rgba(255, 255, 255, 0.03)',
        borderColor: isHovered ? `${brandColor}60` : 'rgba(255, 255, 255, 0.10)',
        boxShadow: isHovered ? `0 4px 20px -5px ${brandColor}50` : 'none',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0px)',
      }}
    >
      <DynamicIcon
        iconIdentifier={iconId}
        size={16}
        className="shrink-0 transition-colors duration-300"
        style={{ color: brandColor }}
      />
      <span
        className="text-xs md:text-sm font-medium transition-colors duration-300 whitespace-nowrap"
        style={{ color: isHovered ? '#e6edf3' : '#9ca3af' }}
      >
        {tech.name}
      </span>
    </motion.div>
  );
}
