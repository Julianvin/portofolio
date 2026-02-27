import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchProjectById,
  createProject,
  updateProject,
  fetchAllTechStacks,
  uploadProjectImage,
} from '../services/projectService';
import { FiSave, FiArrowLeft, FiPlus, FiX, FiAlertTriangle, FiCheck, FiUploadCloud, FiImage } from 'react-icons/fi';

const EMPTY_FORM = {
  title: '',
  short_description: '',
  overview: '',
  role: '',
  responsibilities: '',
  image_url: '',
  github_url: '',
  live_demo_url: '',
  is_pinned: false,
  key_features: [''],
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedTechIds, setSelectedTechIds] = useState([]);
  const [allTechStacks, setAllTechStacks] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Load tech stacks and project data (if editing)
  useEffect(() => {
    const load = async () => {
      try {
        const techs = await fetchAllTechStacks();
        setAllTechStacks(techs);

        if (isEdit) {
          const project = await fetchProjectById(id);
          setForm({
            title: project.title || '',
            short_description: project.short_description || '',
            overview: project.overview || '',
            role: project.role || '',
            responsibilities: project.responsibilities || '',
            image_url: project.image_url || '',
            github_url: project.github_url || '',
            live_demo_url: project.live_demo_url || '',
            is_pinned: project.is_pinned || false,
            key_features: project.key_features?.length ? project.key_features : [''],
          });
          setSelectedTechIds(project.tech_stack_ids || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.key_features];
      updated[index] = value;
      return { ...prev, key_features: updated };
    });
  };

  const addFeature = () => {
    setForm((prev) => ({ ...prev, key_features: [...prev.key_features, ''] }));
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      key_features: prev.key_features.filter((_, i) => i !== index),
    }));
  };

  const toggleTech = (techId) => {
    setSelectedTechIds((prev) =>
      prev.includes(techId) ? prev.filter((id) => id !== techId) : [...prev, techId]
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadProjectImage(file);
      handleChange('image_url', publicUrl);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.short_description.trim()) { setError('Short description is required.'); return; }

    setSaving(true);
    try {
      const projectData = {
        title: form.title.trim(),
        short_description: form.short_description.trim(),
        overview: form.overview.trim() || null,
        role: form.role.trim() || null,
        responsibilities: form.responsibilities.trim() || null,
        image_url: form.image_url.trim() || null,
        github_url: form.github_url.trim() || null,
        live_demo_url: form.live_demo_url.trim() || null,
        is_pinned: form.is_pinned,
        key_features: form.key_features.filter((f) => f.trim()),
      };

      if (isEdit) {
        await updateProject(id, projectData, selectedTechIds);
      } else {
        await createProject(projectData, selectedTechIds);
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/projects'), 800);
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
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/projects')}
          className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? 'Edit Project' : 'New Project'}
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
          {isEdit ? 'Project updated!' : 'Project created!'} Redirecting...
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Basic Info</h2>

          <Field label="Title *" value={form.title} onChange={(v) => handleChange('title', v)} placeholder="My Awesome Project" />

          <Field label="Short Description *" value={form.short_description} onChange={(v) => handleChange('short_description', v)} placeholder="A brief tagline..." />

          <TextArea label="Overview" value={form.overview} onChange={(v) => handleChange('overview', v)} placeholder="Detailed project description..." rows={4} />

          <Field label="Role" value={form.role} onChange={(v) => handleChange('role', v)} placeholder="Full Stack Developer" />

          <TextArea label="Responsibilities" value={form.responsibilities} onChange={(v) => handleChange('responsibilities', v)} placeholder="What you were responsible for..." rows={3} />

          {/* Pinned toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleChange('is_pinned', !form.is_pinned)}
              className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                form.is_pinned ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${
                form.is_pinned ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
            <span className="text-sm text-zinc-400">Pin this project</span>
          </div>
        </div>

        {/* Image Upload Card */}
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Project Image</h2>

          {/* Preview */}
          {form.image_url && (
            <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-48 object-cover object-top"
              />
              <button
                type="button"
                onClick={() => handleChange('image_url', '')}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-zinc-300 hover:text-red-400 transition-colors cursor-pointer"
                title="Remove image"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-all duration-200 cursor-pointer ${
                uploading
                  ? 'border-zinc-700 text-zinc-600 cursor-wait'
                  : 'border-zinc-700 text-zinc-400 hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-blue-400 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUploadCloud className="w-4 h-4" />
                  {form.image_url ? 'Replace Image' : 'Upload Image'}
                </>
              )}
            </label>
            <p className="text-xs text-zinc-600 mt-2">PNG, JPG, WebP — Max 5MB</p>
          </div>

          {/* Read-only URL display */}
          {form.image_url && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Image URL</label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <FiImage className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="text-xs text-zinc-400 truncate">{form.image_url}</span>
              </div>
            </div>
          )}
        </div>

        {/* URLs Card */}
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">URLs</h2>
          <Field label="GitHub URL" value={form.github_url} onChange={(v) => handleChange('github_url', v)} placeholder="https://github.com/..." />
          <Field label="Live Demo URL" value={form.live_demo_url} onChange={(v) => handleChange('live_demo_url', v)} placeholder="https://..." />
        </div>

        {/* Key Features Card */}
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Key Features</h2>
          {form.key_features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={feature}
                onChange={(e) => handleFeatureChange(i, e.target.value)}
                placeholder={`Feature ${i + 1}`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
              />
              {form.key_features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer shrink-0"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            Add Feature
          </button>
        </div>

        {/* Tech Stack Picker Card */}
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
            Tech Stack ({selectedTechIds.length} selected)
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTechStacks.map((tech) => {
              const isSelected = selectedTechIds.includes(tech.id);
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {tech.name}
                </button>
              );
            })}
            {allTechStacks.length === 0 && (
              <p className="text-sm text-zinc-500">No tech stacks found in database.</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
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
                {isEdit ? 'Update Project' : 'Create Project'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Reusable Field Components ──

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors resize-none"
      />
    </div>
  );
}
