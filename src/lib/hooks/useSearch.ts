"use client";

import { useState, useEffect, useCallback } from "react";
import { EntryType } from "@/types";

export function useSearch(query: string, delay = 400) {
  const [results, setResults] = useState<EntryType[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), delay);
    return () => clearTimeout(timer);
  }, [query, search, delay]);

  return { results, loading };
}
