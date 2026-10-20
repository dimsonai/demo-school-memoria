import Link from "next/link";
import Countdown from "@/components/Countdown";
import { getMemories, getWishes } from "@/lib/data";
import { GraduationCap, School, BookOpen, Users, Award, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let memories = [];
  let wishes = [];

  try {
    const [mRes, wRes] = await Promise.all([
      getMemories({ limit: 6 }),
      getWishes(),
    ]);
    memories = mRes || [];
    wishes = wRes || [];
  } catch (e) {
    console.error("DB error:", e);
  }

  const stats = [
    { icon: Users, label: "Учеников", value: "27" },
    { icon: BookOpen, label: "Лет вместе", value: "11" },
    { icon: Award, label: "Побед", value: "48" },
    { icon: Star, label: "Воспоминаний", value: memories.length > 0 ? `${memories.length}+` : "∞" },
  ];

  return (
    <main className="min-h-screen relative pb-20">
      
      {/* ЗАГОЛОВОК */}
      <section className="pt-16 pb-12 px-4 text-center max-w-5xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-[#e6f4ea] text-[#276749] px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold mb-6">
          <GraduationCap className="w-4 h-4" /> Выпуск 2027
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-serif text-[#1a365d] mb-4 tracking-tight">
          11 «А» класс
        </h1>
        <p className="text-xl text-[#4a5568] mb-2">Школа №3 города Севастополя</p>
        <p className="text-md text-[#718096] italic font-light mb-10">
          «Мы вместе 11 лет. Это наша история — от первого звонка до выпускного вальса»
        </p>

        {/* Таймер */}
        <div className="paper-card inline-block px-10 py-6 mb-10">
          <p className="text-xs uppercase tracking-widest text-[#2c5282] mb-3 font-bold">
            🎓 До выпускного осталось:
          </p>
          <Countdown targetDate="2027-06-25T18:00:00" />
        </div>

        {/* Кнопки */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/gallery" className="bg-[#2c5282] hover:bg-[#1a365d] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all text-sm">
            📸 Фотоархив класса
          </Link>
          <Link href="/wishes" className="bg-white border border-[#2c5282] text-[#2c5282] hover:bg-[#f0f4f8] px-6 py-3 rounded-lg font-medium transition-all text-sm">
            ✍️ Оставить запись в альбоме
          </Link>
        </div>
      </section>

      {/* СТАТИСТИКА */}
      <section className="max-w-5xl mx-auto px-4 my-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="paper-card text-center p-6">
              <s.icon className="w-7 h-7 text-[#2c5282] mx-auto mb-2" />
              <div className="text-3xl font-bold text-[#1a365d] font-serif">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-[#718096] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ШКОЛЬНАЯ ДОСКА С ПРИВЕТСТВИЕМ */}
      <section className="max-w-4xl mx-auto px-4 my-16">
        <div className="blackboard text-center">
          <p className="chalk-text text-2xl mb-4">✨ Дорогие одноклассники! ✨</p>
          <p className="chalk-text text-base leading-relaxed max-w-2xl mx-auto">
            Здесь мы собираем самые тёплые моменты наших школьных лет. 
            Загружайте фото с уроков, походов, конкурсов и праздников. 
            Пишите пожелания друг другу — они останутся в нашем классе навсегда.
          </p>
          <p className="chalk-text text-sm mt-6 opacity-80">— Ваш классный руководитель</p>
        </div>
      </section>

      {/* ТАЙМИНГ ВЫПУСКНОГО */}
      <section className="max-w-3xl mx-auto px-4 my-16">
        <h2 className="text-3xl font-serif text-[#1a365d] mb-8 text-center">📅 Программа Выпускного</h2>
        <div className="paper-card p-8">
          {[
            { time: "10:00", event: "Торжественная линейка во дворе школы", icon: "🎓" },
            { time: "12:00", event: "Вручение аттестатов в актовом зале", icon: "📜" },
            { time: "14:00", event: "Фотосессия классом и семейные фото", icon: "📸" },
            { time: "17:00", event: "Банкет в ресторане «Небо»", icon: "🥂" },
            { time: "22:00", event: "Прогулка по набережной. Встреча рассвета", icon: "🌅" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-dashed border-[#cbd5e0] last:border-b-0">
              <div className="text-3xl">{item.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[#2c5282]">{item.time}</div>
                <div className="text-md text-[#2d3748]">{item.event}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ЛЕНТА ВОСПОМИНАНИЙ */}
      <section className="max-w-5xl mx-auto px-4 my-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-[#1a365d]">🖼 Наш школьный альбом</h2>
          <p className="text-sm text-[#718096] mt-2">Моменты, которые останутся с нами навсегда</p>
        </div>

        {memories.length === 0 ? (
          <div className="paper-card text-center py-16">
            <School className="w-12 h-12 text-[#cbd5e0] mx-auto mb-3" />
            <p className="text-[#718096]">Пока нет фотографий. Будьте первым, кто поделится воспоминанием!</p>
            <Link href="/gallery" className="inline-block mt-4 text-sm text-[#2c5282] underline">Загрузить фото →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {memories.map((m) => (
              <div key={m.id} className="photo-pin">
                <img
                  src={m.filePath}
                  alt={m.caption || "Воспоминание"}
                  className="w-full h-48 object-cover"
                />
                {m.caption && (
                  <p className="text-sm text-[#2d3748] mt-3 text-center italic" style={{fontFamily: 'Caveat, cursive'}}>
                    "{m.caption}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* КАПСУЛА ВРЕМЕНИ */}
      <section className="max-w-4xl mx-auto px-4 my-16">
        <div className="paper-card p-10 text-center bg-gradient-to-br from-[#fffcf5] to-[#f0f4f8]">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-3xl font-serif text-[#1a365d] mb-3">Капсула времени</h2>
          <p className="text-[#4a5568] max-w-xl mx-auto mb-6">
            Напиши письмо себе в будущее. Оно откроется ровно через 10 лет — на нашей встрече выпускников в 2037 году.
          </p>
          <Link href="/wishes" className="inline-block bg-[#1a365d] hover:bg-[#2c5282] text-white px-8 py-3 rounded-lg font-medium transition-all text-sm">
            ✉️ Написать письмо
          </Link>
        </div>
      </section>
    </main>
  );
}
