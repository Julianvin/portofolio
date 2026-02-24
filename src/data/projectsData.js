import { FaReact, FaJs } from 'react-icons/fa';
import { SiTailwindcss, SiFramer } from 'react-icons/si';

const PROJECTS = [
  {
    id: 'portfolio',
    image: '/images/projects/portfolio-website.png',
    techStack: [
      { name: 'React', icon: FaReact, color: '#61DAFB' },
      { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Framer Motion', icon: SiFramer, color: '#0055FF' },
      { name: 'JavaScript', icon: FaJs, color: '#F7DF1E' },
    ],
    demoUrl: 'https://delvinjulian.vercel.app/',
    githubUrl: 'https://github.com/Julianvin/portofolio',
  },
];

export default PROJECTS;
