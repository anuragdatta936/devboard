import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const task = await prisma.task.updateMany({
    where: { id, userId: session.user.id },
    data:  body,
  });

  if (task.count === 0) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  const updated = await prisma.task.findUnique({ where: { id } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const task = await prisma.task.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (task.count === 0) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  return NextResponse.json({ message: "Deleted." });
}
