"use client";

import { Task, Note } from "@/types/task";
import { useMemo } from "react";

interface Props {
  tasks: Task[];
  notes: Note[];
}

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  icon: string;
}) {
  return (
    <div
      className="card p-4 flex flex-col gap-2 animate-fade-in"
      style={{ borderLeft: `2px solid ${accent}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {label}
        </span>
        <span className="text-base">{icon}</span>
      </div>
      <div
        className="text-3xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: accent }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function MiniBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
        <span>{label}</span>
        <span style={{ color }}>{count}</span>
      </div>
      <div className="h-1 rounded-full" style={{ background: "var(--border)" }}>
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function StatsWidgets({ tasks, notes }: Props) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const high = tasks.filter((t) => t.priority === "high").length;
    const medium = tasks.filter((t) => t.priority === "medium").length;
    const low = tasks.filter((t) => t.priority === "low").length;
    const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, inProgress, todo, high, medium, low, completionRate };
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          sub={`${stats.done} completed`}
          accent="var(--accent-cyan)"
          icon="◈"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          sub="active now"
          accent="var(--accent-amber)"
          icon="◎"
        />
        <StatCard
          label="Completion"
          value={`${stats.completionRate}%`}
          sub={`${stats.done} / ${stats.total} done`}
          accent="var(--accent-green)"
          icon="✓"
        />
        <StatCard
          label="Notes"
          value={notes.length}
          sub={`${notes.filter((n) => n.isCode).length} code snippets`}
          accent="var(--accent-purple)"
          icon="⌘"
        />
      </div>

      {/* Progress breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Status breakdown */}
        <div className="card p-4 space-y-3">
          <h3
            className="text-xs uppercase tracking-widest font-semibold mb-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          >
            // Status Breakdown
          </h3>
          <MiniBar label="Todo" count={stats.todo} total={stats.total} color="var(--accent-cyan)" />
          <MiniBar label="In Progress" count={stats.inProgress} total={stats.total} color="var(--accent-amber)" />
          <MiniBar label="Done" count={stats.done} total={stats.total} color="var(--accent-green)" />
        </div>

        {/* Priority breakdown */}
        <div className="card p-4 space-y-3">
          <h3
            className="text-xs uppercase tracking-widest font-semibold mb-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          >
            // Priority Breakdown
          </h3>
          <MiniBar label="High" count={stats.high} total={stats.total} color="var(--accent-red)" />
          <MiniBar label="Medium" count={stats.medium} total={stats.total} color="var(--accent-amber)" />
          <MiniBar label="Low" count={stats.low} total={stats.total} color="var(--accent-green)" />
        </div>
      </div>

      {/* Completion ring */}
      <div className="card p-4">
        <h3
          className="text-xs uppercase tracking-widest font-semibold mb-4"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
        >
          // Overall Progress
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - stats.completionRate / 100)}`}
                transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center text-sm font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--accent-cyan)" }}
            >
              {stats.completionRate}%
            </div>
          </div>
          <div className="space-y-2 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-cyan)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Todo — <span style={{ color: "var(--accent-cyan)" }}>{stats.todo}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-amber)" }} />
              <span style={{ color: "var(--text-secondary)" }}>In Progress — <span style={{ color: "var(--accent-amber)" }}>{stats.inProgress}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-green)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Done — <span style={{ color: "var(--accent-green)" }}>{stats.done}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
