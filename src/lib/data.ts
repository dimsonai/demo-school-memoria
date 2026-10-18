import { db } from "@/db";
import { albums, comments, memories, wishes, type Memory } from "@/db/schema";
import type { AlbumDTO, CommentDTO, MemoryDTO, StatsDTO, WishDTO } from "@/lib/types";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const d = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function mapMemory(m: Memory, albumTitle: string | null, commentCount = 0): MemoryDTO {
  return {
    id: m.id,
    type: m.type,
    filePath: m.filePath,
    fileName: m.fileName,
    size: m.size,
    caption: m.caption,
    author: m.author,
    albumId: m.albumId,
    albumTitle,
    takenAt: toIso(m.takenAt),
    createdAt: toIso(m.createdAt) ?? new Date().toISOString(),
    commentCount,
  };
}

export async function getMemories(opts?: {
  albumId?: number;
  type?: "photo" | "video";
  limit?: number;
}): Promise<MemoryDTO[]> {
  const conditions = [];
  if (opts?.albumId) conditions.push(eq(memories.albumId, opts.albumId));
  if (opts?.type) conditions.push(eq(memories.type, opts.type));

  const base = db
    .select({
      memory: memories,
      albumTitle: albums.title,
      commentCount: sql<number>`(select count(*)::int from ${comments} where ${comments.memoryId} = ${memories.id})`,
    })
    .from(memories)
    .leftJoin(albums, eq(memories.albumId, albums.id))
    .orderBy(desc(memories.createdAt));

  const rows = await (conditions.length
    ? base.where(and(...conditions))
    : base
  ).limit(opts?.limit ?? 500);

  return rows.map((r) => mapMemory(r.memory, r.albumTitle, r.commentCount));
}

export async function getCommentsForMemory(memoryId: number): Promise<CommentDTO[]> {
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.memoryId, memoryId))
    .orderBy(asc(comments.createdAt))
    .limit(200);
  return rows.map((c) => ({
    id: c.id,
    memoryId: c.memoryId,
    author: c.author,
    text: c.text,
    createdAt: toIso(c.createdAt) ?? new Date().toISOString(),
  }));
}

export async function getLatestMemories(limit = 10): Promise<MemoryDTO[]> {
  return getMemories({ limit });
}

export async function getAlbumsWithStats(): Promise<AlbumDTO[]> {
  const rows = await db
    .select({
      id: albums.id,
      title: albums.title,
      description: albums.description,
      createdAt: albums.createdAt,
      count: count(memories.id),
      coverPath: sql<string | null>`(array_agg(${memories.filePath} ORDER BY ${memories.createdAt} DESC NULLS LAST))[1]`,
      coverType: sql<"photo" | "video" | null>`(array_agg(${memories.type} ORDER BY ${memories.createdAt} DESC NULLS LAST))[1]`,
    })
    .from(albums)
    .leftJoin(memories, eq(memories.albumId, albums.id))
    .groupBy(albums.id)
    .orderBy(desc(albums.createdAt));

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    createdAt: toIso(r.createdAt) ?? new Date().toISOString(),
    count: r.count,
    coverPath: r.coverPath,
    coverType: r.coverType,
  }));
}

export async function getAlbumById(id: number): Promise<AlbumDTO | null> {
  const all = await getAlbumsWithStats();
  return all.find((a) => a.id === id) ?? null;
}

export async function getWishes(limit = 100): Promise<WishDTO[]> {
  const rows = await db.select().from(wishes).orderBy(desc(wishes.createdAt)).limit(limit);
  return rows.map((w) => ({
    id: w.id,
    author: w.author,
    text: w.text,
    createdAt: toIso(w.createdAt) ?? new Date().toISOString(),
  }));
}

export async function getStats(): Promise<StatsDTO> {
  const [photoRow] = await db
    .select({ value: count() })
    .from(memories)
    .where(eq(memories.type, "photo"));
  const [videoRow] = await db
    .select({ value: count() })
    .from(memories)
    .where(eq(memories.type, "video"));
  const [albumRow] = await db.select({ value: count() }).from(albums);
  const [wishRow] = await db.select({ value: count() }).from(wishes);
  return {
    photos: photoRow?.value ?? 0,
    videos: videoRow?.value ?? 0,
    albums: albumRow?.value ?? 0,
    wishes: wishRow?.value ?? 0,
  };
}
