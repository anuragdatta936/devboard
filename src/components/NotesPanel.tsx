"use client";

import { useState } from "react";
import { Note } from "@/types/task";
import { v4 as uuidv4 } from "uuid";

const LANGUAGES = ["js", "ts", "tsx", "py", "bash", "css", "json", "sql", "other"];

const LANG_COLORS: Record<string, string> = {
  js:    "var(--accent-amber)",
  ts:    "var(--accent-cyan)",
  tsx:   "var(--accent-cyan)",
  py:    "var(--accent-green)",
  bash:  "var(--accent-green)",
  css:   "var(--accent-purple)",
  json:  "var(--accent-amber)",
  sql:   "var(--accent-red)",
  other: "var(--text-muted)",
};

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

function NoteCard({ note, onDelete, onTogglePin }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="card group animate-fade-in overflow-hidden"
      style={{
        borderLeft: note.pinned ? "2px solid var(--accent-amber)" : "2px solid var(--border)",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm">{note.isCode ? "⌨" : "✎"}</span>
          <span
            className="text-sm font-medium truncate"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
          >
            {note.title}
          </span>
          {note.isCode && note.language && (
            <span
              className="badge flex-shrink-0"
              style={{
                color: LANG_COLORS[note.language] || "var(--text-muted)",
                background: "var(--bg-elevated)",
                border: `1px solid var(--border)`,
              }}
            >
              .{note.language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {note.pinned && (
            <span className="text-xs" style={{ color: "var(--accent-amber)" }}>📌</span>
          )}
          <span
            className="text-xs transition-transform"
            style={{
              color: "var(--text-muted)",
              transform: expanded ? "rotate(180deg)" : "none",
              display: "inline-block",
            }}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="animate-fade-in">
          <div
            className="px-4 pb-2 text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          >
            {new Date(note.createdAt).toLocaleString()}
          </div>

          <div className="px-4 pb-4">
            {note.isCode ? (
              <pre
                className="code-block p-3 overflow-x-auto text-xs leading-relaxed"
                style={{ color: LANG_COLORS[note.language || "other"] || "var(--text-primary)" }}
              >
                <code>{note.content}</code>
              </pre>
            ) : (
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
              >
                {note.content}
              </p>
            )}
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <button
              onClick={() => onTogglePin(note.id)}
              className="text-xs transition-colors"
              style={{
                fontFamily: "var(--font-mono)",
                color: note.pinned ? "var(--accent-amber)" : "var(--text-muted)",
              }}
            >
              {note.pinned ? "Unpin" : "Pin"}
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="text-xs transition-colors hover:opacity-80"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent-red)" }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function NotesPanel({ notes, setNotes }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCode, setIsCode] = useState(false);
  const [language, setLanguage] = useState("ts");
  const [filter, setFilter] = useState<"all" | "notes" | "snippets">("all");
  const [search, setSearch] = useState("");

  const addNote = async () => {
    if (!title.trim() || !content.trim()) return;
    const tempNote: Note = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      isCode,
      language: isCode ? language : undefined,
      createdAt: new Date().toISOString(),
      pinned: false,
    };
    setNotes((prev) => [tempNote, ...prev]);
    setTitle(""); setContent("");
    const res = await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tempNote) });
    if (res.ok) {
      const saved = await res.json();
      setNotes((prev) => prev.map((n) => n.id === tempNote.id ? { ...saved, id: saved._id } : n));
    }
  };

  const deleteNote = async (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
  };

  const togglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));
    await fetch(`/api/notes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pinned: !note.pinned }) });
  };

  const filtered = notes
    .filter((n) => filter === "all" || (filter === "notes" ? !n.isCode : n.isCode))
    .filter((n) =>
      search === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Notes & Snippets
        </h2>
        <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
          {notes.length} saved
        </span>
      </div>

      {/* Add note form */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
            // New
          </span>
          {/* Toggle: note / snippet */}
          <div
            className="flex rounded-md overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {[
              { label: "Note", val: false },
              { label: "Snippet", val: true },
            ].map(({ label, val }) => (
              <button
                key={label}
                onClick={() => setIsCode(val)}
                className="px-3 py-1 text-xs transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: isCode === val ? "var(--accent-cyan-dim)" : "transparent",
                  color: isCode === val ? "var(--accent-cyan)" : "var(--text-muted)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {isCode && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs rounded px-2 py-1 outline-none"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--bg-elevated)",
                color: LANG_COLORS[language] || "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>.{l}</option>
              ))}
            </select>
          )}
        </div>

        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm bg-transparent outline-none border-b pb-2"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />

        <textarea
          placeholder={isCode ? "// Paste your code here..." : "Write your note..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full text-sm bg-transparent outline-none resize-none"
          style={{
            fontFamily: "var(--font-mono)",
            color: isCode ? "var(--accent-cyan)" : "var(--text-secondary)",
            fontSize: isCode ? "0.8rem" : "0.875rem",
          }}
        />

        <div className="flex justify-end">
          <button
            onClick={addNote}
            disabled={!title.trim() || !content.trim()}
            className="text-xs px-4 py-1.5 rounded transition-all"
            style={{
              fontFamily: "var(--font-mono)",
              background: title && content ? "var(--accent-cyan-dim)" : "var(--bg-elevated)",
              color: title && content ? "var(--accent-cyan)" : "var(--text-muted)",
              border: title && content ? "1px solid var(--accent-cyan-glow)" : "1px solid var(--border)",
            }}
          >
            Save {isCode ? "Snippet" : "Note"}
          </button>
        </div>
      </div>

      {/* Filter + search */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {(["all", "notes", "snippets"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-xs px-3 py-1 rounded-md capitalize transition-all"
              style={{
                fontFamily: "var(--font-mono)",
                background: filter === f ? "var(--accent-cyan-dim)" : "var(--bg-elevated)",
                color: filter === f ? "var(--accent-cyan)" : "var(--text-muted)",
                border: filter === f ? "1px solid var(--accent-cyan-glow)" : "1px solid var(--border)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-xs bg-transparent outline-none px-3 py-1.5 rounded-md"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--text-primary)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}
        />
      </div>

      {/* Notes list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div
            className="text-center py-12 text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          >
            {notes.length === 0 ? "// No notes yet. Create one above." : "// No results found."}
          </div>
        ) : (
          filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onTogglePin={togglePin}
            />
          ))
        )}
      </div>
    </div>
  );
}
