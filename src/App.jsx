import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import GreetingLoader from './components/ui/GreetingLoader';
import CustomCursor from './components/ui/CustomCursor';

// ── Admin imports ──

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Projects = lazy(() => import('./pages/Projects'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminAuthBoundary = lazy(() => import('./admin/components/AdminAuthBoundary'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const Login = lazy(() => import('./admin/pages/Login'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProjects = lazy(() => import('./admin/pages/AdminProjects'));
const ProjectForm = lazy(() => import('./admin/pages/ProjectForm'));
const AdminTechStacks = lazy(() => import('./admin/pages/AdminTechStacks'));
const TechStackForm = lazy(() => import('./admin/pages/TechStackForm'));
const ExperiencesList = lazy(() => import('./admin/pages/ExperiencesList'));
const ExperienceForm = lazy(() => import('./admin/pages/ExperienceForm'));
const AdminAchievements = lazy(() => import('./admin/pages/AdminAchievements'));
const AchievementForm = lazy(() => import('./admin/pages/AchievementForm'));
const AdminBlogs = lazy(() => import('./admin/pages/AdminBlogs'));
const BlogForm = lazy(() => import('./admin/pages/BlogForm'));
const AdminCategoriesTags = lazy(() => import('./admin/pages/AdminCategoriesTags'));

function RouteFallback() {
    return React.createElement(
        'div',
        { className: 'flex min-h-screen items-center justify-center bg-gray-50 text-gray-500 dark:bg-[#0a0a0a] dark:text-gray-400' },
        React.createElement('div', {
            className: 'h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500 dark:border-zinc-800',
        }),
    );
}

export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <HelmetProvider>
            <CustomCursor />
            {isLoading && <GreetingLoader onComplete={() => setIsLoading(false)} />}
            <Router>
                <Suspense fallback={<RouteFallback />}>
                    <Routes>
                        {/* ── Public routes inside Layout (with Sidebar) ── */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<About />} />
                            <Route path="achievements" element={<Achievements />} />
                            <Route path="projects" element={<Projects />} />
                            {/* <Route path="blogs" element={<Blogs />} /> */}
                            {/* <Route path="dashboard" element={<Dashboard />} /> */}
                            <Route path="contact" element={<Contact />} />
                        </Route>

                        {/* ── Public routes OUTSIDE Layout (Full Width) ── */}
                        {/* <Route path="/blogs/:slug" element={<BlogDetail />} /> */}

                        {/* ── Admin routes ── */}
                        <Route
                            path="/admin/login"
                            element={
                                <AdminAuthBoundary requireAuth={false}>
                                    <Login />
                                </AdminAuthBoundary>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <AdminAuthBoundary>
                                    <AdminLayout />
                                </AdminAuthBoundary>
                            }>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="projects" element={<AdminProjects />} />
                            <Route path="projects/new" element={<ProjectForm />} />
                            <Route path="projects/:id/edit" element={<ProjectForm />} />
                            <Route path="tech-stacks" element={<AdminTechStacks />} />
                            <Route path="tech-stacks/new" element={<TechStackForm />} />
                            <Route path="tech-stacks/:id/edit" element={<TechStackForm />} />
                            <Route path="experiences" element={<ExperiencesList />} />
                            <Route path="experiences/new" element={<ExperienceForm />} />
                            <Route path="experiences/:id/edit" element={<ExperienceForm />} />
                            <Route path="achievements" element={<AdminAchievements />} />
                            <Route path="achievements/new" element={<AchievementForm />} />
                            <Route path="achievements/:id/edit" element={<AchievementForm />} />
                            <Route path="blogs" element={<AdminBlogs />} />
                            <Route path="blogs/new" element={<BlogForm />} />
                            <Route path="blogs/:id/edit" element={<BlogForm />} />
                            <Route path="categories-tags" element={<AdminCategoriesTags />} />
                        </Route>

                        {/* ── 404 Catch-All ── */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </Router>
        </HelmetProvider>
    );
}
