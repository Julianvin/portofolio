import React, { useState } from 'react';
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#0d1117] dark:text-[#e6edf3] mb-3">
            Proyek
          </h1>
          <p className="text-[#656d76] dark:text-[#7d8590] text-lg max-w-2xl leading-relaxed">
            Kumpulan karya dan proyek yang telah saya kerjakan.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-blue-500 animate-spin" />
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
