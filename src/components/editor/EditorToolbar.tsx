"use client";

import { Editor } from "@tiptap/react";
import {
  Bold, Italic, Strikethrough, List, ListOrdered,
  Quote, Heading2, Heading3, Highlighter, Link2, Minus, ChevronDown,
} from "lucide-react";

const FONTS = [
  { label: "Sans-serif", value: "Inter, system-ui, sans-serif" },
  { label: "Serif", value: "Playfair Display, Georgia, serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
];

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-sm ${
        active
          ? "bg-[var(--accent)] text-white"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />;
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const activeFont = FONTS.find((f) =>
    editor.isActive("textStyle", { fontFamily: f.value })
  );

  return (
    <div
      className="flex items-center gap-0.5 px-4 py-2 border-b flex-wrap"
      style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
    >
      {/* Font picker */}
      <div className="relative mr-1">
        <select
          value={activeFont?.value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val) editor.chain().focus().setFontFamily(val).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
          className="appearance-none pl-2 pr-6 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-secondary)",
            border: "none",
            outline: "none",
          }}
        >
          <option value="">Default</option>
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <ChevronDown size={10} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
      </div>

      <Divider />
      <ToolbarButton title="Bold (⌘B)" active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={14} />
      </ToolbarButton>
      <ToolbarButton title="Italic (⌘I)" active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={14} />
      </ToolbarButton>
      <ToolbarButton title="Strikethrough" active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={14} />
      </ToolbarButton>
      <ToolbarButton title="Highlight" active={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <Highlighter size={14} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={14} />
      </ToolbarButton>
      <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 size={14} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={14} />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={14} />
      </ToolbarButton>
      <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={14} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Add link" active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}>
        <Link2 size={14} />
      </ToolbarButton>
      <ToolbarButton title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={14} />
      </ToolbarButton>
    </div>
  );
}
