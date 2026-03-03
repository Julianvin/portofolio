import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export default function FilterDropdown({ label, value, options, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt === value) || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full md:w-48 px-4 py-2.5 rounded-xl border transition-all
          ${isOpen 
            ? 'border-blue-500 bg-white dark:bg-neutral-900 ring-2 ring-blue-500/20' 
            : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50'
          }
          dark:text-white group
        `}
      >
        <span className={`text-sm ${!value ? 'text-neutral-500 dark:text-neutral-400' : 'font-medium'}`}>
          {selectedLabel}
        </span>
        <FiChevronDown 
          className={`w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[100] w-full mt-2 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl dark:shadow-black/50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`
                  flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors
                  ${!value 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }
                `}
              >
                <span>{placeholder}</span>
                {!value && <FiCheck className="w-4 h-4" />}
              </button>

              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors
                    ${value === option 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' 
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }
                  `}
                >
                  <span>{option}</span>
                  {value === option && <FiCheck className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
