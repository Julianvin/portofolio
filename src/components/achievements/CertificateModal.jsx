import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FiX, FiExternalLink } from 'react-icons/fi';

export default function CertificateModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!item) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <motion.div 
        layoutId={`card-container-${item.id}`}
        className="relative z-10 w-full max-w-6xl h-auto md:max-h-[90vh] overflow-visible md:overflow-hidden rounded-none md:rounded-2xl bg-transparent shadow-none md:bg-white md:shadow-2xl md:dark:bg-neutral-900 flex flex-col md:flex-row"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors backdrop-blur-md border border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Left Side: Image (Full Display) */}
        <motion.div 
          layoutId={`image-container-${item.id}`}
          className="relative bg-transparent w-full h-auto min-h-[50vh] max-h-[80vh] md:h-auto md:w-3/4 flex-shrink-0 flex items-center justify-center"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover md:object-contain object-center block"
          />
        </motion.div>

          {/* Right Side: Details */}
          <motion.div 
            className="hidden md:flex flex-col flex-1 min-h-0 bg-white md:flex-none md:w-1/4 relative dark:bg-neutral-900"
            transition={{ 
              duration: 0.4, 
              ease: "easeOut"
            }}
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { delay: 0.2, duration: 0.4 } 
              },
              exit: { 
                opacity: 0, 
                x: 20,
                transition: { delay: 0, duration: 0.2 } 
              }
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button Removed (Moved to top) */}
            <div className="flex-1 overflow-y-auto p-8 pt-16">
                {/* Header */}
                <div className="mb-8">
                <motion.h2 
                    layoutId={`title-${item.id}`}
                    className="mb-2 text-2xl font-bold leading-tight text-neutral-900 dark:text-white"
                >
                    {item.name}
                </motion.h2>
                <motion.p 
                    layoutId={`issuer-${item.id}`}
                    className="text-base font-medium text-neutral-500 dark:text-neutral-400"
                >
                    {item.issuing_organization}
                </motion.p>
                </div>

                {/* Metadata Grid */}
                <div className="space-y-6">
                <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Credential ID
                    </span>
                    <span className="font-mono text-sm text-neutral-800 break-all dark:text-neutral-300">
                    {item.credential_id}
                    </span>
                </div>
                
                <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Type
                    </span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-300">
                    {item.type}
                    </span>
                </div>

                <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Category
                    </span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-300">
                    {item.category}
                    </span>
                </div>

                <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Issue Date
                    </span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-300">
                    {item.issue_date}
                    </span>
                </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                <a
                    href={item.url_credential}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 font-bold text-white transition-transform hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                    Show Credential <FiExternalLink />
                </a>
                </div>
            </div>
          </motion.div>
      </motion.div>
    </div>,
    document.body
  );
}
