import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiAlertTriangle, FiShield } from 'react-icons/fi';

export default function Login() {
  const { login, isLocked, lockRemaining, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/8 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/8 blur-[140px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center">
            <FiShield className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
          <p className="text-sm text-zinc-500">Enter your credentials to continue</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked || loading}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked || loading}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Error / Lock message */}
            {(error || isLocked) && (
              <div className={`flex items-start gap-2.5 p-3.5 rounded-xl text-sm ${
                isLocked
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
              }`}>
                <FiAlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {isLocked
                    ? `🔒 Account locked. Try again in ${lockRemaining}s.`
                    : error}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLocked || loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Restricted area &middot; Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}
