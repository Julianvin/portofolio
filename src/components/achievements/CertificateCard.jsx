import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function CertificateCard({ item, onClick }) {
  return (
    <motion.div
      layoutId={`card-container-${item.id}`}
      onClick={() => onClick(item)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Image Area */}
      <div className="relative h-[180px] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <motion.img
          layoutId={`image-${item.id}`}
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            View detail <FiArrowRight />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
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

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {item.type}
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {item.category}
          </span>
        </div>

        <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
          <p className="text-xs text-neutral-400">
            Issued on {item.issue_date}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
