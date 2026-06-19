import React, { useState } from 'react';
import { FiFolder } from 'react-icons/fi';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useCachedFetch from '../hooks/useCachedFetch';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectDetail from '../components/projects/ProjectDetail';
import { getPublicProjects } from '../admin/services/projectService';
import DynamicIcon from '../admin/components/DynamicIcon';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Projects() {
  useDocumentTitle(`Proyek | Delvin Julian`);
  
  const [selectedProject, setSelectedProject] = useState(null);

  const { data: projects, isLoading, error } = useCachedFetch(
    'publicProjects',
    async () => {
      const rawProjects = await getPublicProjects();
      return rawProjects.map((p) => ({
        id: p.id,
        image: p.image_url,
        title: p.title,
        tagline: p.short_description,
        description: p.overview,
        role: p.role,
        features: p.key_features || [],
        responsibilities: typeof p.responsibilities === 'string'
          ? p.responsibilities.split('\n').map(r => r.trim()).filter(Boolean)
          : (Array.isArray(p.responsibilities) ? p.responsibilities : []),
        techStack: p.tech_stacks?.map((ts) => ({
          name: ts.name,
          iconIdentifier: ts.icon_identifier,
          color: ts.color || '#656d76',
          icon: DynamicIcon
        })) || [],
        demoUrl: p.live_demo_url || null,
        githubUrl: p.github_url || null,
      }));
    }
  );

  return (
    <LayoutGroup>
      <div className="w-full min-h-[80vh] px-2 md:px-8 py-8 md:py-12">
        {/* Header (Matching Achievements & Blogs Style) */}
        <div className="mb-8 md:mb-12 flex items-center gap-4">
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center shrink-0 hidden sm:flex"
           >
             <FiFolder className="w-5 h-5 text-purple-500" />
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white"
           >
             Proyek
           </motion.h1>
           <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             style={{ transformOrigin: 'left' }}
             className="h-px flex-grow bg-neutral-200 dark:bg-neutral-800"
           />
           <motion.span 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="text-neutral-500 font-mono text-sm uppercase tracking-widest hidden md:block dark:text-neutral-400"
           >
              Showcase & Portfolio
           </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <p className="text-[#656d76] dark:text-[#7d8590] text-lg max-w-2xl leading-relaxed">
            Kumpulan karya dan proyek yang telah saya kerjakan.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col h-full bg-[#f6f8fa] dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] rounded-2xl overflow-hidden animate-pulse">
                {/* Thumbnail */}
                <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800" />
                {/* Body */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Title */}
                  <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-2/3 mb-4" />
                  {/* Tagline */}
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-4/5" />
                  </div>
                  {/* Footer (Tech Stack & Buttons) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-2 border-t border-transparent">
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-full w-20" />
                      <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-full w-16" />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-800" />
                      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-800" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8 bg-red-500/10 rounded-2xl border border-red-500/20">
            {error}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </motion.div>
        )}

        {/* Expanded Detail Overlay */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
