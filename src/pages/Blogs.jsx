import React, { useEffect, useMemo, useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useCachedFetch from '../hooks/useCachedFetch';
import { getPublicBlogs } from '../admin/services/blogService';
import { FiCalendar, FiClock, FiEye, FiTag, FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import SpotlightCard from '../components/ui/SpotlightCard';
import { Helmet } from 'react-helmet-async';
import { getPlainTextFromHtml } from '../utils/sanitizeBlogContent';

const SITE_URL = 'https://www.delvinjulian.me';
const BLOG_DESCRIPTION = 'Kumpulan artikel, tutorial, dan catatan perjalanan seputar dunia software development dan teknologi oleh Delvin Julian.';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Helper untuk estimasi waktu baca (asumsi 200 kata/menit)
function calculateReadingTime(htmlContent) {
  const text = getPlainTextFromHtml(htmlContent);
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Helper format tanggal (e.g. 12 Jan 2026)
function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function Blogs() {
  useDocumentTitle('Blog | Delvin Julian');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag');
  const queryParam = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(queryParam);

  const { data: blogs = [], isLoading, error } = useCachedFetch(
    'publicBlogs',
    getPublicBlogs
  );

  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  // Debounce search input to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((currentParams) => {
        const newParams = new URLSearchParams(currentParams);
        if (searchInput.trim()) {
          newParams.set('q', searchInput.trim());
        } else {
          newParams.delete('q');
        }
        return newParams;
      }, { replace: true });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, setSearchParams]);

  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    return blogs.filter(blog => {
      const matchesSearch = searchInput.trim() === '' || 
        blog.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchInput.toLowerCase());
      
      const matchesTag = !activeTag || 
        blog.tags?.some(t => t.name.toLowerCase() === activeTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [blogs, searchInput, activeTag]);

  const toggleTag = (tagName) => {
    const newParams = new URLSearchParams(searchParams);
    if (activeTag === tagName) {
      newParams.delete('tag');
    } else {
      newParams.set('tag', tagName);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const clearTagFilter = () => {
    setSearchParams((currentParams) => {
      const newParams = new URLSearchParams(currentParams);
      newParams.delete('tag');
      return newParams;
    });
  };

  return (
    <LayoutGroup>
      <Helmet>
        <title>Blog | Delvin Julian</title>
        <meta name="description" content={BLOG_DESCRIPTION} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/blogs`} />
        <meta property="og:title" content="Blog | Delvin Julian" />
        <meta property="og:description" content={BLOG_DESCRIPTION} />
        <meta property="og:url" content={`${SITE_URL}/blogs`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Blog | Delvin Julian" />
        <meta name="twitter:description" content={BLOG_DESCRIPTION} />
      </Helmet>
      <div className="w-full min-h-[80vh] px-2 md:px-8 py-8 md:py-12">
        {/* Header (Matching Achievements Style) */}
        <div className="mb-8 md:mb-12 flex items-center gap-4">
           <motion.h1 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white"
           >
             Blog
           </motion.h1>
           <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             style={{ transformOrigin: 'left' }}
             className="h-px flex-grow bg-neutral-200 dark:bg-neutral-800"
           />
           <motion.span 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="text-neutral-500 font-mono text-sm uppercase tracking-widest hidden md:block dark:text-neutral-400"
           >
              Artikel & Tutorial
           </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <p className="text-[#656d76] dark:text-[#7d8590] text-lg max-w-2xl leading-relaxed">
            Berbagi pemikiran, tutorial, dan catatan perjalanan seputar dunia software development dan teknologi.
          </p>
        </motion.div>

        {/* Search Bar Row (Below Header) */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full group"
          >
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:font-normal"
            />
            {searchInput && (
              <button 
                type="button"
                onClick={() => { setSearchInput(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gray-600 dark:hover:text-white p-1"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Filter Indicators */}
        {(activeTag || searchInput.trim()) && (
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-sm text-gray-500 font-medium">Filter aktif:</span>
            {searchInput.trim() && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold border border-blue-100 dark:border-blue-500/20">
                Search: "{searchInput}"
                <button onClick={() => { setSearchInput(''); }}><FiX /></button>
              </div>
            )}
            {activeTag && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-semibold border border-purple-100 dark:border-purple-500/20">
                Tag: #{activeTag}
                <button onClick={clearTagFilter}><FiX /></button>
              </div>
            )}
            <button 
              onClick={clearFilters}
              className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider ml-2"
            >
              Reset
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col h-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden animate-pulse">
                {/* Cover Image */}
                <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800" />
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Meta */}
                  <div className="flex gap-4 mb-3">
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-20" />
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-24" />
                  </div>
                  {/* Title */}
                  <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-4" />
                  {/* Excerpt */}
                  <div className="space-y-2 mb-6 flex-grow">
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-4/6" />
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                    <div className="flex gap-2">
                      <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-16" />
                      <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-12" />
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8 bg-red-500/10 rounded-2xl border border-red-500/20">
            Gagal memuat artikel: {error.message || error}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 px-4">
             <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <FiTag className="w-8 h-8 text-gray-400 dark:text-gray-500" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
               {activeTag || searchInput.trim() ? 'Hasil pencarian nihil' : 'Belum ada artikel'}
             </h3>
             <p className="text-gray-500 dark:text-gray-400">
               {activeTag || searchInput.trim() 
                 ? 'Coba gunakan kata kunci atau filter lain.' 
                 : 'Saya sedang menyiapkan konten-konten menarik. Kembali lagi nanti!'}
             </p>
             {(activeTag || searchInput.trim()) && (
               <button 
                 onClick={clearFilters}
                 className="mt-6 px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
               >
                 Lihat Semua Artikel
               </button>
             )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBlogs.map((blog) => (
              <motion.div key={blog.id} variants={cardVariants} className="h-full">
                <SpotlightCard
                  className="group flex flex-col h-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:border-blue-500/30 transition-all duration-500"
                  spotlightColor="rgba(59, 130, 246, 0.08)"
                >
                  
                  {/* Cover Image */}
                  <Link to={`/blogs/${blog.slug}`} className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-zinc-800 relative block shrink-0">
                    {blog.cover_image ? (
                      <img 
                        src={blog.cover_image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
                         <span className="text-blue-500 font-bold opacity-30 text-3xl tracking-widest">BLOG</span>
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Category Badge Floating */}
                    {blog.categories && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] uppercase tracking-wider font-bold text-white border border-white/10 shadow-lg">
                        {blog.categories.name}
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow relative">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5" /> {formatDate(blog.published_at)}</span>
                      <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5" /> {calculateReadingTime(blog.content)} min</span>
                    </div>
                    
                    <Link to={`/blogs/${blog.slug}`} className="block mb-2">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {blog.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
                      {blog.excerpt}
                    </p>

                    {/* Footer (Tags & Read More) */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5 gap-3">
                       <div className="flex flex-wrap gap-1.5">
                         {blog.tags?.slice(0, 2).map(tag => (
                           <button 
                             key={tag.id} 
                             onClick={(e) => {
                               e.preventDefault();
                               toggleTag(tag.name);
                             }}
                             className={`text-[10px] font-semibold px-2 py-1 rounded transition-colors ${
                               activeTag?.toLowerCase() === tag.name.toLowerCase()
                               ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                               : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                             }`}
                           >
                             #{tag.name}
                           </button>
                         ))}
                         {blog.tags?.length > 2 && (
                           <span className="text-[10px] font-medium px-1.5 py-1 text-gray-400 flex items-center">+{blog.tags.length - 2}</span>
                         )}
                       </div>
                       
                       <Link 
                         to={`/blogs/${blog.slug}`} 
                         className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group/link shrink-0"
                       >
                         Baca <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                       </Link>
                    </div>
                    
                    {/* Floating Views Counter */}
                    <div className="absolute top-5 right-5 flex items-center gap-1 text-[11px] font-semibold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-sm px-2 py-1 rounded border border-gray-200 dark:border-white/10">
                      <FiEye className="w-3 h-3" /> {blog.views}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
}
