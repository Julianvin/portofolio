import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans overflow-hidden flex justify-center relative">
      {/* Background Ambiance — lightweight radial gradients (no blur/blend/animation) */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.25), transparent 70%)' }} />
      </div>

      {/* Central Container: Full Height App Shell */}
      <div className="w-full max-w-7xl h-full grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
          {/* Left Column (Sidebar) - THE ANCHOR - Static */}
          <div className="absolute inset-0 pointer-events-none md:pointer-events-auto md:static md:block col-span-3 h-full md:pt-10 md:pl-8 z-50 md:z-auto">
              {/* Note: Sidebar component internally handles pointer-events for mobile button */}
              <Sidebar />
          </div>

          {/* Right Column (Main Content) - THE SCROLLABLE ZONE */}
          <main className="col-span-1 md:col-span-9 h-full overflow-y-auto pt-16 md:pt-10 px-4 md:pr-8 pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <Outlet />
          </main>
      </div>
    </div>
  );
}
