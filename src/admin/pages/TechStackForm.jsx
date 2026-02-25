import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTechStackById, createTechStack, updateTechStack } from '../services/techStackService';
import DynamicIcon from '../components/DynamicIcon';
import { FiSave, FiArrowLeft, FiAlertTriangle, FiCheck } from 'react-icons/fi';

export default function TechStackForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [iconIdentifier, setIconIdentifier] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load existing data in edit mode
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const ts = await fetchTechStackById(id);
        setName(ts.name || '');
        setIconIdentifier(ts.icon_identifier || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!name.trim()) { setError('Name is required.'); return; }
    if (!iconIdentifier.trim()) { setError('Icon identifier is required.'); return; }

    setSaving(true);
    try {
      const payload = { name: name.trim(), icon_identifier: iconIdentifier.trim() };
      if (isEdit) {
        await updateTechStack(id, payload);
      } else {
        await createTechStack(payload);
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin/tech-stacks'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/tech-stacks')}
          className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? 'Edit Tech Stack' : 'New Tech Stack'}
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <FiAlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          <FiCheck className="w-4 h-4 shrink-0" />
          {isEdit ? 'Updated!' : 'Created!'} Redirecting...
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="ts-name" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Name *</label>
            <input
              id="ts-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Icon Identifier + Live Preview */}
          <div>
            <label htmlFor="ts-icon" className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Icon Identifier *</label>
            <div className="flex items-center gap-3">
              <input
                id="ts-icon"
                value={iconIdentifier}
                onChange={(e) => setIconIdentifier(e.target.value)}
                placeholder="e.g. FaReact"
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors font-mono"
              />
              {/* Live icon preview */}
              <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0" title="Icon preview">
                <DynamicIcon
                  iconIdentifier={iconIdentifier.trim()}
                  size={22}
                  className="text-blue-400"
                />
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Use identifiers from{' '}
              <a href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 underline underline-offset-2">
                react-icons
              </a>
              {' '}— e.g. <code className="text-zinc-400">FaReact</code>, <code className="text-zinc-400">SiTailwindcss</code>, <code className="text-zinc-400">FiGithub</code>
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/tech-stacks')}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                {isEdit ? 'Update' : 'Create'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
