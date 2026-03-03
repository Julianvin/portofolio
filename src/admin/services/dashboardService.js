import { supabase } from '../../lib/supabase';

export async function fetchDashboardStats() {
  const fetchCount = async (table, select = '*', orderCol = 'created_at') => {
    try {
      const { data, count, error } = await supabase
        .from(table)
        .select(select, { count: 'exact' })
        .order(orderCol, { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      return { 
        count: count || 0, 
        latest: data?.[0] ? (data[0].title || data[0].company_name || data[0].name || null) : null 
      };
    } catch (err) {
      console.error(`Error fetching stats for ${table}:`, err);
      return { count: 0, latest: null };
    }
  };

  const [projects, achievements, experiences, techStacks] = await Promise.all([
    fetchCount('projects', 'title, created_at'),
    fetchCount('achievements', 'title, created_at'),
    fetchCount('experiences', 'company_name, created_at'),
    fetchCount('tech_stacks', 'name, created_at'),
  ]);

  return {
    projects,
    achievements,
    experiences,
    techStacks
  };
}

export async function checkSystemStatus() {
  try {
    const { data, error } = await supabase.from('projects').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('System status check failed:', err);
    return false;
  }
}
