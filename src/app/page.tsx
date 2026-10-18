import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Clock,
  Film,
  Layers,
  Images,
  Quote,
  Snowflake,
  Sparkles,
  Upload,
} from "lucide-react";
import Countdown from "@/components/Countdown";
import MemoryGrid from "@/components/MemoryGrid";
import Reveal from "@/components/Reveal";
import UploadCTA from "@/components/UploadCTA";
import WishCard from "@/components/WishCard";
import { getAlbumsWithStats, getLatestMemories, getStats, getWishes } from "@/lib/data";
import { plural } from "@/lib/utils";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

function SectionHead({
  kicker,
  title,
  href,
  linkText,
}: {
  kicker: string;
  title: ReactNode;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="section-kicker">
          <Snowflake size={13} />
          {kicker}
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      </div>
      {href && linkText && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition hover:text-gold-400"
        >
          {linkText}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  delay,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="glass-panel group flex items-center gap-4 rounded-3xl px-6 py-5 transition-transform duration-500 hover:-translate-y-1">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-300 transition-transform duration-500 group-hover:scale-110">
          {icon}
        </span>
        <div>
          <p className="font-display text-3xl font-bold tabular-nums text-white">{value}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/60">
            {label}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default async function HomePage() {
  const [stats, latest, albums, wishes] = await Promise.all([
    getStats(),
    getLatestMemories(8),
    getAlbumsWithStats(),
    getWishes(3),
  ]);

  const heroPhotos = latest.filter((m) => m.type === "photo").slice(0, 2);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* floating memories */}
        {heroPhotos[0] && (
          <div
            className="pointer-events-none absolute left-[3%] top-32 hidden w-52 rotate-[-7deg] xl:block"
            style={{ animation: "floaty 7s ease-in-out infinite", ["--fl-rot" as string]: "-7deg" }}
          >
            <div className="frost-card overflow-hidden rounded-2xl p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroPhotos[0].filePath} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
            </div>
          </div>
        )}
        {heroPhotos[1] && (
          <div
            className="pointer-events-none absolute right-[3%] top-40 hidden w-52 rotate-[6deg] xl:block"
            style={{ animation: "floaty 8s ease-in-out 1.2s infinite", ["--fl-rot" as string]: "6deg" }}
          >
            <div className="frost-card overflow-hidden rounded-2xl p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroPhotos[1].filePath} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
            </div>
          </div>
        )}

        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-28 text-center sm:pt-36">
          <Reveal>
            <p className="section-kicker justify-center">
              <Sparkles size={14} />
              Только для наших · закрытый архив дружбы
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display mt-6 text-5xl font-bold leading-[1.05] text-white sm:text-7xl">
              Воспоминания,
              <br />
              которые <span className="gold-text">не растают</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-300/85 sm:text-lg">
              Загружайте фотографии и видео, собирайте альбомы и оставляйте друг другу
              пожелания — наша общая новогодняя история хранится здесь, под мягким снегопадом.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <UploadCTA>
                <Upload size={18} strokeWidth={2.5} />
                Загрузить воспоминания
              </UploadCTA>
              <Link href="/gallery" className="btn-ghost">
                <Images size={18} />
                Смотреть галерею
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ COUNTDOWN ============ */}
      <section className="mx-auto max-w-5xl px-4">
        <Reveal>
          <div className="frost-card relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12">
            <Clock size={120} className="absolute -left-8 -top-8 text-gold-400/[0.07]" aria-hidden />
            <Snowflake
              size={150}
              className="absolute -bottom-10 -right-10 text-gold-400/[0.07]"
              style={{ animation: "spin-slow 24s linear infinite" }}
              aria-hidden
            />
            <p className="section-kicker justify-center">
              <Sparkles size={13} />
              Совсем скоро
            </p>
            <h2 className="font-display mb-9 mt-3 text-3xl font-bold text-white sm:text-4xl">
              До <span className="gold-text">Нового года</span> осталось
            </h2>
            <Countdown />
          </div>
        </Reveal>
      </section>

      {/* ============ STATS ============ */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Camera size={20} />} value={stats.photos} label={plural(stats.photos, "фотография", "фотографии", "фотографий")} delay={0} />
          <StatCard icon={<Film size={20} />} value={stats.videos} label={plural(stats.videos, "видео", "видео", "видео")} delay={0.08} />
          <StatCard icon={<Layers size={20} />} value={stats.albums} label={plural(stats.albums, "альбом", "альбома", "альбомов")} delay={0.16} />
          <StatCard icon={<Quote size={20} />} value={stats.wishes} label={plural(stats.wishes, "пожелание", "пожелания", "пожеланий")} delay={0.24} />
        </div>
      </section>

      {/* ============ RECENT ============ */}
      <section className="mx-auto mt-24 max-w-7xl px-4">
        <Reveal>
          <SectionHead
            kicker="Свежее в архиве"
            title={
              <>
                Последние <span className="gold-text">моменты</span>
              </>
            }
            href="/gallery"
            linkText="Вся галерея"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <MemoryGrid memories={latest} />
        </Reveal>
      </section>

      {/* ============ ALBUMS ============ */}
      {albums.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl px-4">
          <Reveal>
            <SectionHead
              kicker="Наши истории"
              title={
                <>
                  Альбомы <span className="gold-text">с характером</span>
                </>
              }
              href="/albums"
              linkText="Все альбомы"
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.slice(0, 3).map((a, i) => (
              <Reveal key={a.id} delay={i * 0.08}>
                <Link
                  href={`/albums/${a.id}`}
                  className="frost-card group relative block overflow-hidden rounded-3xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {a.coverPath ? (
                      a.coverType === "video" ? (
                        <video
                          src={a.coverPath}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.coverPath}
                          alt={a.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-night-800 to-night-900">
                        <Layers size={40} className="text-gold-400/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#03060f]/95 via-[#03060f]/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold-400/90">
                        {a.count} {plural(a.count, "воспоминание", "воспоминания", "воспоминаний")}
                      </p>
                      <h3 className="font-display mt-1.5 text-2xl font-bold text-white transition-colors group-hover:text-gold-300">
                        {a.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ WISHES ============ */}
      {wishes.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl px-4">
          <Reveal>
            <SectionHead
              kicker="Тепло слов"
              title={
                <>
                  Пожелания на <span className="gold-text">Новый год</span>
                </>
              }
              href="/wishes"
              linkText="Вся стена"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {wishes.map((w, i) => (
              <Reveal key={w.id} delay={i * 0.08}>
                <WishCard wish={w} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto mt-28 max-w-5xl px-4">
        <Reveal>
          <div className="frost-card relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-16">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(600px 300px at 50% 120%, rgba(245,201,107,0.25), transparent 70%)",
              }}
            />
            <div className="relative">
              <Snowflake
                size={40}
                className="mx-auto text-gold-300"
                style={{ animation: "spin-slow 18s linear infinite" }}
              />
              <h2 className="font-display mx-auto mt-6 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
                Добавь свою частичку <span className="gold-text">волшебства</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-slate-300/80">
                Каждый кадр, каждое видео и каждое пожелание делают этот архив теплее.
                Поделитесь моментом — через годы мы скажем себе спасибо.
              </p>
              <div className="mt-9">
                <UploadCTA>
                  <Upload size={18} strokeWidth={2.5} />
                  Загрузить воспоминание
                </UploadCTA>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
