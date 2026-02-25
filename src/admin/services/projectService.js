import { supabase } from '../../lib/supabase';

// ── Fetch paginated projects with tech stacks ──
export async function fetchProjects(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get total count
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  // Get paginated projects
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_tech_stacks (
        tech_stacks (
          id,
          name,
          icon_identifier
        )
      )
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  // Flatten the nested tech_stacks
  const formatted = (projects || []).map((p) => ({
    ...p,
    tech_stacks: (p.project_tech_stacks || [])
      .map((pts) => pts.tech_stacks)
      .filter(Boolean),
  }));

  // Remove the raw join field
  formatted.forEach((p) => delete p.project_tech_stacks);

  return { data: formatted, total: count || 0 };
}

// ── Fetch all public projects with tech stacks ──
export async function getPublicProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_tech_stacks (
        tech_stacks (
          id,
          name,
          icon_identifier
        )
      )
    `)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Flatten the nested tech_stacks
  const formatted = (projects || []).map((p) => ({
    ...p,
    tech_stacks: (p.project_tech_stacks || [])
      .map((pts) => pts.tech_stacks)
      .filter(Boolean),
  }));

  // Remove the raw join field
  formatted.forEach((p) => delete p.project_tech_stacks);

  return formatted;
}

// ── Fetch single project by ID ──
export async function fetchProjectById(id) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_tech_stacks (
        tech_stack_id
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return {
    ...data,
    tech_stack_ids: (data.project_tech_stacks || []).map((pts) => pts.tech_stack_id),
  };
}

// ── Create project + M2M tech stacks (transaction-like) ──
export async function createProject(projectData, techStackIds = []) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();

  if (projectError) throw projectError;

  if (techStackIds.length > 0) {
    const m2mRows = techStackIds.map((tsId) => ({
      project_id: project.id,
      tech_stack_id: tsId,
    }));

    const { error: m2mError } = await supabase
      .from('project_tech_stacks')
      .insert(m2mRows);

    if (m2mError) {
      throw new Error(
        `Project "${project.title}" was saved (ID: ${project.id}), but tech stack assignment failed: ${m2mError.message}. Please edit the project to retry.`
      );
    }
  }

  return project;
}

// ── Update project + M2M tech stacks (transaction-like) ──
export async function updateProject(id, projectData, techStackIds = []) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single();

  if (projectError) throw projectError;

  // Delete old M2M rows
  const { error: deleteError } = await supabase
    .from('project_tech_stacks')
    .delete()
    .eq('project_id', id);

  if (deleteError) {
    throw new Error(
      `Project updated, but failed to clear old tech stacks: ${deleteError.message}. Please retry editing.`
    );
  }

  // Insert new M2M rows
  if (techStackIds.length > 0) {
    const m2mRows = techStackIds.map((tsId) => ({
      project_id: id,
      tech_stack_id: tsId,
    }));

    const { error: m2mError } = await supabase
      .from('project_tech_stacks')
      .insert(m2mRows);

    if (m2mError) {
      throw new Error(
        `Project updated, but tech stack assignment failed: ${m2mError.message}. Please retry editing.`
      );
    }
  }

  return project;
}

// ── Delete project ──
export async function deleteProject(id) {
  // Delete M2M rows first
  await supabase.from('project_tech_stacks').delete().eq('project_id', id);

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// ── Fetch all tech stacks (for form picker) ──
export async function fetchAllTechStacks() {
  const { data, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

// ── Dashboard stats ──
export async function fetchStats() {
  const [projectsRes, techStacksRes] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('tech_stacks').select('*', { count: 'exact', head: true }),
  ]);

  return {
    projectCount: projectsRes.count || 0,
    techStackCount: techStacksRes.count || 0,
  };
}

// ── Upload project image to Supabase Storage ──
export async function uploadProjectImage(file) {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `projects/${fileName}`;

  const { error } = await supabase.storage
    .from('project-image')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('project-image')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
