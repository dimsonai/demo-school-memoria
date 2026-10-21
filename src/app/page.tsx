export const dynamic = "force-dynamic";

import Link from "next/link";
import { GraduationCap, Clock, MapPin, Users, BookOpen, Award, Star, ArrowRight, Camera } from "lucide-react";
import { Countdown } from "@/components/Countdown";

export default async function HomePage() {
  return (
    <main className="min-h-screen pb-20">
      
      {/* Шапка (Hero Section) */}
      <section className="relative pt-16 pb-12 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100/80 rounded-2xl mb-6 shadow-sm transform -rotate-3">
            <GraduationCap className="w-12 h-12 text-[#2c5282]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#1a365d] mb-4 tracking-tight">
            11 «А» класс
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8 font-medium bg-white/50 inline-block px-6 py-2 rounded-full border border-gray-200">
            Школа №3 г. Севастополя <span className="mx-2 text-blue-300">•</span> <span className="text-[#2c5282] font-bold">Выпуск 2027</span>
          </p>
          
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-blue-50 max-w-2xl mx-auto mb-10 transform hover:scale-[1.02] transition-transform">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">До выпускного осталось</h3>
            <Countdown targetDate="2027-06-25T18:00:00" />
          </div>
        </div>
      </section>

      {/* Карточки статистики */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Учеников", value: "28" },
            { icon: BookOpen, label: "Уроков", value: "12 450" },
            { icon: Award, label: "Медалистов", value: "5" },
            { icon: Star, label: "Воспоминаний", value: "∞" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 text-center transform hover:-translate-y-1 transition-transform">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <div className="text-2xl font-black text-[#1a365d] mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Школьная доска (Приветствие) */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-[#2d4a22] p-8 md:p-12 rounded-xl shadow-2xl border-[12px] border-[#5c4033] relative">
          <div className="absolute bottom-4 right-6 w-16 h-4 bg-white/80 rounded-sm transform rotate-6"></div> {/* Мелок */}
          <h2 className="text-3xl md:text-4xl text-white font-serif mb-6 text-center chalk-text opacity-90">
            Дорогие выпускники!
          </h2>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed text-center font-serif italic max-w-2xl mx-auto chalk-text">
            «Вы прошли большой путь от первоклашек до взрослых и самостоятельных людей. 
            Впереди — университеты, новые города и великие открытия. 
            Сохраните эту страницу, чтобы через 10 лет вспомнить, какими мы были!»
          </p>
          <div className="text-right mt-6 text-white/80 font-serif chalk-text">
            — Ваш классный руководитель
          </div>
        </div>
      </section>

      {/* Программа выпускного */}
      <section className="max-w-3xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-black text-center text-[#1a365d] mb-10 flex items-center justify-center gap-3">
          <Clock className="w-8 h-8 text-blue-400" />
          Программа вечера
        </h2>
        <div className="space-y-6">
          {[
            { time: "10:00", title: "Торжественная линейка", desc: "Вручение аттестатов во дворе школы", icon: Award },
            { time: "16:00", title: "Фотосессия", desc: "Парк Победы, парадная форма", icon: Camera },
            { time: "19:00", title: "Праздничный банкет", desc: "Ресторан «Аквамарин»", icon: MapPin },
            { time: "23:00", title: "Встреча рассвета", desc: "Набережная Корнилова", icon: Star },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border-2 border-blue-50 hover:border-blue-200 transition-colors">
              <div className="flex-shrink-0 w-16 md:w-20 font-bold text-[#2c5282] text-lg md:text-xl text-right pt-1">
                {item.time}
              </div>
              <div className="w-1 bg-blue-100 rounded-full"></div>
              <div>
                <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-blue-400" />
                  {item.title}
                </h4>
                <p className="text-sm md:text-base text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Кнопка перехода в альбом */}
      <section className="text-center px-4 mb-10">
        <Link 
          href="/gallery" 
          className="inline-flex items-center gap-2 bg-[#2c5282] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#1a365d] transition-all transform hover:scale-105 shadow-lg"
        >
          <Camera className="w-6 h-6" />
          Открыть альбом класса
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </main>
  );
}
