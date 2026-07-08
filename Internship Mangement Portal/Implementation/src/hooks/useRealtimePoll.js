import { useCallback, useEffect, useRef, useState } from 'react';

export function useRealtimePoll(fetchFn, { interval = 10000, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const result = await fetchRef.current();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || 'Failed to load data');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    refresh(false);
    const timer = setInterval(() => refresh(true), interval);
    return () => clearInterval(timer);
  }, [enabled, interval, refresh]);

  return { data, loading, error, lastUpdated, refresh };
}
