import { Snowflake } from "lucide-react";
import Reveal from "@/components/Reveal";
import WishesView from "@/components/WishesView";
import { getWishes } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Пожелания — Снегопад",
};

export default async function WishesPage() {
  const wishes = await getWishes(100);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-20 sm:pt-24">
      <Reveal>
        <header className="mb-10">
          <p className="section-kicker">
            <Snowflake size={13} />
            Тепло слов
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold text-white sm:text-5xl">
            Стена <span className="gold-text">пожеланий</span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-300/75">
            Напишите друг другу что-то доброе на новый год — эти слова будут греть нас
            круглый год.
          </p>
        </header>
      </Reveal>
      <WishesView wishes={wishes} />
    </div>
  );
}
