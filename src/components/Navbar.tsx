"use client";

import Link from "next/link";
import { GraduationCap, Home, Image as ImageIcon, Users, MessageCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#faf7f0]/95 border-b-2 border-[#2c5282] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 group">
          <GraduationCap className="w-7 h-7 text-[#2c5282] group-hover:text-[#1a365d] transition-colors" />
          <div>
            <div className="font-serif text-xl text-[#1a365d] leading-tight">11 «А» класс</div>
            <div className="text-[10px] uppercase tracking-widest text-[#718096]">Выпуск 2027</div>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-[#2d3748] hover:text-[#2c5282] transition-colors flex items-center gap-1.5">
            <Home className="w-4 h-4" /> Главная
          </Link>
          <Link href="/gallery" className="text-sm font-medium text-[#2d3748] hover:text-[#2c5282] transition-colors flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" /> Альбом
          </Link>
          <Link href="/wishes" className="text-sm font-medium text-[#2d3748] hover:text-[#2c5282] transition-colors flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" /> Пожелания
          </Link>
          <Link href="/albums" className="text-sm font-medium text-[#2d3748] hover:text-[#2c5282] transition-colors flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Классы по годам
          </Link>
        </nav>

        <nav className="flex sm:hidden items-center gap-4">
          <Link href="/gallery" className="text-[#2c5282]"><ImageIcon className="w-5 h-5" /></Link>
          <Link href="/wishes" className="text-[#2c5282]"><MessageCircle className="w-5 h-5" /></Link>
        </nav>
      </div>
    </header>
  );
}
