"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, FontFamily } from "@tiptap/extension-text-style";
import { useEffect, useCallback } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { WordCounter } from "./WordCounter";
import { useEditorStore } from "@/lib/stores/editorStore";

interface DiaryEditorProps {
  initialContent?: string;
  onChange?: (json: string, wordCount: number) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function DiaryEditor({
  initialContent,
  onChange,
  readOnly = false,
  placeholder = "What's on your mind tonight…",
}: DiaryEditorProps) {
  const setDirty = useEditorStore((s) => s.setDirty);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Typography,
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: readOnly }),
      TextStyle,
      FontFamily,
    ],
    editable: !readOnly,
    content: initialContent ? JSON.parse(initialContent) : undefined,
    onUpdate({ editor }) {
      if (!readOnly) {
        const json = JSON.stringify(editor.getJSON());
        const words = editor.storage.characterCount?.words() ?? 0;
        onChange?.(json, words);
        setDirty(true);
      }
    },
    immediatelyRender: false,
  });

  // Sync initialContent if it changes (e.g. loading existing entry)
  useEffect(() => {
    if (editor && initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        editor.commands.setContent(parsed, { emitUpdate: false });
      } catch {
        // invalid JSON — ignore
      }
    }
  }, [editor, initialContent]);

  const getWordCount = useCallback(() => {
    return editor?.storage.characterCount?.words() ?? 0;
  }, [editor]);

  return (
    <div className="flex flex-col h-full">
      {!readOnly && editor && (
        <EditorToolbar editor={editor} />
      )}
      <div className={`flex-1 overflow-y-auto ${readOnly ? "" : "cursor-text"}`}
        onClick={() => !readOnly && editor?.commands.focus()}>
        <EditorContent
          editor={editor}
          className={`tiptap-content min-h-full px-6 md:px-10 py-6 outline-none ${readOnly ? "" : "focus:outline-none"}`}
        />
      </div>
      {!readOnly && <WordCounter getCount={getWordCount} />}
    </div>
  );
}
