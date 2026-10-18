import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { albums } from "@/db/schema";
import { getAlbumsWithStats } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getAlbumsWithStats();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { title?: string; description?: string }
      | null;
    const title = (body?.title ?? "").trim().slice(0, 90);
    const description = (body?.description ?? "").trim().slice(0, 300) || null;
    if (!title) {
      return NextResponse.json({ error: "Нужно название альбома" }, { status: 400 });
    }
    const [row] = await db.insert(albums).values({ title, description }).returning();
    return NextResponse.json({ ok: true, item: row });
  } catch (e) {
    console.error("Create album failed:", e);
    return NextResponse.json({ error: "Не удалось создать альбом" }, { status: 500 });
  }
}
