"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  CloudUpload,
  FileImage,
  Film,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import type { AlbumDTO } from "@/lib/types";
import { cn, formatFileSize, plural } from "@/lib/utils";

interface LocalFile {
  key: string;
  file: File;
  preview: string;
  isVideo: boolean;
}

type Status = "idle" | "uploading" | "done" | "error";

export default function UploadModal({
  initialAlbumId,
  onClose,
}: {
  initialAlbumId: number | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [albums, setAlbums] = useState<AlbumDTO[]>([]);
  const [albumId, setAlbumId] = useState<string>(initialAlbumId ? String(initialAlbumId) : "");
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [resultCount, setResultCount] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/albums")
      .then((r) => r.json())
      .then((d) => setAlbums(d.items ?? []))
      .catch(() => undefined);
    const saved = window.localStorage.getItem("snegopad-author");
    if (saved) setAuthor(saved);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "uploading") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, status]);

  const addFiles = useCallback((list: FileList | File[]) => {
    const incoming = Array.from(list)
      .filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"))
      .slice(0, 30);
    setFiles((prev) => [
      ...prev,
      ...incoming.map((f) => ({
        key: `${f.name}-${f.size}-${Math.random().toString(36).slice(2)}`,
        file: f,
        preview: URL.createObjectURL(f),
        isVideo: f.type.startsWith("video/"),
      })),
    ]);
  }, []);

  const removeFile = (key: string) => {
    setFiles((prev) => {
      const target = prev.find((p) => p.key === key);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.key !== key);
    });
  };

  const submit = () => {
    if (!files.length || status === "uploading") return;
    setStatus("uploading");
    setProgress(0);
    setErrorMsg("");
    if (author.trim()) window.localStorage.setItem("snegopad-author", author.trim());

    const fd = new FormData();
    files.forEach((f) => fd.append("files", f.file));
    if (albumId) fd.append("albumId", albumId);
    if (author.trim()) fd.append("author", author.trim());
    if (caption.trim()) fd.append("caption", caption.trim());

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/memories");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300 && data.ok) {
          setResultCount(data.count ?? files.length);
          setStatus("done");
          router.refresh();
          setTimeout(() => onClose(), 1300);
        } else {
          setErrorMsg(data.error || "Что-то пошло не так");
          setStatus("error");
        }
      } catch {
        setErrorMsg("Что-то пошло не так");
        setStatus("error");
      }
    };
    xhr.onerror = () => {
      setErrorMsg("Сеть недоступна. Попробуйте ещё раз.");
      setStatus("error");
    };
    xhr.send(fd);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-[#03060f]/80 backdrop-blur-md"
        onClick={() => status !== "uploading" && onClose()}
      />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-[#b97f22] text-[#231803] shadow-[0_8px_24px_-8px_rgba(245,201,107,0.7)]">
              <Sparkles size={18} strokeWidth={2.4} />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Новое воспоминание
              </h3>
              <p className="text-xs text-slate-300/70">Фото и видео сохранятся в нашем архиве</p>
            </div>
          </div>
          <button
            onClick={() => status !== "uploading" && onClose()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-gold-400/50 hover:text-white"
            aria-label="Закрыть"
          >
            <X size={17} />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {status === "done" ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-[#b97f22] text-[#231803]"
                style={{ animation: "pulse-glow 1.6s ease-in-out infinite" }}
              >
                <Check size={30} strokeWidth={3} />
              </span>
              <p className="font-display text-2xl font-bold text-white">Готово!</p>
              <p className="text-sm text-slate-300/80">
                {resultCount}{" "}
                {plural(resultCount, "воспоминание сохранено", "воспоминания сохранено", "воспоминаний сохранено")}
              </p>
            </div>
          ) : (
            <>
              {/* dropzone */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  addFiles(e.dataTransfer.files);
                }}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300",
                  dragOver
                    ? "border-gold-400/80 bg-gold-400/10"
                    : "border-white/15 bg-white/[0.03] hover:border-gold-400/40 hover:bg-white/[0.05]"
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-gold-300">
                  <CloudUpload size={22} />
                </span>
                <p className="text-sm font-semibold text-white">
                  Перетащите сюда фото или видео
                </p>
                <p className="text-xs text-slate-300/60">
                  или нажмите, чтобы выбрать файлы — до 30 за раз
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* previews */}
              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {files.map((f) => (
                    <div
                      key={f.key}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40"
                    >
                      {f.isVideo ? (
                        <video src={f.preview} muted className="h-full w-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.preview} alt="" className="h-full w-full object-cover" />
                      )}
                      <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-gold-300">
                        {f.isVideo ? <Film size={12} /> : <FileImage size={12} />}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(f.key);
                        }}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500/80"
                        aria-label="Убрать"
                      >
                        <X size={12} />
                      </button>
                      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-4 text-[0.6rem] text-slate-200/90">
                        {formatFileSize(f.file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-300/70">
                    Кто добавляет
                  </span>
                  <input
                    className="field"
                    placeholder="Ваше имя"
                    value={author}
                    maxLength={60}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-300/70">
                    Альбом
                  </span>
                  <select
                    className="field"
                    value={albumId}
                    onChange={(e) => setAlbumId(e.target.value)}
                  >
                    <option value="">Без альбома</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-300/70">
                  Подпись (необязательно)
                </span>
                <input
                  className="field"
                  placeholder="Пара тёплых слов о моменте…"
                  value={caption}
                  maxLength={300}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </label>

              {status === "uploading" && (
                <div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-[#df9f35] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-slate-300/70">
                    Загружаем… {progress}%
                  </p>
                </div>
              )}
              {status === "error" && (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
                  {errorMsg}
                </p>
              )}
            </>
          )}
        </div>

        {/* footer */}
        {status !== "done" && (
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4">
            <span className="text-xs text-slate-300/60">
              {files.length > 0
                ? `${files.length} ${plural(files.length, "файл", "файла", "файлов")} выбрано`
                : "Поддерживаются фото и видео"}
            </span>
            <button
              onClick={submit}
              disabled={!files.length || status === "uploading"}
              className="btn-gold text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "uploading" ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <CloudUpload size={17} />
              )}
              {status === "uploading" ? "Загрузка…" : "Сохранить в архив"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
