import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GoOrganization, GoLocation, GoCalendar, GoChevronDown } from 'react-icons/go';




export default function About() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(
            '.animate-item',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-4xl">
        {/* Header */}
        <div className="mb-12 animate-item">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">About</h1>
            <p className="text-lg text-gray-600 dark:text-gray-500">A brief introduction to who I am and my professional journey.</p>
        </div>

        {/* Bio */}
        <section className="mb-16 animate-item">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Introduction</h2>
            <div className="prose prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                    I'm <span className="text-gray-900 dark:text-white font-medium">Muhammad Delvin Julian</span>, a software developer dedicated to building impactful digital solutions. 
                    I specialize in **Backend Development** using Laravel, PHP, and MySQL, with a strong foundation in MVC architecture and RESTful API design.
                </p>
                <p className="mt-4">
                    Currently, I'm an undergraduate student at <span className="text-gray-900 dark:text-white font-medium">SMK Wikrama Bogor</span>, driven by logic and performance optimizations.
                </p>
            </div>
        </section>

        {/* Experience Cards */}
        <section className="mb-16 animate-item">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Career</h2>
             
             {/* Card 1 */}
             <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer group shadow-sm dark:shadow-none">
                  <div className="flex items-start justify-between mb-4">
                       <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden">
                               <img src="/images/ptHexa.png" alt="PT Hexa" className="w-full h-full object-contain" />
                           </div>
                           <div>
                               <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Backend Developer Intern</h3>
                               <p className="text-sm text-gray-500 dark:text-gray-400">PT. HEXA WIRA UTAMA</p>
                           </div>
                      </div>
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-[#0d1117] px-2 py-1 rounded border border-gray-200 dark:border-[#30363d]">
                          Jan 2025 - June 2025
                      </span>
                  </div>
                  
                  <div className="pl-16">
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          Built project management systems, admin dashboards with data statistics, and internal real-time chat features. 
                          Streamlined inventory modules for better efficiency.
                      </p>
                      <button className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium hover:underline">
                          Show details <GoChevronDown />
                      </button>
                  </div>
             </div>
        </section>

        {/* Education */}
        <section className="mb-16 animate-item">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Education</h2>
            <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-6 flex items-center gap-4 shadow-sm dark:shadow-none">
                  <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden">
                       <img src="/images/wikrama.png" alt="SMK Wikrama" className="w-full h-full object-contain" />
                  </div>
                  <div>
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white">SMK WIKRAMA BOGOR</h3>
                       <p className="text-sm text-gray-500 dark:text-gray-400">Software Engineering (PPLG)</p>
                       <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                           <GoLocation className="w-3 h-3" /> Bogor, Indonesia
                           <span className="mx-1">•</span>
                           <GoCalendar className="w-3 h-3" /> July 2023 - Present
                       </p>
                  </div>
            </div>
        </section>


    </div>
  );
}
