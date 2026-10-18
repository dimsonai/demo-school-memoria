import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import BackdropFX from "@/components/BackdropFX";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import Snowfall from "@/components/Snowfall";
import UploadProvider from "@/components/UploadProvider";

export const metadata: Metadata = {
  title: "Снегопад — наши новогодние воспоминания",
  description:
    "Уютное хранилище фотографий и видео для нас и наших друзей: альбомы, галерея и пожелания на Новый год.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="grain font-sans min-h-screen antialiased">
        <BackdropFX />
        <Snowfall />
        <UploadProvider>
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <MusicPlayer />
        </UploadProvider>
      </body>
    </html>
  );
}
