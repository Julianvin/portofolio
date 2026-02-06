import React from 'react';
import { GoMail, GoDeviceMobile } from 'react-icons/go';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#0d1117] px-8 md:px-20 py-20 flex items-center justify-center transition-colors duration-500">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-[#0d1117] dark:text-[#e6edf3] mb-6">Get In Touch</h1>
        <p className="text-[#656d76] dark:text-[#7d8590] mb-12 text-lg">
            Interested in working together? Feel free to reach out for collaborations or just a friendly hello.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a 
                href="mailto:mdelvinjulian@gmail.com"
                className="flex items-center gap-4 p-6 rounded-2xl bg-[#f6f8fa] dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] hover:border-[#2f81f7] hover:-translate-y-1 transition-all group"
            >
                <div className="w-12 h-12 rounded-full bg-[#dbeeff] dark:bg-[#1f2428] flex items-center justify-center text-[#0969da] group-hover:bg-[#2f81f7] group-hover:text-white transition-colors">
                    <GoMail className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h3 className="text-sm font-semibold text-[#656d76] dark:text-[#7d8590]">Email Me</h3>
                    <p className="text-lg font-bold text-[#0d1117] dark:text-[#e6edf3]">mdelvinjulian@gmail.com</p>
                </div>
            </a>

            <a 
                href="https://wa.me/+6285922452994"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-6 rounded-2xl bg-[#f6f8fa] dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] hover:border-[#238636] hover:-translate-y-1 transition-all group"
            >
                <div className="w-12 h-12 rounded-full bg-[#dafbe1] dark:bg-[#1f2428] flex items-center justify-center text-[#1a7f37] group-hover:bg-[#238636] group-hover:text-white transition-colors">
                    <GoDeviceMobile className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h3 className="text-sm font-semibold text-[#656d76] dark:text-[#7d8590]">WhatsApp</h3>
                    <p className="text-lg font-bold text-[#0d1117] dark:text-[#e6edf3]">+62 859 2245 2994</p>
                </div>
            </a>
        </div>
      </div>
    </div>
  );
}
