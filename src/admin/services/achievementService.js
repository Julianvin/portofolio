import { supabase } from '../../lib/supabase';
import { clearCache } from '../../hooks/useCachedFetch';

// ── Fetch paginated achievements ──
export async function fetchAchievements(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get total count
  const { count } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true });

  // Get paginated achievements, sorted by issue_date descending
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('issue_date', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

// ── Fetch all public achievements ──
export async function getPublicAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('issue_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ── Fetch single achievement by ID ──
export async function fetchAchievementById(id) {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ── Create achievement ──
export async function createAchievement(achievementData) {
  const { data, error } = await supabase
    .from('achievements')
    .insert(achievementData)
    .select()
    .single();

  if (error) throw error;
  clearCache('publicAchievements');
  return data;
}

// ── Update achievement ──
export async function updateAchievement(id, achievementData) {
  const { data, error } = await supabase
    .from('achievements')
    .update(achievementData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  clearCache('publicAchievements');
  return data;
}

// ── Delete achievement ──
export async function deleteAchievement(id) {
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) throw error;
  clearCache('publicAchievements');
}

// ── Upload achievement image to Supabase Storage ──
export async function uploadAchievementImage(file) {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `achievements/${fileName}`;

  // Using the bucket specified by user: project-image
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
