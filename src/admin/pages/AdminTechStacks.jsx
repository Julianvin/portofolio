import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTechStacks, deleteTechStack } from '../services/techStackService';
import DynamicIcon from '../components/DynamicIcon';
import { FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiAlertTriangle, FiSearch } from 'react-icons/fi';

export default function AdminTechStacks() {
  const navigate = useNavigate();
  const [stacks, setStacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState(false);
  const limit = 20;

  // Performance-Optimized Client-Side Filtering
  const filteredStacks = useMemo(() => {
    if (!searchQuery.trim()) return stacks;
    
    const query = searchQuery.toLowerCase();
    return stacks.filter(ts => 
      ts.name.toLowerCase().includes(query) || 
      (ts.icon_identifier && ts.icon_identifier.toLowerCase().includes(query))
    );
  }, [stacks, searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTechStacks(page, limit);
      setStacks(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await deleteTechStack(deleteModal.id);
      setDeleteModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tech Stacks</h1>
          <p className="text-sm text-zinc-500 mt-1">{total} item{total !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => navigate('/admin/tech-stacks/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          New Tech Stack
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-blue-400 transition-colors">
          <FiSearch className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search technologies by name or identifier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <FiAlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 w-16">Icon</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Name</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 w-16">Color</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 hidden sm:table-cell">Identifier</th>
                <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="px-6 py-4"><div className="h-8 w-8 rounded bg-zinc-800 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-32 rounded bg-zinc-800 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-8 rounded-full bg-zinc-800 animate-pulse" /></td>
                    <td className="px-6 py-4 hidden sm:table-cell"><div className="h-5 w-24 rounded bg-zinc-800 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-20 ml-auto rounded bg-zinc-800 animate-pulse" /></td>
                  </tr>
                ))
              ) : filteredStacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-600 mb-2">
                        <FiSearch className="w-6 h-6" />
                      </div>
                      <p className="text-zinc-400 font-medium">No results found</p>
                      <p className="text-sm text-zinc-600">
                        {stacks.length === 0 
                          ? "No tech stacks yet. Create your first one!" 
                          : `Tidak ada teknologi yang cocok dengan '${searchQuery}'`}
                      </p>
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStacks.map((ts) => (
                  <tr key={ts.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <DynamicIcon 
                          iconIdentifier={ts.icon_identifier} 
                          size={18} 
                          style={{ color: ts.color || '#656d76' }} 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">{ts.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-zinc-700/50" 
                          style={{ backgroundColor: ts.color || '#656d76' }} 
                        />
                        <code className="text-[10px] text-zinc-500 font-mono">{ts.color || '#656d76'}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <code className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 font-mono">{ts.icon_identifier}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/tech-stacks/${ts.id}/edit`)}
                          className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(ts)}
                          className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setDeleteModal(null)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
              <FiTrash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Tech Stack</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Delete <strong className="text-white">"{deleteModal.name}"</strong>? This will also remove it from all linked projects.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setDeleteModal(null)} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
