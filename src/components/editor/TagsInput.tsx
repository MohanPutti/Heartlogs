"use client";

import { useState, useRef, useEffect } from "react";
import { Tag, X } from "lucide-react";
import { useEditorStore } from "@/lib/stores/editorStore";
import { TagType } from "@/types";

export function TagsInput() {
  const { tags, addTag, removeTag } = useEditorStore();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<TagType[]>([]);
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setAllTags(d));
  }, []);

  useEffect(() => {
    if (input.trim()) {
      setSuggestions(
        allTags.filter(
          (t) =>
            t.name.toLowerCase().includes(input.toLowerCase()) &&
            !tags.includes(t.name)
        )
      );
    } else {
      setSuggestions([]);
    }
  }, [input, allTags, tags]);

  function commitTag(name: string) {
    const trimmed = name.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      addTag(trimmed);
    }
    setInput("");
    setSuggestions([]);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      commitTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Tag size={13} className="text-[var(--text-muted)] shrink-0" />
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
        >
          {tag}
          <button onClick={() => removeTag(tag)} className="hover:text-[var(--text-primary)]">
            <X size={10} />
          </button>
        </span>
      ))}
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            if (input.trim()) commitTag(input);
            setTimeout(() => setFocused(false), 150);
          }}
          placeholder="Add tag…"
          className="text-xs bg-transparent outline-none text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] w-20 focus:w-32 transition-all"
        />
        {focused && suggestions.length > 0 && (
          <div
            className="absolute top-full left-0 mt-1 rounded-xl border shadow-md z-50 py-1 min-w-max"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            {suggestions.map((s) => (
              <button
                key={s.id}
                onMouseDown={() => commitTag(s.name)}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
