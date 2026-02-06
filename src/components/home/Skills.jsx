import React from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiWind, FiCode, FiLayers, FiGlobe, FiSend, FiHardDrive } from 'react-icons/fi';
import { 
  FaLaravel, FaPhp, FaBootstrap, FaGitAlt, FaGithub, FaJs, FaJava, FaHtml5, FaCss3
} from 'react-icons/fa';

const STACKS = [
  // Core
  { name: 'Laravel', icon: FaLaravel, color: '#FF2D20', shadow: '#c71f14' },
  { name: 'PHP', icon: FaPhp, color: '#777BB4', shadow: '#5d608d' },
  { name: 'MySQL', icon: FiDatabase, color: '#4479A1', shadow: '#305572' },
  { name: 'Bootstrap', icon: FaBootstrap, color: '#7952B3', shadow: '#5e3f8e' },
  { name: 'Tailwind', icon: FiWind, color: '#38BDF8', shadow: '#0284c7' },
  // Languages
  { name: 'JavaScript', icon: FaJs, color: '#F7DF1E', shadow: '#d6c016' },
  { name: 'Java', icon: FaJava, color: '#007396', shadow: '#005772' },
  { name: 'Dart', icon: FiCode, color: '#0175C2', shadow: '#015b96' },
  { name: 'HTML', icon: FaHtml5, color: '#E34F26', shadow: '#b53b19' },
  { name: 'CSS', icon: FaCss3, color: '#1572B6', shadow: '#105689' },
  { name: 'SQL', icon: FiDatabase, color: '#336791', shadow: '#264d6d' },
  // Concepts
  { name: 'REST API', icon: FiGlobe, color: '#10B981', shadow: '#059669' },
  { name: 'MVC Arch', icon: FiLayers, color: '#8B5CF6', shadow: '#7c3aed' },
  // Tools
  { name: 'Git', icon: FaGitAlt, color: '#F05032', shadow: '#c43c22' },
  { name: 'GitHub', icon: FaGithub, color: '#24292e', shadow: '#16191d' },
  { name: 'VS Code', icon: FiCode, color: '#007ACC', shadow: '#005fa3' },
  { name: 'Postman', icon: FiSend, color: '#FF6C37', shadow: '#d95325' },
  { name: 'Laragon', icon: FiHardDrive, color: '#0E83CD', shadow: '#0a6aa6' },
  { name: 'PgAdmin', icon: FiDatabase, color: '#336791', shadow: '#264d6d' },
];

// Konfigurasi jumlah kolom per breakpoint
const GRID_CONFIG = {
  base: 4,    // grid-cols-4
  sm: 5,      // sm:grid-cols-5
  md: 6,      // md:grid-cols-6
  lg: 8       // lg:grid-cols-8
};

// Fungsi untuk membagi array menjadi baris-baris berdasarkan jumlah kolom
const createRows = (items, columns) => {
  const rows = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return rows;
};

export default function Skills({ ready = false }) {
  // Membuat baris-baris berdasarkan jumlah kolom di desktop (lg:8)
  const rows = createRows(STACKS, GRID_CONFIG.lg);

  return (
    <div className="w-full py-10 px-4">
      <div className="flex flex-col gap-12">
        {rows.map((row, rowIndex) => (
          <motion.div 
            key={rowIndex}
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-6 gap-y-12 place-items-center"
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: rowIndex * 0.2
                }
              }
            }}
          >
            {row.map((stack, index) => (
              <motion.div
                key={`${rowIndex}-${index}`}
                className="group relative flex flex-col items-center justify-center"
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 30,
                    scale: 0.8
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }
                  }
                }}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                
                {/* -- CONTAINER ICON (Hover Effect untuk naik turun) -- */}
                <motion.div 
                  className="relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer"
                  variants={{
                    hover: { 
                      y: -15, 
                      transition: { type: "spring", stiffness: 400 } 
                    }
                  }}
                >
                  {/* Shadow Bawah */}
                  <div 
                    className="absolute inset-0 rounded-full transition-transform duration-300 group-hover:translate-y-3 group-hover:opacity-70"
                    style={{ backgroundColor: stack.shadow, transform: 'translateY(6px)' }}
                  />
                  
                  {/* Layer Tengah */}
                  <div 
                    className="absolute inset-0 rounded-full transition-transform duration-300 group-hover:translate-y-2"
                    style={{ backgroundColor: stack.color, opacity: 0.6, transform: 'translateY(3px)' }} 
                  />

                  {/* Layer Utama (Atas) */}
                  <motion.div
                    className="relative z-10 w-full h-full rounded-full flex items-center justify-center border border-black/5 dark:border-white/30"
                    style={{ 
                      background: `linear-gradient(135deg, ${stack.color}dd, ${stack.color})`, 
                      boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.4), inset 0 -2px 10px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(8px)'
                    }}
                    variants={{
                      hover: {
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { 
                          rotate: { repeat: Infinity, duration: 2 },
                          scale: { type: "spring", stiffness: 400 }
                        }
                      }
                    }}
                  >
                    {/* Kilau Kaca */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />

                    <div className="text-white drop-shadow-md relative z-10">
                      <stack.icon className="w-8 h-8 sm:w-10 sm:h-10 filter drop-shadow-lg" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* -- LABEL NAMA SKILL -- */}
                <div
                  className={`absolute top-[115%] whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold shadow-xl backdrop-blur-md pointer-events-none
                    bg-white/90 text-neutral-900 border border-neutral-200 
                    dark:bg-neutral-800/90 dark:text-white dark:border-white/10
                    opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300
                  `}
                  style={{ zIndex: 100 }}
                >
                  {stack.name}
                </div>
                
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}