import React, { useState, useEffect, memo } from 'react';
import { FiBox } from 'react-icons/fi';

// ── Map icon prefix → react-icons module path ──
const ICON_FAMILIES = {
  Fa: () => import('react-icons/fa'),
  Fi: () => import('react-icons/fi'),
  Si: () => import('react-icons/si'),
  Md: () => import('react-icons/md'),
  Io: () => import('react-icons/io5'),
  Bi: () => import('react-icons/bi'),
  Hi: () => import('react-icons/hi'),
  Bs: () => import('react-icons/bs'),
  Ai: () => import('react-icons/ai'),
  Ri: () => import('react-icons/ri'),
  Tb: () => import('react-icons/tb'),
  Lu: () => import('react-icons/lu'),
  Gi: () => import('react-icons/gi'),
  Ti: () => import('react-icons/ti'),
  Vsc: () => import('react-icons/vsc'),
  Di: () => import('react-icons/di'),
  Gr: () => import('react-icons/gr'),
  Cg: () => import('react-icons/cg'),
  Im: () => import('react-icons/im'),
  Go: () => import('react-icons/go'),
  Pi: () => import('react-icons/pi'),
  Lia: () => import('react-icons/lia'),
  Tfi: () => import('react-icons/tfi'),
  Rx: () => import('react-icons/rx'),
  Ci: () => import('react-icons/ci'),
  Sl: () => import('react-icons/sl'),
};

// Cache loaded icons to avoid re-importing
const iconCache = new Map();

/**
 * Parses the icon prefix from an identifier string.
 * Handles multi-char prefixes like "Vsc", "Lia", "Tfi" before two-char ones.
 */
function getPrefix(identifier) {
  // Try 3-char prefixes first
  const three = identifier.substring(0, 3);
  if (ICON_FAMILIES[three]) return three;
  // Then 2-char
  const two = identifier.substring(0, 2);
  if (ICON_FAMILIES[two]) return two;
  return null;
}

/**
 * DynamicIcon — renders a react-icons icon from its identifier string.
 *
 * @param {string} iconIdentifier - e.g. "FaReact", "SiTailwindcss", "FiGithub"
 * @param {string} [className]    - Tailwind/CSS classes
 * @param {number} [size]         - Icon size in px
 */
const DynamicIcon = memo(function DynamicIcon({ iconIdentifier, className = '', size = 20, ...rest }) {
  const [IconComponent, setIconComponent] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!iconIdentifier || typeof iconIdentifier !== 'string') {
      setFailed(true);
      setIconComponent(null);
      return;
    }

    // Check cache first
    if (iconCache.has(iconIdentifier)) {
      setIconComponent(() => iconCache.get(iconIdentifier));
      setFailed(false);
      return;
    }

    let cancelled = false;

    const loadIcon = async () => {
      const prefix = getPrefix(iconIdentifier);
      if (!prefix) {
        if (!cancelled) setFailed(true);
        return;
      }

      try {
        const module = await ICON_FAMILIES[prefix]();
        const Icon = module[iconIdentifier];

        if (!cancelled) {
          if (Icon) {
            iconCache.set(iconIdentifier, Icon);
            setIconComponent(() => Icon);
            setFailed(false);
          } else {
            setFailed(true);
          }
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    setFailed(false);
    setIconComponent(null);
    loadIcon();

    return () => { cancelled = true; };
  }, [iconIdentifier]);

  if (failed || (!IconComponent && !iconIdentifier)) {
    return <FiBox className={className} size={size} data-testid="icon-fallback" {...rest} />;
  }

  if (!IconComponent) {
    // Loading state — small pulsing box
    return (
      <span
        className={`inline-block rounded bg-zinc-700 animate-pulse ${className}`}
        style={{ width: size, height: size }}
        data-testid="icon-loading"
      />
    );
  }

  return <IconComponent className={className} size={size} data-testid="icon-resolved" {...rest} />;
});

export default DynamicIcon;
