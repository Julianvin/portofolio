import React from 'react';
import { GoPeople, GoLocation, GoMail, GoLink, GoOrganization } from 'react-icons/go';
import { FiSmile } from 'react-icons/fi';

export default function ProfileSidebar() {
  return (
    <aside className="border-b md:border-b-0 md:border-r border-[#d0d7de] dark:border-[#30363d] p-0 md:pr-6 mb-8 md:mb-0">
      {/* Profile Image - shifted up on Desktop to mimic GitHub overlap if we had a banner, but for now standard placement */}
      <div className="relative mb-4 group">
        <div className="w-full max-w-[296px] aspect-square rounded-full border border-[#d0d7de] dark:border-[#30363d] overflow-hidden mx-auto md:mx-0">
             {/* Placeholder for Profile IMG */}
             <div className="w-full h-full bg-[#f6f8fa] dark:bg-[#161b22] flex items-center justify-center text-[#656d76] dark:text-[#7d8590]">
                 <FiSmile className="w-20 h-20 opacity-50" />
             </div>
        </div>
        
        {/* Status Indicator (Optional mock) */}
        <div className="absolute bottom-10 right-0 md:right-10 bg-[#ffffff] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] rounded-full p-2 text-[#656d76] dark:text-[#7d8590] hidden md:flex items-center gap-2 text-xs shadow-sm cursor-pointer hover:text-[#2f81f7] transition-colors">
            <FiSmile />
            <span>Focusing</span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d1117] dark:text-[#e6edf3] leading-tight">
          Muhammad Delvin Julian
        </h1>
        <h2 className="text-xl font-light text-[#656d76] dark:text-[#7d8590] mb-4">
          @Julianvin
        </h2>
        <p className="text-[#0d1117] dark:text-[#e6edf3] text-[16px] leading-snug mb-4">
          Backend Developer passionate about crafting scalable systems.
        </p>

        <button className="w-full btn-primary mb-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-1.5 px-3 rounded-md border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm text-sm">
          Follow
        </button>
      </div>

      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2 text-[#656d76] dark:text-[#7d8590] text-sm hover:text-[#2f81f7] cursor-pointer">
            <GoPeople className="w-4 h-4" />
            <span className="font-bold text-[#0d1117] dark:text-[#e6edf3]">24</span> followers
            <span>·</span>
            <span className="font-bold text-[#0d1117] dark:text-[#e6edf3]">12</span> following
        </div>
      </div>

      <div className="space-y-3 border-t border-[#d0d7de] dark:border-[#30363d] pt-6">
        <div className="flex items-center gap-3 text-[#0d1117] dark:text-[#e6edf3] text-sm">
            <GoOrganization className="w-4 h-4 text-[#656d76] dark:text-[#7d8590]" />
            <span>PT. HEXA WIRA UTAMA</span>
        </div>
        <div className="flex items-center gap-3 text-[#0d1117] dark:text-[#e6edf3] text-sm">
            <GoOrganization className="w-4 h-4 text-[#656d76] dark:text-[#7d8590]" />
            <span>SMK WIKRAMA BOGOR</span>
        </div>
        <div className="flex items-center gap-3 text-[#0d1117] dark:text-[#e6edf3] text-sm">
            <GoLocation className="w-4 h-4 text-[#656d76] dark:text-[#7d8590]" />
            <span>Bogor, Indonesia</span>
        </div>
        <div className="flex items-center gap-3 text-[#0d1117] dark:text-[#e6edf3] text-sm">
            <GoMail className="w-4 h-4 text-[#656d76] dark:text-[#7d8590]" />
            <a href="mailto:mdelvinjulian@gmail.com" className="hover:text-[#2f81f7] hover:underline">
                mdelvinjulian@gmail.com
            </a>
        </div>
         <div className="flex items-center gap-3 text-[#0d1117] dark:text-[#e6edf3] text-sm">
            <GoLink className="w-4 h-4 text-[#656d76] dark:text-[#7d8590]" />
            <a href="https://wa.me/+6285922452994" className="hover:text-[#2f81f7] hover:underline">
                wa.me/+6285922452994
            </a>
        </div>
      </div>
    </aside>
  );
}
