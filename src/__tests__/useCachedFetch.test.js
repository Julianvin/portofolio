import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useCachedFetch, { clearCache } from '../hooks/useCachedFetch';

// ── sessionStorage mock ──
const store = {};
const sessionStorageMock = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = value; }),
  removeItem: vi.fn((key) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
};

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

describe('useCachedFetch', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any leftover cache entries
    sessionStorageMock.clear();
  });

  it('fetches data and stores it in sessionStorage when cache is empty', async () => {
    const mockData = [{ id: 1, name: 'React' }];
    const fetchFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useCachedFetch('test_empty', fetchFn));

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(fetchFn).toHaveBeenCalledTimes(1);

    // Verify sessionStorage was written
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      'cache_test_empty',
      expect.stringContaining('"data"')
    );
  });

  it('returns cached data without calling fetchFn when TTL is valid', async () => {
    // Pre-populate cache
    const cachedData = [{ id: 2, name: 'Vue' }];
    store['cache_test_cached'] = JSON.stringify({
      data: cachedData,
      expiresAt: Date.now() + 300000, // 5 minutes from now
    });

    const fetchFn = vi.fn().mockResolvedValue([]);

    const { result } = renderHook(() => useCachedFetch('test_cached', fetchFn));

    // Should serve instantly from cache — no loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(cachedData);

    // Wait one tick to ensure fetch is NOT called
    await waitFor(() => {
      expect(fetchFn).not.toHaveBeenCalled();
    });
  });

  it('fetches fresh data when cache has expired', async () => {
    // Pre-populate with expired cache
    const staleData = [{ id: 3, name: 'Stale' }];
    store['cache_test_expired'] = JSON.stringify({
      data: staleData,
      expiresAt: Date.now() - 1000, // Already expired
    });

    const freshData = [{ id: 4, name: 'Fresh' }];
    const fetchFn = vi.fn().mockResolvedValue(freshData);

    const { result } = renderHook(() => useCachedFetch('test_expired', fetchFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(freshData);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors gracefully', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCachedFetch('test_error', fetchFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('Network error');
    expect(result.current.data).toEqual([]); // Falls back to empty array
  });

  it('returns empty array as default data', async () => {
    const fetchFn = vi.fn().mockResolvedValue(null);

    const { result } = renderHook(() => useCachedFetch('test_null', fetchFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // null data should fallback to []
    expect(result.current.data).toEqual([]);
  });
});

describe('clearCache', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    vi.clearAllMocks();
  });

  it('removes specific cache keys from sessionStorage', () => {
    store['cache_techStacks'] = JSON.stringify({ data: [], expiresAt: Date.now() + 300000 });
    store['cache_publicProjects'] = JSON.stringify({ data: [], expiresAt: Date.now() + 300000 });

    clearCache('techStacks');

    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('cache_techStacks');
    expect(store['cache_publicProjects']).toBeDefined(); // Should NOT be removed
  });

  it('removes multiple cache keys at once', () => {
    store['cache_techStacks'] = JSON.stringify({ data: [], expiresAt: Date.now() + 300000 });
    store['cache_publicProjects'] = JSON.stringify({ data: [], expiresAt: Date.now() + 300000 });

    clearCache('techStacks', 'publicProjects');

    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('cache_techStacks');
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('cache_publicProjects');
  });

  it('forces re-fetch after cache is cleared', async () => {
    const initialData = [{ id: 1 }];
    store['cache_test_invalidate'] = JSON.stringify({
      data: initialData,
      expiresAt: Date.now() + 300000,
    });

    const freshData = [{ id: 2 }];
    const fetchFn = vi.fn().mockResolvedValue(freshData);

    // First render — should use cache
    const { result, unmount } = renderHook(() => useCachedFetch('test_invalidate', fetchFn));
    expect(result.current.data).toEqual(initialData);
    expect(fetchFn).not.toHaveBeenCalled();
    unmount();

    // Clear the cache
    clearCache('test_invalidate');

    // Second render — should fetch fresh
    const { result: result2 } = renderHook(() => useCachedFetch('test_invalidate', fetchFn));

    await waitFor(() => {
      expect(result2.current.isLoading).toBe(false);
    });

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(result2.current.data).toEqual(freshData);
  });
});
