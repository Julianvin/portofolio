import DOMPurify from 'dompurify';

const BASE_URL = 'https://www.delvinjulian.me';

const ALLOWED_TAGS = [
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'iframe',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'strong',
  'u',
  'ul',
];

const ALLOWED_ATTR = [
  'allow',
  'allowfullscreen',
  'alt',
  'class',
  'frameborder',
  'height',
  'href',
  'loading',
  'referrerpolicy',
  'rel',
  'src',
  'target',
  'title',
  'width',
];

const EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'www.tiktok.com',
  'tiktok.com',
]);

function toUrl(value) {
  try {
    return new URL(value, BASE_URL);
  } catch {
    return null;
  }
}

export function isAllowedEmbedUrl(value) {
  const url = toUrl(value);
  if (!url || url.protocol !== 'https:' || !EMBED_HOSTS.has(url.hostname)) {
    return false;
  }

  if (url.hostname.includes('youtube')) {
    return url.pathname.startsWith('/embed/');
  }

  return url.pathname.startsWith('/embed/v2/');
}

export function sanitizeBlogHtml(html = '') {
  if (!html) return '';

  const sanitized = DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy'],
    ALLOWED_ATTR,
    ALLOWED_TAGS,
    FORBID_ATTR: ['style'],
  });

  const template = document.createElement('template');
  template.innerHTML = sanitized;

  template.content.querySelectorAll('iframe').forEach((iframe) => {
    if (!isAllowedEmbedUrl(iframe.getAttribute('src'))) {
      iframe.remove();
      return;
    }

    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.setAttribute('allowfullscreen', 'true');
  });

  template.content.querySelectorAll('img[src]').forEach((image) => {
    const url = toUrl(image.getAttribute('src'));
    if (!url || !['http:', 'https:'].includes(url.protocol)) {
      image.remove();
    }
  });

  template.content.querySelectorAll('a[href]').forEach((link) => {
    const url = toUrl(link.getAttribute('href'));
    if (!url || !['http:', 'https:', 'mailto:'].includes(url.protocol)) {
      link.removeAttribute('href');
      return;
    }

    if (url.origin !== BASE_URL && url.protocol !== 'mailto:') {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  return template.innerHTML;
}

export function getPlainTextFromHtml(html = '') {
  const template = document.createElement('template');
  template.innerHTML = sanitizeBlogHtml(html);
  return template.content.textContent?.replace(/\s+/g, ' ').trim() || '';
}

export function hasMeaningfulBlogContent(html = '') {
  if (getPlainTextFromHtml(html)) return true;

  const template = document.createElement('template');
  template.innerHTML = sanitizeBlogHtml(html);
  return Boolean(template.content.querySelector('img, iframe'));
}
