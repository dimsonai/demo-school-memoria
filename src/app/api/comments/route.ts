import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments, memories } from "@/db/schema";
import { getCommentsForMemory } from "@/lib/data";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const memoryId = Number(req.nextUrl.searchParams.get("memoryId"));
  if (!Number.isFinite(memoryId) || memoryId <= 0) {
    return NextResponse.json({ error: "Нужен memoryId" }, { status: 400 });
  }
  const items = await getCommentsForMemory(memoryId);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { memoryId?: number; author?: string; text?: string }
      | null;
    const memoryId = Number(body?.memoryId);
    const author = (body?.author ?? "").trim().slice(0, 60);
    const text = (body?.text ?? "").trim().slice(0, 500);

    if (!Number.isFinite(memoryId) || memoryId <= 0) {
      return NextResponse.json({ error: "Некорректное воспоминание" }, { status: 400 });
    }
    if (!author || !text) {
      return NextResponse.json(
        { error: "Укажите имя и текст комментария" },
        { status: 400 }
      );
    }

    const [memory] = await db
      .select({ id: memories.id })
      .from(memories)
      .where(eq(memories.id, memoryId));
    if (!memory) {
      return NextResponse.json({ error: "Воспоминание не найдено" }, { status: 404 });
    }

    const [row] = await db
      .insert(comments)
      .values({ memoryId, author, text })
      .returning();
    return NextResponse.json({ ok: true, item: row });
  } catch (e) {
    console.error("Create comment failed:", e);
    return NextResponse.json({ error: "Не удалось сохранить комментарий" }, { status: 500 });
  }
}
