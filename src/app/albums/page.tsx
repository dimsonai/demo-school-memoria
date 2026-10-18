import { Snowflake } from "lucide-react";
import AlbumsBoard from "@/components/AlbumsBoard";
import Reveal from "@/components/Reveal";
import { getAlbumsWithStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Альбомы — Снегопад",
};

export default async function AlbumsPage() {
  const albums = await getAlbumsWithStats();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-20 sm:pt-24">
      <Reveal>
        <header className="mb-10">
          <p className="section-kicker">
            <Snowflake size={13} />
            Истории по полочкам
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold text-white sm:text-5xl">
            Наши <span className="gold-text">альбомы</span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-300/75">
            Каждый альбом — отдельная глава нашей дружбы: праздники, прогулки и просто
            тёплые вечера.
          </p>
        </header>
      </Reveal>
      <AlbumsBoard albums={albums} />
    </div>
  );
}
