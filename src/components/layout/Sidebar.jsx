import React, { useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUser, FiFolder, FiBriefcase, FiLayout, FiMail, FiChevronRight, FiCheckCircle, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { motion, LayoutGroup } from 'framer-motion';
import { gsap } from 'gsap';
import { useTheme } from '../ui/ThemeProvider';
import SpotlightCard from '../ui/SpotlightCard';

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Beranda', path: '/', icon: FiHome },
    { name: 'Tentang', path: '/about', icon: FiUser },
    { name: 'Pencapaian', path: '/achievements', icon: FiBriefcase }, 
    { name: 'Proyek', path: '/projects', icon: FiFolder },
    { name: 'Dashboard', path: '/dashboard', icon: FiLayout },
    { name: 'Kontak', path: '/contact', icon: FiMail },
  ];

  // Refs for animations
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const menuItemsRef = useRef(null);
  const desktopContainerRef = useRef(null);

  // Initial Desktop Animation
  useEffect(() => {
    // Only animate desktop sidebar if on desktop view
    if (window.innerWidth >= 768) {
      gsap.fromTo(sidebarRef.current, 
        { y: -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  // Mobile Menu Animation Logic
  const tlRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      
      tl.to(overlayRef.current, {
        duration: 0.8,
        clipPath: "circle(150% at 100% 0%)", 
        ease: "power3.inOut",
        onStart: () => { document.body.style.overflow = 'hidden'; },
        onReverseComplete: () => { document.body.style.overflow = ''; }
      })
      .fromTo(".mobile-nav-item", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
      
      tlRef.current = tl;

    }, sidebarRef); 

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (tlRef.current) {
      if (isMobileMenuOpen) {
        tlRef.current.play();
      } else {
        tlRef.current.timeScale(1.5).reverse();
      }
    }
  }, [isMobileMenuOpen]);


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <aside ref={sidebarRef} className="w-full h-full pointer-events-none md:pointer-events-auto">
       
       <LayoutGroup>
       {/* --- MOBILE FIXED HEADER --- */}
       <div className="md:hidden fixed top-0 left-0 right-0 z-[60] px-4 py-2.5 flex items-center justify-between bg-white/40 dark:bg-[#0d1117]/50 backdrop-blur-2xl backdrop-saturate-150 border-b border-gray-200/30 dark:border-white/10 pointer-events-auto shadow-sm shadow-black/5">
          {/* Left: Identity — conditionally rendered here when menu is CLOSED */}
          {!isMobileMenuOpen && (
            <motion.div 
              layoutId="profile-container"
              className="flex items-center gap-3"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
               <motion.div layoutId="profile-avatar" className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-white/20 shadow-sm">
                  <img src="/images/fotoprofile.png" alt="Profile" className="w-full h-full object-cover" />
               </motion.div>
               <motion.div layoutId="profile-text" className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-0.5">Delvin Julian</span>
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">@Julianvin</span>
               </motion.div>
            </motion.div>
          )}
          {/* Spacer when profile has flown away */}
          {isMobileMenuOpen && <div className="w-[140px]" />}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme} 
               className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-gray-600 dark:text-gray-300 active:scale-95 transition-transform"
             >
                {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
             </button>

             {/* Burger Menu */}
             <button 
               onClick={toggleMobileMenu}
               className="w-9 h-9 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-black rounded-full shadow-lg active:scale-95 transition-transform"
             >
                {isMobileMenuOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
             </button>
          </div>
       </div>

       {/* --- MOBILE OVERLAY NAVIGATION --- */}
       <div 
         ref={overlayRef}
         className="md:hidden fixed inset-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl z-[50] flex flex-col justify-center items-center pointer-events-auto"
         style={{ clipPath: "circle(0% at 100% 0%)" }} 
       >
          <div ref={menuItemsRef} className="flex flex-col gap-6 items-start w-full pl-10 pr-6">
              
              {/* Profile — flies here when menu is OPEN */}
              {isMobileMenuOpen && (
                <motion.div 
                  layoutId="profile-container"
                  className="flex flex-col items-start text-left mb-2"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                >
                   <motion.div layoutId="profile-avatar" className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm mb-3">
                      <img src="/images/fotoprofile.png" alt="Profile" className="w-full h-full object-cover" />
                   </motion.div>
                   <motion.div layoutId="profile-text" className="flex flex-col items-start">
                      <div className="flex items-center justify-start gap-1.5">
                          <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">M. Delvin Julian</span>
                          <MdVerified className="text-[#1d9bf0] w-5 h-5 flex-shrink-0" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 leading-none">@Julianvin</span>
                   </motion.div>
                </motion.div>
              )}

              {/* Elegant Animated Divider */}
              <div className="mobile-nav-item w-full max-w-[80%] h-px bg-gray-200 dark:bg-white/10 my-2" />

              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `mobile-nav-item text-4xl font-bold transition-transform transition-colors duration-300 flex items-center gap-4 ${
                      isActive 
                        ? 'text-black dark:text-white scale-110' 
                        : 'text-gray-500 hover:text-black dark:hover:text-white hover:translate-x-2'
                    }`
                  }
                >
                  <item.icon className="w-8 h-8" />
                  {item.name}
                </NavLink>
              ))}
              
          </div>
       </div>
       </LayoutGroup>

       {/* --- DESKTOP SIDEBAR CONTENT --- */}
       <div ref={desktopContainerRef} className="hidden md:flex w-full h-full">
         <SpotlightCard className="flex flex-col gap-0 p-4 rounded-3xl transition-all duration-300 pointer-events-auto bg-transparent border border-transparent hover:border-white/5 h-full w-full" spotlightColor="rgba(255, 255, 255, 0.06)">
              {/* Header: Profile & Identity */}
              <div className="flex flex-col items-center mb-6">
                  <div className="relative group cursor-default mb-3 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden transition-transform duration-700 ease-in-out group-hover:scale-105 relative border border-gray-200 dark:border-white/10 shadow-sm">
                           <img src="/images/fotoprofile.png" alt="Profile" className="w-full h-full object-cover" />
                           
                      </div>
                  </div>
                  
                  <div className="text-center flex flex-col items-center">
                      <div className="flex items-center justify-center gap-1.5">
                          <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none">M. Delvin Julian</h1>
                          <MdVerified className="text-[#1d9bf0] w-5 h-5 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 leading-none mt-1">@Julianvin</p>
                  </div>
              </div>
  
               {/* Navigation */}
              <nav className="flex flex-col gap-1.5 w-full mt-6">
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
              <div className="pt-6 mt-auto border-t border-gray-200 dark:border-[#1a1a1a] flex flex-col items-center gap-4">
                  {/* Minimal Theme Toggle */}
                  <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#252525] border border-gray-200 dark:border-[#333] text-gray-600 dark:text-gray-400 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group shadow-sm"
                    title={theme === 'dark' ? 'Nyalakan Mode Terang' : 'Nyalakan Mode Gelap'}
                  >
                      {theme === 'dark' ? 
                        <FiSun className="w-5 h-5 group-hover:text-yellow-500 transition-colors" /> : 
                        <FiMoon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                      }
                  </button>

                  <p className="text-[10px] text-gray-500 dark:text-gray-600 uppercase tracking-widest leading-relaxed font-bold text-center">
                      © 2026 Delvin Julian
                  </p>
              </div>
        </SpotlightCard>
       </div>
    </aside>
  );
}
