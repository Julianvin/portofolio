import { useState, useEffect, useRef } from 'react';

// ── Configuration ──
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'cache_';

// ── In-flight deduplication map ──
// Prevents duplicate network requests when multiple components
// mount simultaneously with the same cacheKey.
const inflightRequests = new Map();

// ── Cache Helpers ──

function getCachedData(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() < expiresAt) {
      return data;
    }

    // Expired — clean up
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  } catch {
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }
}

function setCachedData(key, data, ttl) {
  try {
    const entry = { data, expiresAt: Date.now() + ttl };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (err) {
    // localStorage full or serialization error — silently skip
    console.warn('[useCachedFetch] Failed to write cache:', err);
  }
}

// ── Public Utility: Cache Invalidation ──


export function clearCache(...keys) {
  keys.forEach((key) => {
    localStorage.removeItem(CACHE_PREFIX + key);
    inflightRequests.delete(key);
  });
}

// ── Custom Hook ──


export default function useCachedFetch(cacheKey, fetchFn, options = {}) {
  const { ttl = DEFAULT_TTL } = options;

  // Try to serve from cache synchronously for instant render
  const [data, setData] = useState(() => getCachedData(cacheKey));
  const [isLoading, setIsLoading] = useState(() => getCachedData(cacheKey) === null);
  const [error, setError] = useState(null);

  // Stable ref for fetchFn to avoid unnecessary re-fetches
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  useEffect(() => {
    // If we already served from cache, skip the network fetch
    const cached = getCachedData(cacheKey);
    if (cached !== null) {
      // Ensure state reflects cache (handles React strict mode double-mount)
      setData(cached);
      setIsLoading(false);
      return;
    }

    // AbortController for cleanup on unmount
    const controller = new AbortController();
    let cancelled = false;

    async function doFetch() {
      setIsLoading(true);
      setError(null);

      try {
        let result;

        // Deduplicate: if another component already started this fetch, reuse its promise
        if (inflightRequests.has(cacheKey)) {
          result = await inflightRequests.get(cacheKey);
        } else {
          const promise = fetchFnRef.current();
          inflightRequests.set(cacheKey, promise);

          try {
            result = await promise;
          } finally {
            inflightRequests.delete(cacheKey);
          }
        }

        if (!cancelled) {
          setCachedData(cacheKey, result, ttl);
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(`[useCachedFetch] Error fetching "${cacheKey}":`, err);
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    doFetch();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [cacheKey, ttl]);

  return { data: data ?? [], isLoading, error };
}
