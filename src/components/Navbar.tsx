"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, QrCode, X, Download, Star, Image, MessageCircle, Home } from "lucide-react";

export default function Navbar() {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const siteUrl = "https://memoria-school-demo.netlify.app";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(siteUrl)}&color=2c5282`;
  const highResQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(siteUrl)}&color=2c5282`;

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#faf7f0]/80 border-b border-blue-100 transition-all shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-[#2c5282] flex items-center justify-center group-hover:rotate-3 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base text-[#1a365d] leading-tight">
                11 «А» класс
              </span>
              <span className="text-[10px] text-blue-600 uppercase tracking-widest font-semibold">
                Выпуск 2027
              </span>
            </div>
          </Link>

          {/* Навигация */}
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:text-[#2c5282] font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 hidden md:inline" />
              Главная
            </Link>
            <Link
              href="/gallery"
              className="px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:text-[#2c5282] font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <Image className="w-4 h-4 hidden md:inline" />
              Альбом
            </Link>
            <Link
              href="/wishes"
              className="px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:text-[#2c5282] font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 hidden md:inline" />
              Пожелания
            </Link>

            {/* Кнопка QR-кода */}
            <button
              onClick={() => setIsQrOpen(true)}
              className="ml-2 px-3 py-1.5 text-xs sm:text-sm bg-[#2c5282] text-white font-bold rounded-lg hover:bg-[#1a365d] transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden xs:inline">QR</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Модальное окно QR */}
      {isQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a365d]/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full border-4 border-[#2c5282] shadow-2xl text-center relative">
            <button
              onClick={() => setIsQrOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-[#2c5282]">
              <Star className="w-7 h-7 text-[#2c5282]" />
            </div>

            <h3 className="text-xl font-bold text-[#1a365d] mb-2">Наш онлайн альбом</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium">
              Сканируй, чтобы загрузить фото и видео в память о классе
            </p>

            <div className="bg-white p-3 rounded-xl border-2 border-gray-100 inline-block mb-6 shadow-inner">
              <img src={qrImageUrl} alt="QR Code" className="w-44 h-44 mx-auto" />
            </div>

            <div className="space-y-3">
              <a
                href={highResQrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#2c5282] text-white text-xs font-bold rounded-xl hover:bg-[#1a365d] transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                СКАЧАТЬ ДЛЯ ПЕЧАТИ (HD)
              </a>
              <p className="text-[10px] text-gray-400">QR-код ведет на memoria-school-demo.netlify.app</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { Navbar };
