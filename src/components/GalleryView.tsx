"use client";

import { useMemo, useState } from "react";
import { Camera, Film, LayoutGrid } from "lucide-react";
import MemoryGrid from "@/components/MemoryGrid";
import type { AlbumDTO, MemoryDTO, MemoryType } from "@/lib/types";
import { plural } from "@/lib/utils";

type Filter = "all" | MemoryType;

export default function GalleryView({
  memories,
  albums,
}: {
  memories: MemoryDTO[];
  albums: AlbumDTO[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [albumId, setAlbumId] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      memories.filter(
        (m) =>
          (filter === "all" || m.type === filter) &&
          (albumId === null || m.albumId === albumId)
      ),
    [memories, filter, albumId]
  );

  const usedAlbums = useMemo(
    () => albums.filter((a) => a.count > 0),
    [albums]
  );

  return (
    <div className="space-y-8">
      {/* filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button className="chip" data-active={filter === "all"} onClick={() => setFilter("all")}>
          <LayoutGrid size={14} />
          Все
        </button>
        <button
          className="chip"
          data-active={filter === "photo"}
          onClick={() => setFilter("photo")}
        >
          <Camera size={14} />
          Фото
        </button>
        <button
          className="chip"
          data-active={filter === "video"}
          onClick={() => setFilter("video")}
        >
          <Film size={14} />
          Видео
        </button>

        {usedAlbums.length > 0 && (
          <>
            <span className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />
            <button
              className="chip"
              data-active={albumId === null}
              onClick={() => setAlbumId(null)}
            >
              Все альбомы
            </button>
            {usedAlbums.map((a) => (
              <button
                key={a.id}
                className="chip"
                data-active={albumId === a.id}
                onClick={() => setAlbumId(a.id)}
              >
                {a.title}
              </button>
            ))}
          </>
        )}
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400/60">
        {filtered.length}{" "}
        {plural(filtered.length, "воспоминание", "воспоминания", "воспоминаний")}
      </p>

      <MemoryGrid key={`${filter}-${albumId ?? "all"}`} memories={filtered} />
    </div>
  );
}
