import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import SpotlightCard from '../ui/SpotlightCard';

export default function ProjectCard({ project, index, onClick, t }) {
  return (
    <motion.div
      layoutId={`project-card-${project.id}`}
      onClick={onClick}
      className="cursor-pointer group"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
          },
        },
      }}
      whileHover={{
        y: -8,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.97 }}
    >
      <SpotlightCard
        className="h-full rounded-2xl bg-[#f6f8fa] dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] hover:border-gray-400 dark:hover:border-[#484f58] transition-all duration-300 overflow-hidden"
        spotlightColor="rgba(59, 130, 246, 0.12)"
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <motion.img
            layoutId={`project-image-${project.id}`}
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          {/* Hover overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* "View Project" label on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium border border-white/20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {t('projects.view_project')}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Title */}
          <motion.h3
            layoutId={`project-title-${project.id}`}
            className="text-lg font-bold text-[#0d1117] dark:text-[#e6edf3] mb-1 line-clamp-1"
          >
            {project.title}
          </motion.h3>

          {/* Tagline */}
          <p className="text-sm text-[#656d76] dark:text-[#7d8590] mb-4 line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>

          {/* Tech Stack + Action Buttons Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-200"
                  style={{ 
                    backgroundColor: `${tech.color}10`, // ~6% opacity
                    borderColor: `${tech.color}30`,      // ~18% opacity
                    color: tech.color // Keeping name same color as icon for consistency
                  }}
                >
                  <tech.icon
                    iconIdentifier={tech.iconIdentifier}
                    className="w-3.5 h-3.5"
                    style={{ color: tech.color }}
                  />
                  {tech.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-lg bg-[#0d1117] dark:bg-[#f6f8fa]/10 border border-[#30363d] flex items-center justify-center text-[#7d8590] hover:text-white hover:border-[#484f58] transition-colors duration-200"
                  title={t('projects.github')}
                >
                  <FiGithub className="w-3.5 h-3.5" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors duration-200"
                  title={t('projects.demo')}
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
