import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getPublicBlogBySlug, incrementBlogViews } from '../admin/services/blogService';
import { FiArrowLeft, FiCalendar, FiClock, FiEye, FiFolder } from 'react-icons/fi';
import { getPlainTextFromHtml, sanitizeBlogHtml } from '../utils/sanitizeBlogContent';
import '../styles/blog-content.css';

const SITE_URL = 'https://www.delvinjulian.me';

function calculateReadingTime(htmlContent) {
    const text = getPlainTextFromHtml(htmlContent);
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export default function BlogDetail() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        const loadBlog = async () => {
            try {
                const data = await getPublicBlogBySlug(slug);
                setBlog(data);
                incrementBlogViews(data.id).catch((viewError) => {
                    console.warn('[BlogDetail] View counter failed:', viewError);
                });
            } catch (err) {
                if (err.code === 'PGRST116') {
                    setError('Artikel tidak ditemukan atau belum dipublish.');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, [slug]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="text-center mb-10 md:mb-16">
                        <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full mx-auto mb-6" />
                        <div className="h-10 md:h-12 bg-gray-200 dark:bg-zinc-800 rounded-xl w-3/4 mx-auto mb-4" />
                        <div className="h-10 md:h-12 bg-gray-200 dark:bg-zinc-800 rounded-xl w-1/2 mx-auto mb-8" />
                        <div className="flex justify-center items-center gap-4">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
                            <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                        </div>
                    </div>

                    {/* Cover Image Skeleton */}
                    <div className="w-full aspect-[21/9] bg-gray-200 dark:bg-zinc-800 rounded-2xl md:rounded-[2rem] mb-12 md:mb-20" />

                    {/* Content Skeleton */}
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded !mt-8" />
                        <div className="h-4 w-4/5 bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded !mt-8" />
                        <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-[#0a0a0a] px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Oops!</h1>
                <p className="text-gray-500 text-center mb-8">
                    {error || 'Artikel tidak ditemukan.'}
                </p>
                <Link
                    to="/blogs"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
                    <FiArrowLeft /> Kembali ke Daftar Blog
                </Link>
            </div>
        );
    }

    const safeContent = sanitizeBlogHtml(blog.content);
    const readingTime = calculateReadingTime(safeContent);
    const canonicalUrl = `${SITE_URL}/blogs/${blog.slug}`;
    const description = blog.meta_description || blog.excerpt || getPlainTextFromHtml(safeContent).slice(0, 160);
    const pageTitle = blog.meta_title || `${blog.title} | Delvin Julian`;

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 selection:bg-blue-500/30">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={description} />
                <meta name="robots" content={blog.meta_robots || 'index, follow'} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonicalUrl} />
                {blog.cover_image && <meta property="og:image" content={blog.cover_image} />}
                <meta property="og:type" content="article" />
                {blog.published_at && <meta property="article:published_time" content={blog.published_at} />}
                {blog.updated_at && <meta property="article:modified_time" content={blog.updated_at} />}
                <meta name="twitter:card" content={blog.cover_image ? 'summary_large_image' : 'summary'} />
                <meta name="twitter:title" content={blog.title} />
                <meta name="twitter:description" content={description} />
                {blog.cover_image && <meta name="twitter:image" content={blog.cover_image} />}
            </Helmet>

            {/* Navigation Bar (Minimalist) */}
            <nav className="fixed top-0 w-full z-50 bg-gray-50/95 dark:bg-[#0a0a0a]/95 border-b border-gray-200/50 dark:border-white/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center">
                    <Link
                        to="/blogs"
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors">
                            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        Kembali
                    </Link>
                </div>
            </nav>

            <main className="pt-24 pb-20">
                <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10 text-center">
                        {/* Category */}
                        {blog.categories && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
                                <FiFolder className="w-3.5 h-3.5" />
                                {blog.categories.name}
                            </div>
                        )}

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.2]">
                            {blog.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            <div className="flex items-center gap-2">
                                <FiCalendar className="w-4 h-4" />
                                {formatDate(blog.published_at)}
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                            <div className="flex items-center gap-2">
                                <FiClock className="w-4 h-4" />
                                {readingTime} menit baca
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                            <div className="flex items-center gap-2">
                                <FiEye className="w-4 h-4" />
                                {blog.views} kali dibaca
                            </div>
                        </div>
                    </motion.header>

                    {/* Hero Image */}
                    {blog.cover_image && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-black/10 dark:shadow-black/40 border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-zinc-900">
                            <img
                                src={blog.cover_image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    )}

                    {/* HTML Content (Quill Render) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="blog-content w-full"
                        dangerouslySetInnerHTML={{ __html: safeContent }}
                    />

                    {/* Footer Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        to={`/blogs?tag=${tag.name}`}
                                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </main>
        </div>
    );
}
