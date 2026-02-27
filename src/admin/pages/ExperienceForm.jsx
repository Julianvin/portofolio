import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchExperienceById, createExperience, updateExperience, uploadExperienceLogo } from '../services/experienceService';
import { FiSave, FiX, FiAlertTriangle, FiPlus, FiTrash2, FiUploadCloud, FiImage } from 'react-icons/fi';

export default function ExperienceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    role: '',
    company_name: '',
    start_date: '',
    end_date: '',
    description: '',
    image_url: '',
    responsibilities: [], // Array of strings
  });

  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!isEdit) return;
      try {
        const data = await fetchExperienceById(id);
        setFormData({
          role: data.role || '',
          company_name: data.company_name || '',
          start_date: data.start_date ? data.start_date.split('T')[0] : '',
          end_date: data.end_date ? data.end_date.split('T')[0] : '',
          description: data.description || '',
          image_url: data.image_url || '',
          responsibilities: data.responsibilities || [],
        });
        setIsCurrentlyWorking(!data.end_date);
      } catch (err) {
        setError(`Failed to load experience: ${err.message}`);
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

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsCurrentlyWorking(isChecked);
    if (isChecked) {
      setFormData((prev) => ({ ...prev, end_date: '' }));
    }
  };

  // ── Dynamic Responsibilities Handlers ──
  const handleAddResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ''],
    }));
  };

  const handleResponsibilityChange = (index, value) => {
    setFormData((prev) => {
      const newItems = [...prev.responsibilities];
      newItems[index] = value;
      return { ...prev, responsibilities: newItems };
    });
  };

  const handleRemoveResponsibility = (index) => {
    setFormData((prev) => {
      const newItems = prev.responsibilities.filter((_, i) => i !== index);
      return { ...prev, responsibilities: newItems };
    });
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
      const publicUrl = await uploadExperienceLogo(file);
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
      if (!formData.role || !formData.company_name) {
        throw new Error('Role and Company are required.');
      }
      if (!formData.start_date) {
        throw new Error('Start date is required.');
      }

      // Filter out empty responsibilities
      const cleanedResponsibilities = formData.responsibilities
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const payload = {
        role: formData.role.trim(),
        company_name: formData.company_name.trim(),
        start_date: formData.start_date,
        end_date: isCurrentlyWorking ? null : formData.end_date || null,
        description: formData.description?.trim() || null,
        image_url: formData.image_url?.trim() || null,
        responsibilities: cleanedResponsibilities,
      };

      if (isEdit) {
        await updateExperience(id, payload);
      } else {
        await createExperience(payload);
      }

      navigate('/admin/experiences');
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
            {isEdit ? 'Edit Pengalaman' : 'Pengalaman Baru'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isEdit ? 'Perbarui detail karir' : 'Tambah entri karir baru'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/experiences')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <FiX className="w-4 h-4" />
          Batal
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
            <label className="text-sm font-medium text-zinc-300">Logo Perusahaan (Opsional)</label>
            <div className="flex items-start gap-6">
              <div className="shrink-0">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Company Logo Preview"
                    className="w-20 h-20 rounded-xl object-contain bg-white border border-zinc-800"
                  />
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
                    <span>{uploading ? 'Mengunggah...' : 'Unggah Logo'}</span>
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
                      Hapus
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  Direkomendasikan: Gambar persegi, maks 5MB. PNG, JPG, atau WebP.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-zinc-300">Peran *</label>
              <input
                id="role"
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="misal: Senior Fullstack Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor="company_name" className="text-sm font-medium text-zinc-300">Nama Perusahaan *</label>
              <input
                id="company_name"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g. Google"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="start_date" className="text-sm font-medium text-zinc-300">Tanggal Mulai *</label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                max={formData.end_date || undefined}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2 relative">
              <label htmlFor="end_date" className="text-sm font-medium text-zinc-300">Tanggal Berakhir</label>
              <input
                id="end_date"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={isCurrentlyWorking}
                min={formData.start_date || undefined}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="currently_working" className="flex items-center gap-2 mt-2 cursor-pointer w-fit text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <input
                  id="currently_working"
                  type="checkbox"
                  checked={isCurrentlyWorking}
                  onChange={handleCheckboxChange}
                  className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                />
                Masih bekerja di sini
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Deskripsi Singkat</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-y"
              placeholder="Ringkasan singkat tentang peran tersebut..."
            />
          </div>

          {/* Dynamic Responsibilities Array */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Tanggung Jawab</label>
            </div>
            
            <div className="space-y-3">
              {formData.responsibilities.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                      placeholder={`Tanggung Jawab #${index + 1}`}
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      data-testid={`responsibility-input-${index}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(index)}
                    className="mt-0.5 p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Remove item"
                    data-testid={`remove-responsibility-${index}`}
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddResponsibility}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors w-fit border border-blue-500/20 cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              Tambah Item
            </button>
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
            Simpan Pengalaman
          </button>
        </div>
      </form>
    </div>
  );
}
