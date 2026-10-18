"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Images, Layers, Menu, Snowflake, Sparkles, Upload, X } from "lucide-react";
import Garland from "@/components/Garland";
import { useUpload } from "@/components/UploadProvider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Главная" },
  { href: "/gallery", label: "Галерея" },
  { href: "/albums", label: "Альбомы" },
  { href: "/wishes", label: "Пожелания" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { openUpload } = useUpload();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/[0.07] bg-[#070d21]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 via-gold-400 to-[#b97f22] text-[#231803] shadow-[0_10px_26px_-8px_rgba(245,201,107,0.7)] transition-transform duration-500 group-hover:rotate-90">
              <Snowflake size={19} strokeWidth={2.2} />
            </span>
            <span className="leading-tight">
              <span className="font-display block text-lg font-bold tracking-wide text-white">
                Снегопад
              </span>
              <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold-400/80">
                наш тёплый архив
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300",
                    active ? "text-gold-300" : "text-slate-200/75 hover:text-white"
                  )}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-[13px] h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => openUpload()} className="btn-gold hidden !px-5 !py-2.5 text-sm sm:inline-flex">
              <Upload size={16} strokeWidth={2.5} />
              Загрузить
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-200 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Меню"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="border-b border-white/10 bg-[#070d21]/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {LINKS.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold",
                    active
                      ? "bg-gold-400/15 text-gold-300"
                      : "text-slate-200/80 hover:bg-white/5"
                  )}
                >
                  {l.href === "/gallery" ? (
                    <Images size={16} />
                  ) : l.href === "/albums" ? (
                    <Layers size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {l.label}
                </Link>
              );
              })}
            <button
              onClick={() => {
                setMenuOpen(false);
                openUpload();
              }}
              className="btn-gold mt-2 justify-center text-sm"
            >
              <Upload size={16} strokeWidth={2.5} />
              Загрузить воспоминание
            </button>
          </nav>
        </div>
      )}

      <Garland />
    </header>
  );
}
