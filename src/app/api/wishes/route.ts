import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { getWishes } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getWishes(100);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { author?: string; text?: string }
      | null;
    const author = (body?.author ?? "").trim().slice(0, 60);
    const text = (body?.text ?? "").trim().slice(0, 600);
    if (!author || !text) {
      return NextResponse.json(
        { error: "Укажите имя и текст пожелания" },
        { status: 400 }
      );
    }
    const [row] = await db.insert(wishes).values({ author, text }).returning();
    return NextResponse.json({ ok: true, item: row });
  } catch (e) {
    console.error("Create wish failed:", e);
    return NextResponse.json({ error: "Не удалось сохранить пожелание" }, { status: 500 });
  }
}
