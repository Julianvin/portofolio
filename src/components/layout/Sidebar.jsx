import React, { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUser, FiFolder, FiBriefcase, FiLayout, FiMessageSquare, FiMail, FiChevronRight, FiCheckCircle, FiSun, FiMoon, FiDownload } from 'react-icons/fi';
import { gsap } from 'gsap';
import { useTheme } from '../ui/ThemeProvider';
import SpotlightCard from '../ui/SpotlightCard';

const navItems = [
  { name: 'Home', path: '/', icon: FiHome },
  { name: 'About', path: '/about', icon: FiUser },
  { name: 'Achievements', path: '/achievements', icon: FiBriefcase }, 
  { name: 'Projects', path: '/projects', icon: FiFolder },
  { name: 'Dashboard', path: '/dashboard', icon: FiLayout },
  { name: 'Chat Room', path: '/chat', icon: FiMessageSquare },
  { name: 'Contact', path: '/contact', icon: FiMail },
];

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Basic slide-down animation for sticky entrance
    gsap.fromTo(sidebarRef.current, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside ref={sidebarRef} className="w-full h-full">
       <SpotlightCard className="flex flex-col gap-6 p-4 rounded-3xl transition-all duration-300 pointer-events-auto bg-transparent border border-transparent hover:border-white/5 h-fit" spotlightColor="rgba(255, 255, 255, 0.06)">
            {/* Header: Profile & Identity */}
            <div className="flex flex-col items-center">
                <div className="relative group cursor-default mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-[#222] transition-transform duration-700 ease-in-out group-hover:scale-105 relative">
                         <img src="/images/fotoprofile.png" alt="Profile" className="w-full h-full object-cover" />
                         
                         {/* Corrected Open To Work Badge - LinkedIn Style (Faded & Larger) */}
                         <div className="absolute inset-0 z-10 w-full h-full pointer-events-none scale-105">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <defs>
                                    <path id="badge-path" d="M 10,50 A 40,40 0 0,0 90,50" fill="none" />
                                    <linearGradient id="badge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#47b972" stopOpacity="0" />
                                        <stop offset="15%" stopColor="#47b972" stopOpacity="1" />
                                        <stop offset="85%" stopColor="#47b972" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#47b972" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Green Background Arc with Gradient Fade */}
                                <path d="M 10,50 A 40,40 0 0,0 90,50" stroke="url(#badge-gradient)" strokeWidth="15" fill="none" transform="rotate(25 50 50)" strokeLinecap="round" />
                                
                                {/* Text */}
                                <text fontSize="10" fontWeight="bold" fill="white" dy="4" letterSpacing="1">
                                    <textPath href="#badge-path" startOffset="50%" textAnchor="middle" transform="rotate(25 50 50)">
                                        #OPENTOWORK
                                    </textPath>
                                </text>
                            </svg>
                         </div>
                    </div>
                </div>
                
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">M. Delvin Julian</h1>
                        <FiCheckCircle className="text-blue-500 w-5 h-5 fill-current" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">@Julianvin</p>
                </div>
            </div>

            {/* Controls Row - Side by Side */}
            <div className="flex items-center gap-3 w-full">
                <a 
                  href="/Cv_Delvin_Julian.pdf" 
                  download="Muhammad_Delvin_Julian_Resume.pdf"
                  className="flex-1 bg-[#fbbf24] hover:bg-[#f59e0b] text-black text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-yellow-500/10"
                >
                    <span className="uppercase tracking-wider">CV</span>
                    <FiDownload className="w-4 h-4" />
                </a>
                <button 
                  onClick={toggleTheme}
                  className="w-12 h-[38px] flex items-center justify-center bg-white dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#252525] border border-gray-200 dark:border-[#333] text-gray-600 dark:text-gray-400 rounded-xl transition-colors hover:text-black dark:hover:text-white"
                 >
                    {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1.5 w-full">
                {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group hover:translate-x-1 ${
                          isActive
                            ? 'bg-white dark:bg-[#1a1a1a] text-black dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                            : 'text-gray-600 dark:text-gray-500 hover:text-black dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#111]'
                        }`
                      }
                    >
                        {({ isActive }) => (
                            <>
                              <div className="flex items-center gap-3">
                                  <item.icon className={`w-5 h-5 ${isActive ? 'text-black dark:text-white' : 'text-gray-500 group-hover:text-black dark:group-hover:text-gray-300'}`} />
                                  <span>{item.name}</span>
                              </div>
                              {isActive && <FiChevronRight className="w-4 h-4 text-gray-400" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="pt-4 mt-2 border-t border-gray-200 dark:border-[#1a1a1a]">
                <p className="text-[10px] text-gray-500 dark:text-gray-600 uppercase tracking-widest leading-relaxed font-bold text-center">
                    Copyright © 2026<br/>
                    Delvin Julian.
                </p>
            </div>
      </SpotlightCard>
    </aside>
  );
}
