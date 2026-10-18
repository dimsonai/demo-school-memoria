"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, Send, Snowflake, Trash2 } from "lucide-react";
import type { CommentDTO } from "@/lib/types";
import { cn, formatDate, plural } from "@/lib/utils";

export default function CommentsPanel({
  memoryId,
  className,
}: {
  memoryId: number;
  className?: string;
}) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("snegopad-author");
    if (saved) setAuthor(saved);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setConfirmId(null);
    fetch(`/api/comments?memoryId=${memoryId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setComments(d.items ?? []);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [memoryId]);

  const submit = useCallback(async () => {
    if (!author.trim() || !text.trim() || busy) return;
    setBusy(true);
    setError("");
    window.localStorage.setItem("snegopad-author", author.trim());
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memoryId, author: author.trim(), text: text.trim() }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      const data = await res.json();
      setComments((prev) => [
        ...prev,
        {
          id: data.item.id,
          memoryId,
          author: data.item.author,
          text: data.item.text,
          createdAt: new Date().toISOString(),
        },
      ]);
      setText("");
      router.refresh();
    } else {
      const data = await res?.json().catch(() => null);
      setError(data?.error || "Не удалось отправить");
    }
  }, [author, text, busy, memoryId, router]);

  const doDelete = async (id: number) => {
    if (deletingId !== null) return;
    setDeletingId(id);
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" }).catch(() => null);
    setDeletingId(null);
    setConfirmId(null);
    if (res?.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
  };

  return (
    <aside
      className={cn(
        "flex min-h-0 w-full flex-col border-t border-white/10 bg-white/[0.02] lg:h-full lg:w-[360px] lg:shrink-0 lg:border-l lg:border-t-0",
        className
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-400/30 bg-gold-400/10 text-gold-300">
          <MessageCircle size={15} />
        </span>
        <h4 className="text-sm font-bold text-white">Комментарии</h4>
        <span className="ml-auto text-xs text-slate-400/60">
          {comments.length}{" "}
          {plural(comments.length, "запись", "записи", "записей")}
        </span>
      </div>

      {/* list */}
      <div className="min-h-[120px] flex-1 space-y-3 overflow-y-auto px-5 py-4 lg:max-h-none">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Snowflake
              size={22}
              className="text-gold-400/60"
              style={{ animation: "spin-slow 14s linear infinite" }}
            />
            <p className="text-sm text-slate-300/70">
              Пока тихо, как в зимнем лесу.
              <br />
              Оставьте первый комментарий!
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-[#b97f22] text-xs font-extrabold uppercase text-[#231803]">
                    {c.author.trim().charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[0.8rem] font-bold text-white">{c.author}</p>
                    <p className="text-[0.65rem] text-slate-400/60">{formatDate(c.createdAt)}</p>
                  </div>
                  <div className="ml-auto shrink-0">
                    {confirmId === c.id ? (
                      <button
                        onClick={() => doDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="flex items-center gap-1 rounded-full border border-red-400/60 bg-red-500/20 px-2.5 py-1 text-[0.65rem] font-bold text-red-200 transition hover:bg-red-500/40"
                      >
                        {deletingId === c.id ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Trash2 size={10} />
                        )}
                        Удалить?
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmId(c.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400/50 opacity-0 transition group-hover:opacity-100 hover:bg-white/5 hover:text-red-300"
                        aria-label="Удалить комментарий"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[0.85rem] leading-relaxed text-slate-100/90">
                  {c.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* form */}
      <div className="border-t border-white/10 p-4">
        <div className="space-y-2.5">
          <input
            className="field !py-2.5 text-sm"
            placeholder="Ваше имя"
            value={author}
            maxLength={60}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <div className="flex items-end gap-2">
            <textarea
              className="field max-h-28 min-h-[52px] flex-1 resize-none !py-2.5 text-sm"
              placeholder="Тёплый комментарий…"
              value={text}
              maxLength={500}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
              }}
            />
            <button
              onClick={submit}
              disabled={!author.trim() || !text.trim() || busy}
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-[#b97f22] text-[#231803] shadow-[0_10px_24px_-8px_rgba(245,201,107,0.6)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Отправить комментарий"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          {error && <p className="text-xs text-red-300">{error}</p>}
        </div>
      </div>
    </aside>
  );
}
