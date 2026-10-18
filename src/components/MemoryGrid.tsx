"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Film, MessageCircle, Snowflake } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import type { MemoryDTO } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

function MemoryCard({
  memory,
  onOpen,
}: {
  memory: MemoryDTO;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      className="frost-card group relative block w-full cursor-pointer overflow-hidden rounded-2xl text-left"
    >
      <div className="relative overflow-hidden rounded-2xl">
        {memory.type === "video" ? (
          <video
            ref={videoRef}
            src={memory.filePath}
            muted
            playsInline
            preload="metadata"
            className="w-full bg-black/50 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            onMouseEnter={() => videoRef.current?.play().catch(() => undefined)}
            onMouseLeave={() => {
              const v = videoRef.current;
              if (v) {
                v.pause();
                v.currentTime = 0;
              }
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={memory.filePath}
            alt={memory.caption || "Воспоминание"}
            loading="lazy"
            className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        )}

        <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-gold-300 backdrop-blur-sm">
          {memory.type === "video" ? <Film size={14} /> : <Camera size={14} />}
        </span>

        {memory.commentCount > 0 && (
          <span className="absolute right-3 top-3 flex h-8 items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 text-xs font-bold text-white backdrop-blur-sm">
            <MessageCircle size={12} className="text-gold-300" />
            {memory.commentCount}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-4 pb-3.5 pt-14">
          {memory.caption && (
            <p className="line-clamp-2 text-sm font-semibold text-white">{memory.caption}</p>
          )}
          <p className="mt-1 flex items-center gap-2 text-[0.7rem] text-slate-300/80">
            {memory.author && <span className="text-gold-300/90">{memory.author}</span>}
            {memory.author && <span aria-hidden>·</span>}
            <span>{formatDate(memory.createdAt)}</span>
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default function MemoryGrid({
  memories,
  emptyText = "Пока здесь пусто",
  subEmptyText = "Загрузите первое воспоминание — оно согреет весь архив",
  className,
}: {
  memories: MemoryDTO[];
  emptyText?: string;
  subEmptyText?: string;
  className?: string;
}) {
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(
    () => memories.filter((m) => !deletedIds.has(m.id)),
    [memories, deletedIds]
  );

  if (!items.length) {
    return (
      <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-300">
          <Snowflake size={24} style={{ animation: "spin-slow 16s linear infinite" }} />
        </span>
        <p className="font-display text-2xl font-semibold text-white">{emptyText}</p>
        <p className="max-w-sm text-sm text-slate-300/70">{subEmptyText}</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn("masonry columns-1 sm:columns-2 lg:columns-3", className)}>
        <AnimatePresence mode="popLayout">
          {items.map((m, i) => (
            <MemoryCard key={m.id} memory={m} onOpen={() => setLightbox(i)} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightbox !== null && items[lightbox] && (
          <Lightbox
            items={items}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onNavigate={(n) => setLightbox(n)}
            onDeleted={(id) => {
              const idx = items.findIndex((p) => p.id === id);
              setDeletedIds((prev) => new Set(prev).add(id));
              const remaining = items.length - 1;
              if (remaining <= 0) {
                setLightbox(null);
              } else {
                setLightbox(Math.min(idx, remaining - 1));
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
