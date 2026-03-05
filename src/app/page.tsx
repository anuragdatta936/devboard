"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Task, Note } from "@/types/task";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import KanbanBoard from "@/components/KanbanBoard";
import NotesPanel from "@/components/NotesPanel";

export default function Home() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [notes, setNotes]         = useState<Note[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [tasksRes, notesRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/notes"),
      ]);
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.map((t: Task & { _id: string }) => ({ ...t, id: t._id ?? t.id })));
      }
      if (notesRes.ok) {
        const data = await notesRes.json();
        setNotes(data.map((n: Note & { _id: string }) => ({ ...n, id: n._id ?? n.id })));
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status, fetchData]);

  if (status === "loading" || (status === "authenticated" && loadingData)) {
    return (
      <div
        className="flex items-center justify-center min-h-screen text-xs"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", background: "var(--bg-base)" }}
      >
        <span className="cursor">Loading DevBoard</span>
      </div>
    );
  }

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} session={session} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {activeTab === "dashboard" && (
          <Dashboard tasks={tasks} notes={notes} setTasks={setTasks} setActiveTab={setActiveTab} />
        )}
        {activeTab === "kanban" && (
          <KanbanBoard tasks={tasks} setTasks={setTasks} />
        )}
        {activeTab === "notes" && (
          <NotesPanel notes={notes} setNotes={setNotes} />
        )}
      </main>
    </>
  );
}
