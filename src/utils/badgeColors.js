/**
 * Returns Tailwind css classes for badge pill depending on type or category name
 * 
 * Target styling: bg-color/10 text-color border border-color/20
 * 
 * @param {string} value Enum value from `type` or `category` constraints.
 * @returns {string} Tailwind css classes for the badge.
 */
export function getBadgeColor(value) {
    if (!value) return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    
    // Normalize string:
    const base = value.toLowerCase().trim();
    
    switch (base) {
        // --- Types ---
        case 'course':
            return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case 'award':
            return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        case 'badge':
            return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
        case 'professional':
            return "bg-green-500/10 text-green-400 border-green-500/20";
        case 'recognition':
            return "bg-purple-500/10 text-purple-400 border-purple-500/20";

        // --- Categories ---
        case 'backend':
            return "bg-purple-500/10 text-purple-400 border-purple-500/20";
        case 'frontend':
            return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
        case 'mobile':
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case 'cloud computing':
            return "bg-sky-500/10 text-sky-400 border-sky-500/20";
        case 'general':
            return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
        case 'freelance':
            return "bg-orange-500/10 text-orange-400 border-orange-500/20";
        case 'development tools':
            return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
        case 'algorithm':
            return "bg-rose-500/10 text-rose-400 border-rose-500/20";
        case 'ai':
            return "bg-indigo-600/10 text-indigo-400 border-indigo-500/20";
        case 'organization':
            return "bg-teal-500/10 text-teal-400 border-teal-500/20";

        // Default or generic fallback mapping
        default:
             return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
}
