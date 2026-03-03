import { supabase } from '../../lib/supabase';
import { clearCache } from '../../hooks/useCachedFetch';

// ── Fetch paginated tech stacks ──
export async function fetchTechStacks(page = 1, limit = 20, search = '') {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('tech_stacks')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`name.ilike.%${search}%,icon_identifier.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order('name')
    .range(from, to);

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

// ── Fetch single tech stack by ID ──
export async function fetchTechStackById(id) {
  const { data, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// ── Create tech stack ──
export async function createTechStack({ name, icon_identifier, color }) {
  const { data, error } = await supabase
    .from('tech_stacks')
    .insert({ name, icon_identifier, color })
    .select()
    .single();

  if (error) throw error;
  clearCache('techStacks');
  return data;
}

// ── Update tech stack ──
export async function updateTechStack(id, { name, icon_identifier, color }) {
  const { data, error } = await supabase
    .from('tech_stacks')
    .update({ name, icon_identifier, color })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  clearCache('techStacks');
  return data;
}

// ── Delete tech stack (+ cleanup M2M) ──
export async function deleteTechStack(id) {
  // Remove M2M references first
  await supabase.from('project_tech_stacks').delete().eq('tech_stack_id', id);

  const { error } = await supabase.from('tech_stacks').delete().eq('id', id);
  if (error) throw error;
  clearCache('techStacks');
}
