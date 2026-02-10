import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiInstagram, FiArrowUpRight } from 'react-icons/fi';
import SpotlightCard from '../components/ui/SpotlightCard';

const contacts = [
  { 
    name: 'Instagram', 
    value: '@devaajul', 
    link: 'https://www.instagram.com/devaajul/', 
    icon: FiInstagram, 
    color: 'group-hover:text-[#E1306C]', // Instagram Pink
    description: 'Follow my daily updates'
  },
  { 
    name: 'LinkedIn', 
    value: 'Delvin Julian', 
    link: 'https://www.linkedin.com/in/delvinj', 
    icon: FiLinkedin, 
    color: 'group-hover:text-[#0077b5]', // LinkedIn Blue
    description: 'Connect professionally'
  },
  { 
    name: 'Email', 
    value: 'mdelvinjulian@gmail.com', 
    link: 'mailto:mdelvinjulian@gmail.com', 
    icon: FiMail, 
    color: 'group-hover:text-[#EA4335]', // Gmail Red
    description: 'Send me a message' 
  },
  { 
    name: 'GitHub', 
    value: 'Julianvin', 
    link: 'https://github.com/Julianvin', 
    icon: FiGithub, 
    color: 'group-hover:text-black dark:group-hover:text-white', // Github Black/White
    description: 'Check out my code'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function Contact() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 md:px-20 py-12 md:py-16">
      <div className="max-w-4xl w-full">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#0d1117] dark:text-[#e6edf3] mb-4">
             Let's Connect
          </h1>
          <p className="text-[#656d76] dark:text-[#7d8590] text-lg max-w-xl mx-auto leading-relaxed">
             Whether you have a question, a project idea, or just want to say hello, feel free to reach out. I'm always open to new opportunities!
          </p>
        </motion.div>

        {/* Contact Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {contacts.map((contact) => (
                <motion.a 
                    key={contact.name}
                    href={contact.link}
                    target="_blank"
                    rel="noreferrer"
                    variants={itemVariants}
                    className="block h-full"
                >
                    <SpotlightCard 
                        className="h-full p-6 rounded-3xl bg-[#f6f8fa] dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] hover:border-gray-400 dark:hover:border-gray-600 transition-colors group relative"
                        spotlightColor="rgba(0, 200, 255, 0.15)"
                    >
                        <div className="flex items-start gap-6 relative z-10">
                            {/* Icon Box */}
                            <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-[#0d1117] border border-gray-100 dark:border-[#333] flex items-center justify-center shadow-sm transition-colors duration-300 ${contact.color}`}>
                                <contact.icon className="w-7 h-7 text-gray-400 dark:text-gray-500 transition-colors duration-300 group-hover:text-current" />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-[#0d1117] dark:text-[#e6edf3] group-hover:text-[#0969da] dark:group-hover:text-[#2f81f7] transition-colors">
                                        {contact.name}
                                    </h3>
                                    <FiArrowUpRight className="w-5 h-5 text-gray-400 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                                </div>
                                <p className="text-sm font-medium text-[#656d76] dark:text-[#7d8590] mb-1">
                                    {contact.value}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-600">
                                    {contact.description}
                                </p>
                            </div>
                        </div>
                    </SpotlightCard>
                </motion.a>
            ))}
        </motion.div>
      </div>
    </div>
  );
}
