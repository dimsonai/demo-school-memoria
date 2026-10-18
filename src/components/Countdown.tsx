"use client";

import { useEffect, useState } from "react";

function getTarget(): Date {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), 0, 1);
  return now < thisYear ? thisYear : new Date(now.getFullYear() + 1, 0, 1);
}

function label(n: number, one: string, few: string, many: string) {
  const m = Math.abs(n) % 100;
  const d = m % 10;
  if (m > 10 && m < 20) return many;
  if (d > 1 && d < 5) return few;
  if (d === 1) return one;
  return many;
}

export default function Countdown() {
  const [now, setNow] = useState<Date | null>(null);
  const [target] = useState<Date>(() => getTarget());

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now ? Math.max(0, target.getTime() - now.getTime()) : null;
  const days = diff === null ? null : Math.floor(diff / 86400000);
  const hours = diff === null ? null : Math.floor((diff % 86400000) / 3600000);
  const mins = diff === null ? null : Math.floor((diff % 3600000) / 60000);
  const secs = diff === null ? null : Math.floor((diff % 60000) / 1000);

  const cells: Array<{ value: number | null; unit: string }> = [
    { value: days, unit: days === null ? "дней" : label(days, "день", "дня", "дней") },
    { value: hours, unit: hours === null ? "часов" : label(hours, "час", "часа", "часов") },
    { value: mins, unit: mins === null ? "минут" : label(mins, "минута", "минуты", "минут") },
    { value: secs, unit: secs === null ? "секунд" : label(secs, "секунда", "секунды", "секунд") },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {cells.map((c, i) => (
        <div
          key={i}
          className="glass-panel flex min-w-[76px] flex-col items-center rounded-2xl px-4 py-3 sm:min-w-[92px] sm:px-5 sm:py-4"
        >
          <span className="font-display text-3xl font-bold tabular-nums text-white sm:text-4xl">
            {c.value === null ? "–" : String(c.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-300/70">
            {c.unit}
          </span>
        </div>
      ))}
    </div>
  );
}
