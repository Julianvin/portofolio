import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import SpotlightCard from '../ui/SpotlightCard';

export default function CertificateCard({ item, onClick }) {
  const { t } = useTranslation();
  return (
    <motion.div
      layoutId={`card-container-${item.id}`}
      onClick={() => onClick(item)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <SpotlightCard className="h-full w-full" spotlightColor="rgba(255, 255, 255, 0.06)">
        {/* Image Area */}
        <motion.div 
          layoutId={`image-container-${item.id}`}
          className="relative h-[180px] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800"
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              {t('achievements.view_detail')} <FiArrowRight />
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="p-4">
          {/* Credential ID if available */}
          {item.credential_id && item.credential_id !== '-' && (
            <motion.div 
              layoutId={`credential-${item.id}`}
              className="mb-1 text-[10px] font-mono font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
            >
              {item.credential_id}
            </motion.div>
          )}

          <motion.h3 
            layoutId={`title-${item.id}`}
            className="mb-1 line-clamp-2 text-lg font-bold text-neutral-900 dark:text-white"
          >
            {item.name}
          </motion.h3>
          
          <motion.p 
            layoutId={`issuer-${item.id}`}
            className="mb-3 text-sm text-neutral-500 dark:text-neutral-400"
          >
            {item.issuing_organization}
          </motion.p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
              {item.type}
            </span>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20">
              {item.category}
            </span>
          </div>

          <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
            <p className="text-xs text-neutral-400">
              {t('achievements.issue_date')} {item.issue_date}
            </p>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
