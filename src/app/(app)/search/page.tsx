"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { EntryCard } from "@/components/entry/EntryCard";
import { useSearch } from "@/lib/hooks/useSearch";
import { EntryType } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dateParam = searchParams.get("date");
  const qParam = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(qParam);
  const [dateEntries, setDateEntries] = useState<EntryType[]>([]);
  const [dateLoading, setDateLoading] = useState(false);

  const { results, loading } = useSearch(query);

  useEffect(() => {
    if (dateParam) {
      setDateLoading(true);
      fetch(`/api/entries?date=${dateParam}`)
        .then((r) => r.json())
        .then((d) => {
          setDateEntries(d.entries ?? []);
          setDateLoading(false);
        });
    }
  }, [dateParam]);

  function handleChange(v: string) {
    setQuery(v);
    if (v) {
      router.replace(`/search?q=${encodeURIComponent(v)}`);
    } else {
      router.replace("/search");
    }
  }

  const showDateResults = dateParam && !query;
  const displayEntries = showDateResults ? dateEntries : results;
  const isLoading = showDateResults ? dateLoading : loading;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          autoFocus
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search your entries…"
          className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
        {query && (
          <button onClick={() => handleChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : displayEntries.length > 0 ? (
        <div className="space-y-3">
          {showDateResults && (
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Entries on {new Date(dateParam + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          )}
          {displayEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <Search size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No entries found for &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <p className="text-sm">Type to search through your journal entries</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
