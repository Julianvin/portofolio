import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SpotlightCard from '../ui/SpotlightCard';
import { getBadgeColor } from '../../utils/badgeColors';

export default function CertificateCard({ item, onClick }) {
  // Format the date if it's available and valid
  const formattedDate = item.issue_date 
    ? new Date(item.issue_date).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
      })
    : '-';

  return (
    <motion.div
      layoutId={`card-container-${item.id}`}
      onClick={() => onClick(item)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <SpotlightCard className="h-full w-full flex flex-col" spotlightColor="rgba(255, 255, 255, 0.06)">
        {/* Image Area */}
        <motion.div 
          layoutId={`image-container-${item.id}`}
          className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0"
        >
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            // Fallback gradient box if no image_url
            <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 transition-transform duration-500 group-hover:scale-105"></div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              Lihat Detail <FiArrowRight />
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-1">
          {/* Credential ID if available */}
          <div className="min-h-[1.25rem]">
            {item.credential_id && item.credential_id !== '-' && (
              <motion.div 
                layoutId={`credential-${item.id}`}
                className="mb-1 text-[10px] font-mono font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 line-clamp-1"
              >
                {item.credential_id}
              </motion.div>
            )}
          </div>

          <motion.h3 
            layoutId={`title-${item.id}`}
            className="mb-1 line-clamp-2 text-lg font-bold text-neutral-900 dark:text-white min-h-[3.5rem]"
          >
            {item.title}
          </motion.h3>
          
          <motion.p 
            layoutId={`issuer-${item.id}`}
            className="mb-3 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1"
          >
            {item.issuer}
          </motion.p>

          {/* Wrapper for Type/Category and Date - Pushed to bottom */}
          <div className="mt-auto pt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getBadgeColor(item.type)}`}>
                {item.type}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getBadgeColor(item.category)}`}>
                {item.category}
              </span>
            </div>

            <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <p className="text-xs text-neutral-400">
                Diterbitkan: {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
