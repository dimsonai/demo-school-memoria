"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Film,
  Loader2,
  MessageCircle,
  Trash2,
  User,
  X,
} from "lucide-react";
import CommentsPanel from "@/components/CommentsPanel";
import type { MemoryDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
  onDeleted,
}: {
  items: MemoryDTO[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();
  const item = items[index];
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const prev = useCallback(() => {
    if (items.length < 2) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const next = useCallback(() => {
    if (items.length < 2) return;
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    setConfirming(false);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (!item) return null;

  const doDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/memories/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted(item.id);
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[#02040c]/92 backdrop-blur-xl" onClick={onClose} />

      {/* top bar */}
      <div className="relative z-10 flex shrink-0 items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300/70">
          {item.type === "photo" ? <Camera size={14} /> : <Film size={14} />}
          {index + 1} / {items.length}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`${item.filePath}?download=1&name=${encodeURIComponent(item.fileName || "memory")}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-200 transition hover:border-gold-400/60 hover:text-gold-300"
            aria-label="Скачать"
            title="Скачать"
          >
            <Download size={17} />
          </a>
          {confirming ? (
            <button
              onClick={doDelete}
              disabled={deleting}
              className="flex h-10 items-center gap-2 rounded-full border border-red-400/60 bg-red-500/20 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/35"
            >
              {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              Точно удалить?
            </button>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-200 transition hover:border-red-400/60 hover:text-red-300"
              aria-label="Удалить"
              title="Удалить"
            >
              <Trash2 size={17} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-200 transition hover:border-gold-400/60 hover:text-gold-300"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
        <div className="flex min-h-full min-h-0 flex-1 flex-col lg:flex-row">
          {/* media column */}
          <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
            <div className="relative flex min-h-[42svh] flex-1 items-center justify-center px-4 sm:px-14 lg:min-h-0">
              {items.length > 1 && (
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:border-gold-400/60 hover:text-gold-300 sm:left-6"
                  aria-label="Назад"
                >
                  <ChevronLeft size={22} />
                </button>
              )}
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex max-h-full items-center justify-center"
              >
                {item.type === "video" ? (
                  <video
                    src={item.filePath}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[46svh] max-w-full rounded-xl border border-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] lg:max-h-[66vh]"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.filePath}
                    alt={item.caption || "Воспоминание"}
                    className="max-h-[46svh] max-w-full rounded-xl border border-white/10 object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] lg:max-h-[66vh]"
                  />
                )}
              </motion.div>
              {items.length > 1 && (
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:border-gold-400/60 hover:text-gold-300 sm:right-6"
                  aria-label="Вперёд"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* caption */}
            <div className="shrink-0 px-4 pb-5 pt-3 text-center sm:px-8">
              {item.caption && (
                <p className="font-display mx-auto max-w-2xl text-lg font-semibold text-white sm:text-xl">
                  {item.caption}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-300/70">
                {item.author && (
                  <span className="inline-flex items-center gap-1.5">
                    <User size={12} className="text-gold-400" /> {item.author}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} className="text-gold-400" /> {formatDate(item.createdAt)}
                </span>
                {item.commentCount > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle size={12} className="text-gold-400" /> {item.commentCount}
                  </span>
                )}
                {item.albumTitle && (
                  <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-0.5 text-gold-300">
                    {item.albumTitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* comments column */}
          <CommentsPanel
            key={item.id}
            memoryId={item.id}
            className="h-[52svh] shrink-0 lg:h-auto"
          />
        </div>
      </div>
    </motion.div>
  );
}
