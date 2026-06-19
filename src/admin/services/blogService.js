import { supabase } from '../../lib/supabase';
import { clearCache } from '../../hooks/useCachedFetch';

function publishedOnly(query) {
  return query
    .eq('status', 'published')
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`);
}

// ── Fetch paginated blogs for admin ──
export async function fetchBlogs(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true });

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select(`
      *,
      categories (id, name, slug)
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { data: blogs || [], total: count || 0 };
}

// ── Fetch single blog by ID for admin edit ──
export async function fetchBlogById(id) {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      categories (id, name, slug),
      blog_tag (
        tag_id
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return {
    ...data,
    tag_ids: (data.blog_tag || []).map((bt) => bt.tag_id),
  };
}

// ── Fetch public blogs (Published only) ──
export async function getPublicBlogs() {
  const query = supabase
    .from('blogs')
    .select(`
      *,
      categories (id, name, slug),
      blog_tag (
        tags (id, name, slug)
      )
    `);

  const { data: blogs, error } = await publishedOnly(query)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Flatten the nested tags
  const formatted = (blogs || []).map((b) => ({
    ...b,
    tags: (b.blog_tag || [])
      .map((bt) => bt.tags)
      .filter(Boolean),
  }));

  // Remove the raw join field
  formatted.forEach((b) => delete b.blog_tag);

  return formatted;
}

// ── Fetch public single blog by slug ──
export async function getPublicBlogBySlug(slug) {
  const query = supabase
    .from('blogs')
    .select(`
      *,
      categories (id, name, slug),
      blog_tag (
        tags (id, name, slug)
      )
    `)
    .eq('slug', slug);

  const { data, error } = await publishedOnly(query).single();

  if (error) throw error;

  const formatted = {
    ...data,
    tags: (data.blog_tag || []).map((bt) => bt.tags).filter(Boolean),
  };
  delete formatted.blog_tag;

  return formatted;
}

// ── Resolve tag names → tag IDs (find existing or create new) ──
export async function findOrCreateTagsByNames(tagNames = []) {
  if (tagNames.length === 0) return [];

  // Fetch all existing tags
  const { data: existingTags, error } = await supabase
    .from('tags')
    .select('*');

  if (error) throw error;

  const tagIds = [];

  for (const name of tagNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;

    // Check if tag already exists (case insensitive)
    const existing = existingTags.find(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (existing) {
      tagIds.push(existing.id);
    } else {
      // Create new tag
      const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const { data: newTag, error: createError } = await supabase
        .from('tags')
        .insert({ name: trimmed, slug })
        .select()
        .single();

      if (createError) {
        // Handle race condition: if someone else created it, fetch it
        if (createError.code === '23505') {
          const { data: raceTag } = await supabase
            .from('tags')
            .select('*')
            .eq('slug', slug)
            .single();
          if (raceTag) {
            tagIds.push(raceTag.id);
            existingTags.push(raceTag);
          }
        } else {
          throw createError;
        }
      } else {
        tagIds.push(newTag.id);
        existingTags.push(newTag); // Add to local cache for subsequent iterations
      }
    }
  }

  return tagIds;
}

// ── Create blog + M2M tags ──
export async function createBlog(blogData, tagIds = []) {
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .insert(blogData)
    .select()
    .single();

  if (blogError) throw blogError;

  if (tagIds.length > 0) {
    const m2mRows = tagIds.map((tId) => ({
      blog_id: blog.id,
      tag_id: tId,
    }));

    const { error: m2mError } = await supabase
      .from('blog_tag')
      .insert(m2mRows);

    if (m2mError) {
      throw new Error(`Blog created but tag assignment failed: ${m2mError.message}`);
    }
  }

  clearCache('publicBlogs');
  return blog;
}

// ── Update blog + M2M tags ──
export async function updateBlog(id, blogData, tagIds = []) {
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .update(blogData)
    .eq('id', id)
    .select()
    .single();

  if (blogError) throw blogError;

  // Delete old tags
  await supabase.from('blog_tag').delete().eq('blog_id', id);

  // Insert new tags
  if (tagIds.length > 0) {
    const m2mRows = tagIds.map((tId) => ({
      blog_id: id,
      tag_id: tId,
    }));

    const { error: m2mError } = await supabase
      .from('blog_tag')
      .insert(m2mRows);

    if (m2mError) {
      throw new Error(`Blog updated but tag assignment failed: ${m2mError.message}`);
    }
  }

  clearCache('publicBlogs');
  clearCache(`blogDetail_${blogData.slug}`);
  return blog;
}

// ── Delete blog ──
export async function deleteBlog(id) {
  // Delete M2M rows first
  await supabase.from('blog_tag').delete().eq('blog_id', id);

  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
  clearCache('publicBlogs');
}

// ── Fetch all categories ──
export async function fetchAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

// ── Fetch all tags ──
export async function fetchAllTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

// ── Delete a category ──
export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    if (error.code === '23503') { // foreign key violation
      throw new Error('Kategori ini masih digunakan oleh artikel. Hapus atau ubah kategori di artikel terkait terlebih dahulu.');
    }
    throw error;
  }
}

// ── Create a new category ──
export async function createCategory(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error(`Kategori "${name}" sudah ada.`);
    }
    throw error;
  }
  return data;
}

// ── Delete a tag ──
export async function deleteTag(id) {
  // We can choose to delete from M2M first, or rely on CASCADE. Assuming CASCADE or we just delete.
  // Let's delete M2M first just in case CASCADE isn't set.
  await supabase.from('blog_tag').delete().eq('tag_id', id);
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}

// ── Create a new tag ──
export async function createTag(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const { data, error } = await supabase
    .from('tags')
    .insert({ name, slug })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      // Jika tag sudah ada, ambil dan kembalikan tag yang sudah ada
      const { data: existing, error: fetchError } = await supabase
        .from('tags')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (fetchError) throw fetchError;
      return existing;
    }
    throw error;
  }
  return data;
}

// ── Increment view counter ──
export async function incrementBlogViews(id) {
  const { error } = await supabase.rpc('increment_blog_views', { blog_id: id });
  if (error) throw error;
  clearCache('publicBlogs');
}

// ── Upload blog cover to Supabase Storage with WebP Compression ──
export async function uploadBlogCoverImage(file) {
  const options = {
    maxSizeMB: 0.5, // compress to max 500kb
    maxWidthOrHeight: 1200, // resize to max 1200px width/height
    useWebWorker: true,
    fileType: 'image/webp', // convert to WebP
    initialQuality: 0.85
  };

  try {
    const { default: imageCompression } = await import('browser-image-compression');
    const compressedFile = await imageCompression(file, options);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('blog-covers')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/webp'
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from('blog-covers')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error("Compression/Upload error:", err);
    throw new Error(`Gagal mengupload gambar: ${err.message}`);
  }
}
