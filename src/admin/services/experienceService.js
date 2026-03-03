import { supabase } from '../../lib/supabase';
import { clearCache } from '../../hooks/useCachedFetch';

// ── Fetch paginated experiences ──
export async function fetchExperiences(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get total count
  const { count } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true });

  // Get paginated experiences, sorted by start_date descending
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

// ── Fetch all public experiences ──
export async function getPublicExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ── Fetch single experience by ID ──
export async function fetchExperienceById(id) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ── Create experience ──
export async function createExperience(experienceData) {
  // Ensure we send responsibilities as JSON-friendly array which Supabase handles as text[]
  const payload = {
    ...experienceData,
    responsibilities: experienceData.responsibilities || [],
  };

  const { data, error } = await supabase
    .from('experiences')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  clearCache('publicExperiences');
  return data;
}

// ── Update experience ──
export async function updateExperience(id, experienceData) {
  const payload = {
    ...experienceData,
    responsibilities: experienceData.responsibilities || [],
  };

  const { data, error } = await supabase
    .from('experiences')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  clearCache('publicExperiences');
  return data;
}

// ── Delete experience ──
export async function deleteExperience(id) {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) throw error;
  clearCache('publicExperiences');
}

// ── Upload experience logo to Supabase Storage ──
export async function uploadExperienceLogo(file) {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `logos/${fileName}`;

  // Using the bucket specified by user: portfolio-images
  const bucketName = 'project-image';

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
