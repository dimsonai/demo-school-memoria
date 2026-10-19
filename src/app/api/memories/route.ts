import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { memories } from "@/db/schema";
import { getMemories } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v", ".ogv"]);
// Лимит 4.5 МБ для надежной работы на бесплатном Netlify
const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const MAX_FILES = 10;

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

    const saved = [];
    const skipped: string[] = [];

    for (const file of files.slice(0, MAX_FILES)) {
      const mime = file.type || "";
      const origExt = path.extname(file.name || "").toLowerCase();
      let isVideo = mime.startsWith("video/");
      let isImage = mime.startsWith("image/");
      if (!isVideo && !isImage) {
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

      // Сохраняем файл прямо в базу Neon как Data URL
      let mimeType = mime;
      if (!mimeType || mimeType === "application/octet-stream") {
        if (isVideo) {
          mimeType = origExt === ".webm" ? "video/webm" : "video/mp4";
        } else {
          if (origExt === ".png") mimeType = "image/png";
          else if (origExt === ".webp") mimeType = "image/webp";
          else if (origExt === ".gif") mimeType = "image/gif";
          else mimeType = "image/jpeg";
        }
      }
      const base64 = buf.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;

      const [row] = await db
        .insert(memories)
        .values({
          type: isVideo ? "video" : "photo",
          filePath: dataUrl,
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
