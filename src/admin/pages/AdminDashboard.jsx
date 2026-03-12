import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardStats, checkSystemStatus } from '../services/dashboardService';
import { 
  FiFolder, 
  FiAward, 
  FiBriefcase, 
  FiCpu, 
  FiPlus, 
  FiArrowRight, 
  FiCheckCircle, 
  FiAlertCircle,
  FiActivity
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Selamat Pagi');
    else if (hours < 15) setGreeting('Selamat Siang');
    else if (hours < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    async function loadDashboardData() {
      try {
        const [statsData, onlineStatus] = await Promise.all([
          fetchDashboardStats(),
          checkSystemStatus()
        ]);
        setStats(statsData);
        setIsOnline(onlineStatus);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Projects',
      count: stats?.projects?.count || 0,
      latest: stats?.projects?.latest,
      icon: <FiFolder />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      link: '/admin/projects'
    },
    {
      title: 'Achievements',
      count: stats?.achievements?.count || 0,
      latest: stats?.achievements?.latest,
      icon: <FiAward />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
      link: '/admin/achievements'
    },
    {
      title: 'Experiences',
      count: stats?.experiences?.count || 0,
      latest: stats?.experiences?.latest,
      icon: <FiBriefcase />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
      link: '/admin/experiences'
    },
    {
      title: 'Tech Stack',
      count: stats?.techStacks?.count || 0,
      latest: stats?.techStacks?.latest,
      icon: <FiCpu />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/20',
      link: '/admin/tech-stacks'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {greeting}, Admin
          </h1>
          <p className="text-zinc-500 mt-1 flex items-center gap-2">
            Welcome to your Command Center.
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {isOnline ? 'Supabase Connected' : 'Connection Error'}
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-zinc-500 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl">
          <FiActivity className="text-blue-400" />
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div 
            key={i}
            onClick={() => navigate(card.link)}
            className="group relative rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 hover:border-zinc-700 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/20"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full opacity-20 transition-opacity group-hover:opacity-30 ${card.bgColor}`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.borderColor} border flex items-center justify-center ${card.color}`}>
                  {React.cloneElement(card.icon, { className: 'w-5 h-5' })}
                </div>
                <FiArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-500">Total {card.title}</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-zinc-800 rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-white tracking-tight">{card.count}</p>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-800/50">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Latest Update</p>
                {loading ? (
                  <div className="h-3 w-3/4 bg-zinc-800 rounded mt-1 animate-pulse" />
                ) : (
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-1 italic">
                    {card.latest || 'No items yet'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
              Quick Actions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/projects/new')}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-600/20 hover:border-blue-500/40 hover:from-blue-600/20 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                <FiPlus className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Add Project</span>
                <span className="text-xs text-zinc-500">Showcase your latest work</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin/achievements/new')}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-600/10 to-transparent border border-yellow-600/20 hover:border-yellow-500/40 hover:from-yellow-600/20 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-600 flex items-center justify-center text-white shadow-lg shadow-yellow-900/20 group-hover:scale-110 transition-transform">
                <FiPlus className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Add Certificate</span>
                <span className="text-xs text-zinc-500">Log new achievements</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin/experiences/new')}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-600/10 to-transparent border border-purple-600/20 hover:border-purple-500/40 hover:from-purple-600/20 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform">
                <FiPlus className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Add Experience</span>
                <span className="text-xs text-zinc-500">Update your career path</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/admin/tech-stacks')}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-600/10 to-transparent border border-cyan-600/20 hover:border-cyan-500/40 hover:from-cyan-600/20 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/20 group-hover:scale-110 transition-transform">
                <FiPlus className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Manage Stacks</span>
                <span className="text-xs text-zinc-500">Update your toolkit</span>
              </div>
            </button>
          </div>
        </div>

        {/* System Logs / Help Card */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">System Logs</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="text-green-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-white font-medium">Database Online</p>
                <p className="text-[10px] text-zinc-500">Supabase connection is stable and responsive.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiCheckCircle className="text-green-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-white font-medium">Auth Session Valid</p>
                <p className="text-[10px] text-zinc-500">Your administrative session is secure.</p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-800 text-center">
              <p className="text-[10px] text-zinc-600">Delvin Julian © 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
