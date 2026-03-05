import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: "Title is required." }, { status: 400 });

  const task = await prisma.task.create({
    data: {
      userId:      session.user.id,
      title:       body.title.trim(),
      description: body.description?.trim() ?? null,
      status:      body.status    ?? "todo",
      priority:    body.priority  ?? "medium",
      tags:        body.tags      ?? [],
      completed:   body.completed ?? false,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
