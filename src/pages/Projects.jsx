import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PROJECTS from '../data/projectsData';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectDetail from '../components/projects/ProjectDetail';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

export default function Projects() {
  const { t } = useTranslation();
  useDocumentTitle(`${t('projects.title')} | Delvin Julian`);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <LayoutGroup>
      <div className="w-full min-h-[80vh] px-2 md:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#0d1117] dark:text-[#e6edf3] mb-3">
            {t('projects.title')}
          </h1>
          <p className="text-[#656d76] dark:text-[#7d8590] text-lg max-w-2xl leading-relaxed">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        {/* Project Grid — responsive two columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
              t={t}
            />
          ))}
        </motion.div>

        {/* Expanded Detail Overlay */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
