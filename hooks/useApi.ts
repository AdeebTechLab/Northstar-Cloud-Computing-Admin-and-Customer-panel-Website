"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

interface UseApiState<T> {
  data: T | undefined;
  error: Error | null;
  loading: boolean; // first load
  refreshing: boolean; // background refresh
  reload: () => Promise<void>;
  updatedAt: Date | null;
}

/**
 * Loads data through the typed API layer and keeps it fresh when the store changes.
 * Pages get loading / error / data states from one place.
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = [], opts: { live?: boolean } = {}): UseApiState<T> {
  const { live = true } = opts;
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const mounted = useRef(true);

  const run = useCallback(async (background: boolean) => {
    if (background) setRefreshing(true);
    try {
      const result = await fetcherRef.current();
      if (!mounted.current) return;
      setData(result);
      setError(null);
      setUpdatedAt(new Date());
    } catch (e) {
      if (!mounted.current) return;
      setError(e instanceof Error ? e : new Error("Something went wrong."));
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    void run(false);
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (!live) return;
    return api.subscribe(() => void run(true));
  }, [live, run]);

  const reload = useCallback(() => run(true), [run]);
  return { data, error, loading, refreshing, reload, updatedAt };
}

/** Wraps a mutation with pending state. */
export function useMutation<A extends unknown[], R>(fn: (...args: A) => Promise<R>) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mutate = useCallback(
    async (...args: A) => {
      setPending(true);
      setError(null);
      try {
        return await fn(...args);
      } catch (e) {
        const err = e instanceof Error ? e : new Error("Something went wrong.");
        setError(err);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [fn],
  );
  return { mutate, pending, error, setError };
}
