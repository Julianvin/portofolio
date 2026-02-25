import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchStats } from '../services/projectService';
import { FiUser, FiActivity, FiFolder, FiCpu, FiArrowRight } from 'react-icons/fi';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ projectCount: 0, techStackCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600/10 via-zinc-900/50 to-purple-600/10 border border-zinc-800 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <FiUser className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, Admin</h1>
              <p className="text-sm text-zinc-500">You are logged in to the admin panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400">
              <FiActivity className="w-3 h-3" />
              Session Active
            </span>
            <span className="text-xs text-zinc-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Projects</span>
            <FiFolder className="w-4 h-4 text-blue-400" />
          </div>
          {loading ? (
            <div className="h-9 w-16 rounded-lg bg-zinc-800 animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-blue-400">{stats.projectCount}</p>
          )}
        </div>

        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Tech Stacks</span>
            <FiCpu className="w-4 h-4 text-cyan-400" />
          </div>
          {loading ? (
            <div className="h-9 w-16 rounded-lg bg-zinc-800 animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-cyan-400">{stats.techStackCount}</p>
          )}
        </div>

        <div
          onClick={() => navigate('/admin/projects')}
          className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200 cursor-pointer group sm:col-span-2 lg:col-span-1"
        >
          <FiArrowRight className="w-6 h-6 text-zinc-500 group-hover:text-blue-400 mb-3 transition-colors" />
          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 mb-1 transition-colors">
            Manage Projects
          </h3>
          <p className="text-xs text-zinc-500">Create, edit, and manage your portfolio projects.</p>
        </div>
      </div>
    </div>
  );
}
