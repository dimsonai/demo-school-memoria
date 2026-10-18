import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { memories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) {
    return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
  }

  const [row] = await db.select().from(memories).where(eq(memories.id, num));
  if (!row) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  await db.delete(memories).where(eq(memories.id, num));

  const fname = path.basename(row.filePath);
  await unlink(path.join(UPLOAD_DIR, fname)).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
