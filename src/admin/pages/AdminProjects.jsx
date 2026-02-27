import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, deleteProject } from '../services/projectService';
import { FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiStar, FiAlertTriangle } from 'react-icons/fi';

export default function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const limit = 10;

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProjects(page, limit);
      setProjects(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const totalPages = Math.ceil(total / limit);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await deleteProject(deleteModal.id);
      setDeleteModal(null);
      loadProjects();
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
          <h1 className="text-2xl font-bold text-white">Proyek</h1>
          <p className="text-sm text-zinc-500 mt-1">Total {total} proyek</p>
        </div>
        <button
          onClick={() => navigate('/admin/projects/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          Proyek Baru
        </button>
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
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Proyek</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 hidden md:table-cell">Tech Stack</th>
                <th className="text-center px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 hidden sm:table-cell">Disematkan</th>
                <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="px-6 py-4"><div className="h-5 w-40 rounded bg-zinc-800 animate-pulse" /></td>
                    <td className="px-6 py-4 hidden md:table-cell"><div className="h-5 w-32 rounded bg-zinc-800 animate-pulse" /></td>
                    <td className="px-6 py-4 hidden sm:table-cell"><div className="h-5 w-8 mx-auto rounded bg-zinc-800 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-20 ml-auto rounded bg-zinc-800 animate-pulse" /></td>
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-zinc-500">
                    Belum ada proyek. Buat yang pertama!
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{project.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{project.short_description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {(project.tech_stacks || []).slice(0, 4).map((ts) => (
                          <span
                            key={ts.id}
                            className="px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-400"
                          >
                            {ts.name}
                          </span>
                        ))}
                        {(project.tech_stacks || []).length > 4 && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-800 text-zinc-500">
                            +{project.tech_stacks.length - 4}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                      {project.is_pinned ? (
                        <FiStar className="w-4 h-4 text-amber-400 mx-auto fill-amber-400" />
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                          className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(project)}
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
            <span className="text-xs text-zinc-500">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setDeleteModal(null)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
              <FiTrash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Hapus Proyek</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Apakah Anda yakin ingin menghapus <strong className="text-white">"{deleteModal.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  'Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
