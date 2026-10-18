import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { memories } from "@/db/schema";
import { getMemories } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v", ".ogv"]);
const MAX_FILE_SIZE = 600 * 1024 * 1024; // 600 MB
const MAX_FILES = 30;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const typeParam = sp.get("type");
  const type = typeParam === "photo" || typeParam === "video" ? typeParam : undefined;
  const albumIdRaw = sp.get("albumId");
  const albumId = albumIdRaw ? Number(albumIdRaw) : undefined;
  const limitRaw = sp.get("limit");
  const limit = limitRaw ? Math.min(Number(limitRaw) || 0, 500) : undefined;
  const items = await getMemories({
    type,
    albumId: albumId && !Number.isNaN(albumId) ? albumId : undefined,
    limit,
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form
      .getAll("files")
      .filter((v): v is File => typeof v === "object" && v !== null && "arrayBuffer" in v);

    if (!files.length) {
      return NextResponse.json({ error: "Файлы не найдены" }, { status: 400 });
    }

    const author = String(form.get("author") ?? "").trim().slice(0, 60) || null;
    const caption = String(form.get("caption") ?? "").trim().slice(0, 300) || null;
    const albumIdRaw = form.get("albumId");
    const albumIdNum = albumIdRaw ? Number(albumIdRaw) : NaN;
    const albumId = Number.isFinite(albumIdNum) && albumIdNum > 0 ? albumIdNum : null;

    await mkdir(UPLOAD_DIR, { recursive: true });

    const saved = [];
    const skipped: string[] = [];

    for (const file of files.slice(0, MAX_FILES)) {
      const mime = file.type || "";
      const origExt = path.extname(file.name || "").toLowerCase();
      let isVideo = mime.startsWith("video/");
      let isImage = mime.startsWith("image/");
      if (!isVideo && !isImage) {
        // some clients send octet-stream — fall back to the extension
        if (VIDEO_EXT.has(origExt)) isVideo = true;
        else if (IMAGE_EXT.has(origExt)) isImage = true;
      }
      if (!isVideo && !isImage) {
        skipped.push(file.name);
        continue;
      }
      const buf = Buffer.from(await file.arrayBuffer());
      if (buf.length === 0 || buf.length > MAX_FILE_SIZE) {
        skipped.push(file.name);
        continue;
      }

      const allowed = isVideo ? VIDEO_EXT : IMAGE_EXT;
      const ext = allowed.has(origExt) ? origExt : isVideo ? ".mp4" : ".jpg";
      const filename = `${Date.now().toString(36)}-${crypto.randomUUID()}${ext}`;
      await writeFile(path.join(UPLOAD_DIR, filename), buf);

      const [row] = await db
        .insert(memories)
        .values({
          type: isVideo ? "video" : "photo",
          filePath: `/api/files/${filename}`,
          fileName: (file.name || "").slice(0, 180) || null,
          size: buf.length,
          author,
          caption,
          albumId,
        })
        .returning();
      saved.push(row);
    }

    return NextResponse.json({ ok: true, count: saved.length, skipped, items: saved });
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Не удалось загрузить файлы" }, { status: 500 });
  }
}
