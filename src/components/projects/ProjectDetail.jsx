import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiX, FiChevronRight } from 'react-icons/fi';

const spring = { type: 'spring', stiffness: 300, damping: 30 };

export default function ProjectDetail({ project, onClose }) {
  // Lock body scroll when detail is open
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.style.overflow = 'hidden';
    return () => {
      if (mainEl) mainEl.style.overflow = '';
    };
  }, []);

  const features = project.features || [];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Detail Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
        <motion.div
          layoutId={`project-card-${project.id}`}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#f6f8fa] dark:bg-[#161b22] rounded-2xl border border-[#d0d7de] dark:border-[#30363d] shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
          transition={spring}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer border border-white/10"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 detail-scroll">
            {/* Hero Image */}
            <div className="relative">
              <motion.img
                layoutId={`project-image-${project.id}`}
                src={project.image}
                alt={project.title}
                className="w-full h-56 md:h-72 object-cover object-top"
                transition={spring}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f6f8fa] dark:from-[#161b22] via-transparent to-transparent" />
            </div>

            {/* Content Body */}
            <div className="px-6 md:px-8 pb-8 -mt-12 relative z-10">
              {/* Title */}
              <motion.h2
                layoutId={`project-title-${project.id}`}
                className="text-2xl md:text-3xl font-bold text-[#0d1117] dark:text-white mb-2"
                transition={spring}
              >
                {project.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#656d76] dark:text-[#7d8590] text-base mb-5"
              >
                {project.tagline}
              </motion.p>

              {/* Action Buttons — at the top, immediately visible */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#24292e] dark:bg-[#0d1117] hover:bg-[#1c2128] border border-[#d0d7de] dark:border-[#30363d] hover:border-[#484f58] text-white font-medium text-sm transition-colors duration-200"
                  >
                    <FiGithub className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors duration-200"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                {project.techStack.map((tech) => (
                  <span
                    key={tech.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200"
                    style={{ 
                      backgroundColor: `${tech.color}15`, // ~8% opacity
                      borderColor: `${tech.color}40`,      // ~25% opacity
                      color: tech.color
                    }}
                  >
                    <tech.icon iconIdentifier={tech.iconIdentifier} className="w-4 h-4" style={{ color: tech.color }} />
                    {tech.name}
                  </span>
                ))}
              </motion.div>

              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#656d76] dark:text-[#7d8590] mb-3">
                  Ringkasan Proyek
                </h3>
                <p className="text-[#1f2328] dark:text-[#e6edf3] leading-relaxed text-base">
                  {project.description}
                </p>
              </motion.div>

              {/* Role & Responsibilities */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#656d76] dark:text-[#7d8590] mb-3">
                  Peran & Tanggung Jawab
                </h3>
                <p className="text-[#1f2328] dark:text-[#e6edf3] leading-relaxed text-base">
                  {[project.role, ...(project.responsibilities || [])].filter(Boolean).join(' — ')}
                </p>
              </motion.div>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#656d76] dark:text-[#7d8590] mb-3">
                  Fitur Utama
                </h3>
                <ul className="space-y-2.5">
                  {Array.isArray(features) && features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[#1f2328] dark:text-[#e6edf3]"
                    >
                      <FiChevronRight className="w-4 h-4 mt-1 text-blue-500 shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
