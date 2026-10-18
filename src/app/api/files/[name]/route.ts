import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/mp4",
  ".ogv": "video/ogg",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const safeName = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safeName) {
    return new NextResponse("Not found", { status: 404 });
  }

  const resolved = path.join(UPLOAD_DIR, safeName);
  const st = await stat(resolved).catch(() => null);
  if (!st || !st.isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  if (req.nextUrl.searchParams.get("download") === "1") {
    const rawName =
      (req.nextUrl.searchParams.get("name") || safeName)
        .replace(/[^\p{L}\p{N} ._()\-]/gu, "")
        .slice(0, 160) || "memory";
    headers["Content-Disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(
      rawName
    )}`;
  }

  const range = req.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = 0;
    let end = st.size - 1;
    if (m) {
      if (m[1]) {
        start = parseInt(m[1], 10);
        end = m[2] ? Math.min(parseInt(m[2], 10), st.size - 1) : st.size - 1;
      } else if (m[2]) {
        start = Math.max(0, st.size - parseInt(m[2], 10));
        end = st.size - 1;
      }
    }
    if (start >= st.size || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${st.size}` },
      });
    }
    const stream = Readable.toWeb(
      createReadStream(resolved, { start, end })
    ) as unknown as ReadableStream;
    return new NextResponse(stream, {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${st.size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  const stream = Readable.toWeb(createReadStream(resolved)) as unknown as ReadableStream;
  return new NextResponse(stream, {
    status: 200,
    headers: { ...headers, "Content-Length": String(st.size) },
  });
}
