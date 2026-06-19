import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import TagInput from '../components/TagInput';
import {
  fetchBlogById,
  createBlog,
  updateBlog,
  fetchAllCategories,
  fetchAllTags,
  uploadBlogCoverImage,
  createCategory,
  findOrCreateTagsByNames
} from '../services/blogService';
import { FiSave, FiArrowLeft, FiX, FiAlertTriangle, FiCheck, FiUploadCloud } from 'react-icons/fi';
import { hasMeaningfulBlogContent, sanitizeBlogHtml } from '../../utils/sanitizeBlogContent';

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  status: 'draft',
  category_id: '',
  meta_title: '',
  meta_description: '',
  meta_robots: 'index, follow',
  published_at: '',
};

// --- URL converter for YouTube & TikTok ---
function convertToEmbedUrl(url) {
  if (!url) return url;

  // YouTube watch URL → embed
  if (url.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch { /* ignore */ }
  }
  // YouTube short URL → embed
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  // TikTok URL → embed
  if (url.includes('tiktok.com')) {
    const match = url.match(/\/video\/(\d+)/);
    if (match && match[1]) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }

  return url; // Already an embed URL or unknown
}

// --- Quill toolbar config with custom video handler ---
const QUILL_MODULES = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      video: function () {
        const url = prompt('Masukkan URL video (YouTube / TikTok):');
        if (!url) return;
        const embedUrl = convertToEmbedUrl(url.trim());
        const editor = this.quill;
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'video', embedUrl);
        editor.setSelection(range.index + 1);
      }
    }
  },
};

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderColor: state.isFocused ? 'rgba(59, 130, 246, 0.5)' : 'rgb(63, 63, 70)',
    color: 'white',
    borderRadius: '0.75rem',
    padding: '2px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: state.isFocused ? 'rgba(59, 130, 246, 0.5)' : 'rgb(82, 82, 91)',
    }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'rgb(39, 39, 42)',
    border: '1px solid rgb(63, 63, 70)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
    color: state.isFocused ? '#60a5fa' : 'white',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
    }
  }),
  singleValue: (base) => ({ ...base, color: 'white' }),
  input: (base) => ({ ...base, color: 'white' }),
  placeholder: (base) => ({ ...base, color: 'rgb(113, 113, 122)' }),
  indicatorSeparator: () => ({ display: 'none' }),
};

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  // Tags are now stored as string names, NOT IDs
  const [tagNames, setTagNames] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  // All existing tag names from DB (for autocomplete suggestions)
  const [allTagSuggestions, setAllTagSuggestions] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSlugModified] = useState(false);
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);

  // Load relations and blog data
  useEffect(() => {
    const load = async () => {
      try {
        const [cats, tags] = await Promise.all([
          fetchAllCategories(),
          fetchAllTags()
        ]);
        setAllCategories(cats);
        setAllTagSuggestions(tags.map((t) => t.name));

        if (isEdit) {
          const blog = await fetchBlogById(id);
          let pubAt = '';
          if (blog.published_at) {
            const date = new Date(blog.published_at);
            pubAt = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          }

          setForm({
            title: blog.title || '',
            slug: blog.slug || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            cover_image: blog.cover_image || '',
            status: blog.status || 'draft',
            category_id: blog.category_id || '',
            meta_title: blog.meta_title || '',
            meta_description: blog.meta_description || '',
            meta_robots: blog.meta_robots || 'index, follow',
            published_at: pubAt,
          });

          // Resolve tag IDs back to names for editing
          const blogTagNames = (blog.tag_ids || [])
            .map((tid) => {
              const found = tags.find((t) => t.id === tid);
              return found ? found.name : null;
            })
            .filter(Boolean);
          setTagNames(blogTagNames);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  // Add tooltips to Quill toolbar
  useEffect(() => {
    if (loading) return;
    
    const addTooltips = () => {
      const tooltips = {
        'ql-bold': 'Bold',
        'ql-italic': 'Italic',
        'ql-underline': 'Underline',
        'ql-strike': 'Strikethrough',
        'ql-list': 'List',
        'ql-blockquote': 'Blockquote',
        'ql-code-block': 'Code Block',
        'ql-link': 'Insert Link',
        'ql-image': 'Insert Image',
        'ql-video': 'Insert Video',
        'ql-clean': 'Remove Formatting',
        'ql-header': 'Heading',
        'ql-align': 'Text Alignment'
      };

      Object.entries(tooltips).forEach(([selector, text]) => {
        const elements = document.querySelectorAll(`.quill-container .${selector}`);
        elements.forEach(el => {
          el.setAttribute('title', text);
        });
      });
    };

    const timer = setTimeout(addTooltips, 100);
    return () => clearTimeout(timer);
  }, [loading]);

  // Auto-generate slug
  useEffect(() => {
    // Sync slug with title automatically
    if (form.title && !isSlugModified) {
      const generatedSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.title, isSlugModified]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadBlogCoverImage(file);
      handleChange('cover_image', publicUrl);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreateCategory = async (inputValue) => {
    setCreatingCategory(true);
    try {
      const newCat = await createCategory(inputValue);
      setAllCategories(prev => [...prev, newCat]);
      handleChange('category_id', newCat.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Read content directly from editor DOM to preserve iframes
    // react-quill-new's onChange uses getSemanticHTML() which corrupts <iframe> to <a>
    let rawContent = form.content;
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (editor && editor.root) {
        rawContent = editor.root.innerHTML;
      }
    }

    if (!form.title.trim()) { setError('Judul wajib diisi.'); return; }
    if (!form.slug.trim()) { setError('Slug wajib diisi.'); return; }
    if (!form.excerpt.trim()) { setError('Ringkasan (Excerpt) wajib diisi.'); return; }
    const sanitizedContent = sanitizeBlogHtml(rawContent);

    if (!hasMeaningfulBlogContent(sanitizedContent) || sanitizedContent === '<p><br></p>') { setError('Konten artikel tidak boleh kosong.'); return; }

    setSaving(true);
    try {
      let isoPublishedAt = null;
      if (form.published_at) {
         isoPublishedAt = new Date(form.published_at).toISOString();
      }

      const blogData = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: sanitizedContent.trim(),
        cover_image: form.cover_image.trim() || null,
        status: form.status,
        category_id: form.category_id || null,
        meta_title: form.meta_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
        meta_robots: form.meta_robots.trim() || 'index, follow',
        published_at: isoPublishedAt,
      };

      // Resolve tag names to IDs (find existing or create new) ON SAVE
      const resolvedTagIds = await findOrCreateTagsByNames(tagNames);

      if (isEdit) {
        await updateBlog(id, blogData, resolvedTagIds);
      } else {
        await createBlog(blogData, resolvedTagIds);
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/blogs'), 800);
    } catch (err) {
      if (err.code === '23505') {
        setError('Slug sudah digunakan. Silakan buat slug lain yang unik.');
      } else {
        setError(err.message);
      }
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

  // Category options for CreatableSelect
  const categoryOptions = allCategories.map(cat => ({ value: cat.id, label: cat.name }));
  const selectedCategory = categoryOptions.find(c => c.value === form.category_id) || null;

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ];
  const selectedStatus = statusOptions.find(s => s.value === form.status);

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/blogs')}
          className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
        </h1>
      </div>

      {/* Error & Success */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <FiAlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          <FiCheck className="w-4 h-4 shrink-0" />
          {isEdit ? 'Artikel diperbarui!' : 'Artikel dipublish!'} Mengalihkan...
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Info Dasar</h2>
              <div className="space-y-2">
                <Field label="Judul *" value={form.title} onChange={(v) => handleChange('title', v)} placeholder="Cara Membuat Sesuatu..." />
                {form.title && (
                  <div className="px-1 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                    <span className="shrink-0">URL Preview:</span>
                    <span className="truncate text-blue-400/80">delvinjulian.me/blogs/{form.slug || '...'}</span>
                  </div>
                )}
              </div>
              <TextArea label="Ringkasan (Excerpt) *" value={form.excerpt} onChange={(v) => handleChange('excerpt', v)} placeholder="Paragraf pendek yang muncul di list blog..." rows={3} />
            </div>

            {/* Category & Tags (Moved here for more space) */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Kategori & Tag</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Kategori Utama</label>
                  <CreatableSelect
                    isClearable
                    isDisabled={creatingCategory}
                    isLoading={creatingCategory}
                    onChange={(newValue) => handleChange('category_id', newValue ? newValue.value : '')}
                    onCreateOption={handleCreateCategory}
                    options={categoryOptions}
                    value={selectedCategory}
                    placeholder="Pilih atau ketik baru..."
                    styles={selectStyles}
                    formatCreateLabel={(inputValue) => `Buat Kategori "${inputValue}"`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Tags</label>
                  <TagInput
                    tags={tagNames}
                    onChange={setTagNames}
                    suggestions={allTagSuggestions}
                  />
                </div>
              </div>
            </div>

            {/* Rich Text Content */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Konten Artikel *</h2>
              <div className="rounded-xl quill-container border border-zinc-800 focus-within:border-blue-500/50 transition-colors">
                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  value={form.content} 
                  onChange={(v) => handleChange('content', v)} 
                  modules={QUILL_MODULES}
                  bounds=".quill-container"
                />
              </div>
            </div>

             {/* SEO Config */}
             <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Pengaturan SEO</h2>
              <Field label="Meta Title" value={form.meta_title} onChange={(v) => handleChange('meta_title', v)} placeholder="Jika kosong, akan pakai judul artikel" />
              <TextArea label="Meta Description" value={form.meta_description} onChange={(v) => handleChange('meta_description', v)} placeholder="Jika kosong, akan pakai excerpt..." rows={2} />
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Meta Robots</label>
                <select
                  value={form.meta_robots}
                  onChange={(e) => handleChange('meta_robots', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white focus:border-blue-500/50 outline-none"
                >
                  <option value="index, follow">Index, Follow (Biasa)</option>
                  <option value="noindex, follow">Noindex, Follow</option>
                  <option value="noindex, nofollow">Noindex, Nofollow (Sembunyikan)</option>
                </select>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Settings & Metadata */}
          <div className="space-y-6">
            
            {/* Status & Publish */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Publikasi</h2>
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Status</label>
                <Select
                  value={selectedStatus}
                  onChange={(val) => handleChange('status', val.value)}
                  options={statusOptions}
                  styles={selectStyles}
                  isSearchable={false}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Tanggal Publish</label>
                <input
                  type="datetime-local"
                  value={form.published_at}
                  onChange={(e) => handleChange('published_at', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>



            {/* Cover Image */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Cover Image</h2>
              
              {form.cover_image && (
                <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
                  <img src={form.cover_image} alt="Preview" className="w-full h-32 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleChange('cover_image', '')}
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-zinc-300 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-all duration-200 cursor-pointer ${
                    uploading
                      ? 'border-zinc-700 text-zinc-600 cursor-wait'
                      : 'border-zinc-700 text-zinc-400 hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5'
                  }`}
                >
                  {uploading ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-blue-400 animate-spin" /> Mengunggah & Kompres...</>
                  ) : (
                    <><FiUploadCloud className="w-4 h-4" /> {form.cover_image ? 'Ganti Gambar' : 'Unggah Gambar'}</>
                  )}
                </label>
                <p className="text-[10px] text-zinc-500 mt-2 text-center">Gambar akan otomatis dikompres ke WebP untuk performa.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <><FiSave className="w-4 h-4" /> {isEdit ? 'Simpan Perubahan' : 'Publish Artikel'}</>
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
