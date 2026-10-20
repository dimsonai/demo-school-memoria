import type { Metadata } from "next";
import { Playfair_Display, Inter, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({ subsets: ["cyrillic"], variable: "--font-serif" });
const inter = Inter({ subsets: ["cyrillic"], variable: "--font-sans" });
const caveat = Caveat({ subsets: ["cyrillic"], variable: "--font-handwritten" });

export const metadata: Metadata = {
  title: "Выпускной 2027 | 11 «А» класс",
  description: "Школьный альбом класса. Фото, пожелания и воспоминания.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable} ${caveat.variable}`}>
      <body className="font-sans bg-[var(--background)] text-[var(--foreground)] flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
