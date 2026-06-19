import React, { useState, useEffect } from 'react';
import { fetchAllCategories, fetchAllTags, deleteCategory, deleteTag } from '../services/blogService';
import { FiTrash2, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

export default function AdminCategoriesTags() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals / Loading states
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catsData, tagsData] = await Promise.all([
        fetchAllCategories(),
        fetchAllTags()
      ]);
      setCategories(catsData);
      setTags(tagsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, type) => {
    const isCat = type === 'category';
    const itemName = isCat 
      ? categories.find(c => c.id === id)?.name 
      : tags.find(t => t.id === id)?.name;

    if (!window.confirm(`Yakin ingin menghapus ${isCat ? 'Kategori' : 'Tag'} "${itemName}"?\nTindakan ini tidak bisa dibatalkan.`)) return;

    setDeletingId(id);
    setError(null);

    try {
      if (isCat) {
        await deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        await deleteTag(id);
        setTags(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manajemen Kategori & Tag</h1>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors text-sm font-medium cursor-pointer"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="flex gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Terjadi Kesalahan</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Categories Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Daftar Kategori</h2>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold">
              {categories.length} Total
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">Belum ada kategori</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Nama</th>
                    <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Slug</th>
                    <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 text-sm font-medium text-white">{cat.name}</td>
                      <td className="p-4 text-sm text-zinc-500 font-mono">{cat.slug}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(cat.id, 'category')}
                          disabled={deletingId === cat.id}
                          className="p-2 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Kategori"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Tags Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Daftar Tag</h2>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold">
              {tags.length} Total
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            {tags.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">Belum ada tag</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Nama</th>
                    <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Slug</th>
                    <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 text-sm font-medium text-white">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs">
                          {tag.name}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-zinc-500 font-mono">{tag.slug}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(tag.id, 'tag')}
                          disabled={deletingId === tag.id}
                          className="p-2 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Tag"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
