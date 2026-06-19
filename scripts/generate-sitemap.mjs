import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://www.delvinjulian.me';
const STATIC_ROUTES = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.8' },
  { path: '/achievements', priority: '0.8' },
  { path: '/projects', priority: '0.8' },
  { path: '/contact', priority: '0.7' },
];

async function loadLocalEnv() {
  if (!existsSync('.env')) return;

  const content = await readFile('.env', 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1);
    process.env[key] ??= value;
  });
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function routeToXml({ loc, lastmod, priority }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

await loadLocalEnv();

const today = new Date().toISOString().slice(0, 10);
const routes = STATIC_ROUTES.map((route) => ({
  loc: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
  lastmod: today,
  priority: route.priority,
}));

/*
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, updated_at, published_at, created_at')
      .eq('status', 'published')
      .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.warn(`Skipping blog sitemap entries: ${error.message}`);
    } else {
      (data || []).forEach((blog) => {
        routes.push({
          loc: `${SITE_URL}/blogs/${blog.slug}`,
          lastmod: (blog.updated_at || blog.published_at || blog.created_at || today).slice(0, 10),
          priority: '0.7',
        });
      });
    }
  } catch (error) {
    console.warn(`Skipping blog sitemap entries: ${error.message}`);
  }
}
*/

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(routeToXml),
  '</urlset>',
  '',
].join('\n');

await writeFile('public/sitemap.xml', xml, 'utf8');
console.log(`Generated sitemap with ${routes.length} URLs.`);
