"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Loader2, Send, Snowflake, Trash2 } from "lucide-react";
import WishCard from "@/components/WishCard";
import type { WishDTO } from "@/lib/types";
import { plural } from "@/lib/utils";

export default function WishesView({ wishes: initial }: { wishes: WishDTO[] }) {
  const [wishes, setWishes] = useState(initial);
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

  const submit = async () => {
    if (!author.trim() || !text.trim() || busy) return;
    setBusy(true);
    setError("");
    window.localStorage.setItem("snegopad-author", author.trim());
    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: author.trim(), text: text.trim() }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      const data = await res.json();
      setWishes((prev) => [
        {
          id: data.item.id,
          author: data.item.author,
          text: data.item.text,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setText("");
    } else {
      const data = await res?.json().catch(() => null);
      setError(data?.error || "Не удалось сохранить пожелание");
    }
  };

  const doDelete = async (id: number) => {
    if (deletingId !== null) return;
    setDeletingId(id);
    const res = await fetch(`/api/wishes/${id}`, { method: "DELETE" }).catch(() => null);
    setDeletingId(null);
    setConfirmId(null);
    if (res?.ok) setWishes((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      {/* form */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="frost-card rounded-3xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-[#b97f22] text-[#231803] shadow-[0_10px_26px_-8px_rgba(245,201,107,0.7)]">
              <Gift size={19} />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Оставить пожелание</h3>
              <p className="text-xs text-slate-300/70">Напутствие друзьям на новый год</p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              className="field"
              placeholder="Ваше имя"
              value={author}
              maxLength={60}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <textarea
              className="field min-h-[130px] resize-none"
              placeholder="Пусть в новом году..."
              value={text}
              maxLength={600}
              onChange={(e) => setText(e.target.value)}
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button
              onClick={submit}
              disabled={!author.trim() || !text.trim() || busy}
              className="btn-gold w-full justify-center text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Отправить тепло
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400/60">
          {wishes.length}{" "}
          {plural(wishes.length, "пожелание", "пожелания", "пожеланий")} на стене
        </p>
      </div>

      {/* wall */}
      <div>
        {wishes.length === 0 ? (
          <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl px-6 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-300">
              <Snowflake size={24} style={{ animation: "spin-slow 16s linear infinite" }} />
            </span>
            <p className="font-display text-2xl font-semibold text-white">Стена пока пуста</p>
            <p className="max-w-sm text-sm text-slate-300/70">
              Оставьте первое пожелание — друзьям будет очень приятно
            </p>
          </div>
        ) : (
          <div className="masonry columns-1 md:columns-2">
            <AnimatePresence mode="popLayout">
              {wishes.map((w) => (
                <motion.div
                  key={w.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <WishCard wish={w}>
                    {confirmId === w.id ? (
                      <button
                        onClick={() => doDelete(w.id)}
                        disabled={deletingId === w.id}
                        className="flex items-center gap-1.5 rounded-full border border-red-400/60 bg-red-500/20 px-3 py-1.5 text-[0.7rem] font-bold text-red-200 transition hover:bg-red-500/40"
                      >
                        {deletingId === w.id ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <Trash2 size={11} />
                        )}
                        Удалить?
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmId(w.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400/60 transition hover:bg-white/5 hover:text-red-300"
                        aria-label="Удалить пожелание"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </WishCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
