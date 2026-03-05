"use client";

import { Task, Note } from "@/types/task";
import StatsWidgets from "./StatsWidgets";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

interface Props {
  tasks: Task[];
  notes: Note[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ tasks, notes, setTasks, setActiveTab }: Props) {
  const [quickTask, setQuickTask] = useState("");

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "done");

  const handleQuickAdd = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !quickTask.trim()) return;
    const newTask = {
      id: uuidv4(),
      title: quickTask.trim(),
      status: "todo" as const,
      priority: "medium" as const,
      tags: [],
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setQuickTask("");
    const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newTask) });
    if (res.ok) {
      const saved = await res.json();
      setTasks((prev) => prev.map((t) => t.id === newTask.id ? { ...saved, id: saved._id } : t));
    }
  };

  const STATUS_COLOR: Record<string, string> = {
    "todo":        "var(--accent-cyan)",
    "in-progress": "var(--accent-amber)",
    "done":        "var(--accent-green)",
  };

  return (
    <div className="space-y-6">

      {/* Greeting header */}
      <div
        className="card p-6 relative overflow-hidden"
        style={{ borderLeft: "2px solid var(--accent-cyan)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top left, var(--accent-cyan-dim) 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          >
            // Welcome back
          </p>
          <h1
            className="text-2xl font-extrabold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            DevBoard<span style={{ color: "var(--accent-cyan)" }}>.</span>
          </h1>

          {/* Quick add */}
          <div
            className="flex items-center gap-3 rounded-md px-4 py-2.5 max-w-lg"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>❯</span>
            <input
              type="text"
              placeholder="Quick-add a task and press Enter..."
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              onKeyDown={handleQuickAdd}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsWidgets tasks={tasks} notes={notes} />

      {/* Two-col: recent + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent tasks */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
            >
              // Recent Tasks
            </h3>
            <button
              onClick={() => setActiveTab("kanban")}
              className="text-xs transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}
            >
              View all →
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <p className="text-xs py-4 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              No tasks yet. Use quick-add above.
            </p>
          ) : (
            recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLOR[task.status] }}
                  />
                  <span
                    className="text-sm truncate"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: task.status === "done" ? "var(--text-muted)" : "var(--text-secondary)",
                      textDecoration: task.status === "done" ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                </div>
                <span
                  className="badge flex-shrink-0 ml-2"
                  style={{
                    color: STATUS_COLOR[task.status],
                    background: "var(--bg-elevated)",
                  }}
                >
                  {task.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* High priority alerts */}
          <div className="card p-4 space-y-3">
            <h3
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
            >
              // High Priority
            </h3>
            {highPriority.length === 0 ? (
              <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--accent-green)" }}>
                ✓ No high-priority items pending.
              </p>
            ) : (
              highPriority.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 text-xs py-1.5"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <span style={{ color: "var(--accent-red)" }}>⚠</span>
                  <span
                    className="flex-1 truncate"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
                  >
                    {task.title}
                  </span>
                  <span className="badge" style={{ color: "var(--accent-red)", background: "var(--accent-red-dim)" }}>
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Recent notes */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                // Recent Notes
              </h3>
              <button
                onClick={() => setActiveTab("notes")}
                className="text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}
              >
                View all →
              </button>
            </div>
            {recentNotes.length === 0 ? (
              <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                // No notes yet.
              </p>
            ) : (
              recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center gap-2 py-1.5"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <span className="text-xs">{note.isCode ? "⌨" : "✎"}</span>
                  <span
                    className="text-xs truncate flex-1"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
                  >
                    {note.title}
                  </span>
                  {note.isCode && (
                    <span className="badge" style={{ color: "var(--accent-purple)", background: "var(--accent-purple-dim)" }}>
                      .{note.language}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
