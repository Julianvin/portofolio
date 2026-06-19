import React, { useState, useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function TagInput({ tags, onChange, suggestions = [] }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Filter suggestions: only show when input matches AND tag not already added
  const filteredSuggestions = inputValue.trim().length > 0
    ? suggestions.filter(
        (s) =>
          s.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
          !tags.some((t) => t.toLowerCase() === s.toLowerCase())
      )
    : [];

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;

    // No duplicates (case insensitive)
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue('');
      return;
    }

    onChange([...tags, trimmed]);
    setInputValue('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();

      // If a suggestion is highlighted, use that
      if (activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
        addTag(filteredSuggestions[activeSuggestionIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
      return;
    }

    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
      return;
    }

    // Arrow navigation for suggestions
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    // If the user pastes or types a comma, split and add
    if (val.includes(',')) {
      const parts = val.split(',');
      parts.forEach((part, i) => {
        if (i < parts.length - 1) {
          // Everything before last comma becomes a tag
          const trimmed = part.trim();
          if (trimmed) addTag(trimmed);
        } else {
          // After last comma, keep as input
          setInputValue(part);
        }
      });
    } else {
      setInputValue(val);
    }
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Tags Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 focus-within:border-blue-500/50 transition-colors cursor-text min-h-[42px]"
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={tags.length === 0 ? 'Ketik tag lalu tekan Enter atau Koma...' : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
        />
      </div>

      {/* Autocomplete Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 py-1 rounded-xl bg-zinc-800 border border-zinc-700 shadow-xl max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                addTag(suggestion);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                index === activeSuggestionIndex
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-zinc-300 hover:bg-zinc-700/50'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
