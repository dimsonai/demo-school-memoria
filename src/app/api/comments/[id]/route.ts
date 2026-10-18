import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) {
    return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
  }
  const [row] = await db.select().from(comments).where(eq(comments.id, num));
  if (!row) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }
  await db.delete(comments).where(eq(comments.id, num));
  return NextResponse.json({ ok: true });
}
