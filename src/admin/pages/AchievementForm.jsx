import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAchievementById, createAchievement, updateAchievement, uploadAchievementImage } from '../services/achievementService';
import { FiSave, FiX, FiAlertTriangle, FiUploadCloud, FiImage, FiMaximize2 } from 'react-icons/fi';

const ACHIEVEMENT_TYPES = [
  'Course',
  'Award',
  'Badge',
  'Professional',
  'Recognition'
];

const ACHIEVEMENT_CATEGORIES = [
  'Frontend',
  'Backend',
  'Mobile',
  'Cloud Computing',
  'General',
  'Freelance',
  'Development Tools',
  'Algorithm',
  'AI',
  'Organization'
];

export default function AchievementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    credential_id: '',
    credential_url: '',
    issue_date: '',
    type: 'Course',
    category: 'Backend',
    image_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!isEdit) return;
      try {
        const data = await fetchAchievementById(id);
        setFormData({
          title: data.title || '',
          issuer: data.issuer || '',
          credential_id: data.credential_id || '',
          credential_url: data.credential_url || '',
          issue_date: data.issue_date || '',
          type: data.type || 'Course',
          category: data.category || 'Backend',
          image_url: data.image_url || ''
        });
      } catch (err) {
        setError(`Failed to load achievement: ${err.message}`);
      } finally {
        setInitialLoading(false);
      }
    }
    loadData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadAchievementImage(file);
      handleChange({ target: { name: 'image_url', value: publicUrl } });
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.issuer || !formData.issue_date) {
        throw new Error('Name, Issuer, and Issue Date are required fields.');
      }

      const payload = {
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        credential_id: formData.credential_id?.trim() || null,
        credential_url: formData.credential_url?.trim() || null,
        issue_date: formData.issue_date,
        type: formData.type,
        category: formData.category,
        image_url: formData.image_url?.trim() || null,
      };

      if (isEdit) {
        await updateAchievement(id, payload);
      } else {
        await createAchievement(payload);
      }

      navigate('/admin/achievements');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Achievement' : 'New Achievement'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isEdit ? 'Update certificate details' : 'Add a new certificate/award'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/achievements')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <FiX className="w-4 h-4" />
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <FiAlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Certificate Image (Optional)</label>
            <div className="flex items-start gap-6">
              <div className="shrink-0 relative group">
                {formData.image_url ? (
                  <>
                    <img
                      src={formData.image_url}
                      alt="Certificate Preview"
                      className="w-20 h-20 rounded-xl object-cover bg-white border border-zinc-800"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer"
                      title="View Full Image"
                    >
                      <FiMaximize2 className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <FiImage className="w-8 h-8 text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="relative flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50">
                    {uploading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <FiUploadCloud className="w-4 h-4" />
                    )}
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </label>
                  {formData.image_url && (
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'image_url', value: '' } })}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  Recommended: Landscape image, max 5MB. PNG, JPG, or WebP.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-zinc-300">Achievement Name *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g. Belajar Prinsip Pemrograman SOLID"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="issuer" className="text-sm font-medium text-zinc-300">Issuing Organization *</label>
              <input
                id="issuer"
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g. Dicoding Indonesia"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="issue_date" className="text-sm font-medium text-zinc-300">Issue Date *</label>
              <input
                id="issue_date"
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-zinc-300">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                {ACHIEVEMENT_TYPES.map(type => (
                   <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-zinc-300">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                {ACHIEVEMENT_CATEGORIES.map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="credential_id" className="text-sm font-medium text-zinc-300">Credential ID (Optional)</label>
              <input
                id="credential_id"
                type="text"
                name="credential_id"
                value={formData.credential_id}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g. MRZMW5G0KPYQ"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="credential_url" className="text-sm font-medium text-zinc-300">Credential URL (Optional)</label>
              <input
                id="credential_url"
                type="url"
                name="credential_url"
                value={formData.credential_url}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g. https://www.dicoding.com/..."
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <FiSave className="w-5 h-5" />
            )}
            Save Achievement
          </button>
        </div>
      </form>

      {/* Image Preview Modal */}
      {isPreviewOpen && formData.image_url && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors z-[120] cursor-pointer"
          >
            <FiX className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-5xl w-full max-h-full flex items-center justify-center z-[115]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={formData.image_url}
              alt="Full Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
            />
            <div className="absolute -bottom-10 left-0 right-0 text-center">
              <p className="text-zinc-400 text-sm font-medium">{formData.title || 'Image Preview'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
