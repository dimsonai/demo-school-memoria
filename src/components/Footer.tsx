import Link from "next/link";
import { Heart, Snowflake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-300">
          <Snowflake size={20} style={{ animation: "spin-slow 14s linear infinite" }} />
        </span>
        <p className="font-display max-w-md text-xl font-semibold text-white">
          Пусть каждый кадр хранит тепло наших встреч
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-300/70">
          <Link href="/gallery" className="transition hover:text-gold-300">
            Галерея
          </Link>
          <Link href="/albums" className="transition hover:text-gold-300">
            Альбомы
          </Link>
          <Link href="/wishes" className="transition hover:text-gold-300">
            Пожелания
          </Link>
        </nav>
        <p className="flex items-center gap-2 text-xs text-slate-400/60">
          Сделано с <Heart size={12} className="text-holly-400" fill="currentColor" /> для
          самых близких · Снегопад, {new Date().getFullYear()}
        </p>
        <p className="text-[0.65rem] text-slate-500/50">
          Фоновая музыка: «Silent Night» — Kevin MacLeod (incompetech.com), лицензия CC BY 3.0
        </p>
      </div>
    </footer>
  );
}
