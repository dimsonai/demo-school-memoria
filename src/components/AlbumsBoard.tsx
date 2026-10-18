"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FolderOpen, Layers, Loader2, Plus, Trash2, X } from "lucide-react";
import type { AlbumDTO } from "@/lib/types";
import { formatDate, plural } from "@/lib/utils";

function AlbumCard({ album, onDelete }: { album: AlbumDTO; onDelete: (id: number) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const doDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const res = await fetch(`/api/albums/${album.id}`, { method: "DELETE" }).catch(() => null);
    setBusy(false);
    if (res?.ok) onDelete(album.id);
    else setConfirming(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/albums/${album.id}`}
        className="frost-card group relative block overflow-hidden rounded-3xl"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {album.coverPath ? (
            album.coverType === "video" ? (
              <video
                src={album.coverPath}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={album.coverPath}
                alt={album.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-night-800 to-night-900">
              <FolderOpen size={44} className="text-gold-400/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03060f]/95 via-[#03060f]/25 to-transparent" />

          {/* delete */}
          <div className="absolute right-3 top-3 z-10">
            {confirming ? (
              <button
                onClick={doDelete}
                disabled={busy}
                className="flex items-center gap-2 rounded-full border border-red-400/60 bg-red-500/25 px-3.5 py-2 text-xs font-bold text-red-100 backdrop-blur transition hover:bg-red-500/45"
              >
                {busy ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Удалить альбом?
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirming(true);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-slate-200 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:border-red-400/60 hover:text-red-300"
                aria-label="Удалить альбом"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold-400/90">
              <Layers size={12} />
              {album.count}{" "}
              {plural(album.count, "воспоминание", "воспоминания", "воспоминаний")}
            </p>
            <h3 className="font-display mt-1.5 text-2xl font-bold text-white transition-colors group-hover:text-gold-300">
              {album.title}
            </h3>
            {album.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-300/80">{album.description}</p>
            )}
            <p className="mt-2 text-[0.7rem] text-slate-400/60">
              Создан {formatDate(album.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AlbumsBoard({ albums: initial }: { albums: AlbumDTO[] }) {
  const router = useRouter();
  const [albums, setAlbums] = useState(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    if (!title.trim() || busy) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      const data = await res.json();
      setAlbums((prev) => [
        {
          id: data.item.id,
          title: data.item.title,
          description: data.item.description,
          createdAt: new Date().toISOString(),
          count: 0,
          coverPath: null,
          coverType: null,
        },
        ...prev,
      ]);
      setModalOpen(false);
      setTitle("");
      setDescription("");
      router.refresh();
    } else {
      const data = await res?.json().catch(() => null);
      setError(data?.error || "Не удалось создать альбом");
    }
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* create tile */}
        <motion.button
          layout
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setModalOpen(true)}
          className="group flex aspect-[4/3] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-white/15 bg-white/[0.02] transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/5"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-[#b97f22] text-[#231803] shadow-[0_12px_30px_-10px_rgba(245,201,107,0.7)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-90">
            <Plus size={24} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold text-white">Новый альбом</span>
          <span className="text-sm text-slate-300/60">
            Соберите моменты по событиям
          </span>
        </motion.button>

        {albums.map((a) => (
          <AlbumCard
            key={a.id}
            album={a}
            onDelete={(id) => {
              setAlbums((prev) => prev.filter((p) => p.id !== id));
              router.refresh();
            }}
          />
        ))}
      </div>

      {/* create modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#03060f]/80 backdrop-blur-md"
            onClick={() => !busy && setModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative z-10 w-full max-w-md rounded-3xl p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">Новый альбом</h3>
              <button
                onClick={() => !busy && setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-gold-400/50 hover:text-white"
                aria-label="Закрыть"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                className="field"
                placeholder="Название — например, «Новогодняя ночь»"
                value={title}
                maxLength={90}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
              />
              <textarea
                className="field min-h-[88px] resize-none"
                placeholder="Короткое описание (необязательно)"
                value={description}
                maxLength={300}
                onChange={(e) => setDescription(e.target.value)}
              />
              {error && <p className="text-sm text-red-300">{error}</p>}
              <button
                onClick={create}
                disabled={!title.trim() || busy}
                className="btn-gold w-full justify-center text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Создать альбом
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
