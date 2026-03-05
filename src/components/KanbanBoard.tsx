"use client";

import { useState } from "react";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { v4 as uuidv4 } from "uuid";

const COLUMNS: { id: TaskStatus; label: string; color: string; icon: string }[] = [
  { id: "todo",        label: "Todo",        color: "var(--accent-cyan)",   icon: "○" },
  { id: "in-progress", label: "In Progress", color: "var(--accent-amber)",  icon: "◎" },
  { id: "done",        label: "Done",        color: "var(--accent-green)",  icon: "●" },
];

const PRIORITY_STYLES: Record<TaskPriority, { color: string; bg: string; label: string }> = {
  high:   { color: "var(--accent-red)",    bg: "var(--accent-red-dim)",    label: "HIGH"   },
  medium: { color: "var(--accent-amber)",  bg: "var(--accent-amber-dim)",  label: "MED"    },
  low:    { color: "var(--accent-green)",  bg: "var(--accent-green-dim)",  label: "LOW"    },
};

const PRIORITY_CYCLE: Record<TaskPriority, TaskPriority> = {
  low: "medium",
  medium: "high",
  high: "low",
};

interface TaskCardProps {
  task: Task;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onChangePriority: (id: string, priority: TaskPriority) => void;
}

function KanbanCard({ task, onMove, onDelete, onChangePriority }: TaskCardProps) {
  const p = PRIORITY_STYLES[task.priority];
  const otherStatuses = COLUMNS.filter((c) => c.id !== task.status);

  return (
    <div
      className="card p-3 space-y-2 group animate-fade-in"
      style={{ cursor: "default" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-sm leading-snug flex-1"
          style={{
            fontFamily: "var(--font-mono)",
            color: task.status === "done" ? "var(--text-muted)" : "var(--text-primary)",
            textDecoration: task.status === "done" ? "line-through" : "none",
          }}
        >
          {task.title}
        </p>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1"
          style={{ color: "var(--accent-red)", fontFamily: "var(--font-mono)" }}
          title="Delete task"
        >
          ×
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Priority badge — click to cycle */}
          <button
            onClick={() => onChangePriority(task.id, PRIORITY_CYCLE[task.priority])}
            title="Click to change priority"
            className="badge transition-all"
            style={{
              color: p.color,
              background: p.bg,
              cursor: "pointer",
              border: `1px solid ${p.color}44`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.75";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            ↕ {p.label}
          </button>
          {/* Tags */}
          {task.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="badge"
              style={{ color: "var(--text-muted)", background: "var(--bg-elevated)" }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Move buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {otherStatuses.map((col) => (
            <button
              key={col.id}
              onClick={() => onMove(task.id, col.id)}
              title={`Move to ${col.label}`}
              className="text-xs px-2 py-0.5 rounded transition-colors"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--bg-elevated)",
                color: col.color,
                border: `1px solid var(--border)`,
                fontSize: "0.6rem",
              }}
            >
              → {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Created at */}
      <div className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
        {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </div>
    </div>
  );
}

interface AddTaskFormProps {
  status: TaskStatus;
  onAdd: (task: Task) => void;
}

function AddTaskForm({ status, onAdd }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      id: uuidv4(),
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      completed: false,
    });
    setTitle(""); setDescription(""); setPriority("medium"); setTags("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-xs py-2 rounded-md transition-all duration-200 flex items-center justify-center gap-1.5"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--text-muted)",
          background: "transparent",
          border: "1px dashed var(--border)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "var(--accent-cyan)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan-glow)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        }}
      >
        <span>+</span> Add task
      </button>
    );
  }

  return (
    <div className="card p-3 space-y-2 animate-fade-in" style={{ border: "1px solid var(--accent-cyan-glow)" }}>
      <input
        autoFocus
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") setOpen(false); }}
        className="w-full text-sm bg-transparent outline-none"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
      />
      <input
        type="text"
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full text-xs bg-transparent outline-none"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)..."
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full text-xs bg-transparent outline-none"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
      />
      <div className="flex items-center gap-2 pt-1">
        {(["high", "medium", "low"] as TaskPriority[]).map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className="badge transition-all"
            style={{
              color: priority === p ? PRIORITY_STYLES[p].color : "var(--text-muted)",
              background: priority === p ? PRIORITY_STYLES[p].bg : "var(--bg-elevated)",
              border: priority === p ? `1px solid ${PRIORITY_STYLES[p].color}` : "1px solid transparent",
            }}
          >
            {p}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setOpen(false)}
            className="text-xs px-2 py-1 rounded"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-xs px-3 py-1 rounded"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--accent-cyan-dim)",
              color: "var(--accent-cyan)",
              border: "1px solid var(--accent-cyan-glow)",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function KanbanBoard({ tasks, setTasks }: Props) {
  const moveTask = async (id: string, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: newStatus, completed: newStatus === "done" } : t));
    await fetch(`/api/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus, completed: newStatus === "done" }) });
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  };

  const changePriority = async (id: string, priority: TaskPriority) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, priority } : t));
    await fetch(`/api/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ priority }) });
  };

  const addTask = async (task: Task) => {
    // Optimistic update
    setTasks((prev) => [task, ...prev]);
    const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(task) });
    if (res.ok) {
      const saved = await res.json();
      // Replace temp task with DB-assigned _id
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...saved, id: saved._id } : t));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Kanban Board
        </h2>
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
        >
          {tasks.length} tasks total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col gap-2"
            >
              {/* Column header */}
              <div
                className="flex items-center justify-between px-3 py-2 rounded-md"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: col.color, fontSize: "0.85rem" }}>{col.icon}</span>
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-mono)", color: col.color }}
                  >
                    {col.label}
                  </span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: "var(--bg-base)",
                    color: col.color,
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="flex flex-col gap-2 min-h-32 p-2 rounded-lg"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
              >
                {colTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onMove={moveTask}
                    onDelete={deleteTask}
                    onChangePriority={changePriority}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div
                    className="flex-1 flex items-center justify-center text-xs py-6"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                  >
                    — empty —
                  </div>
                )}
              </div>

              {/* Add task */}
              <AddTaskForm status={col.id} onAdd={addTask} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
