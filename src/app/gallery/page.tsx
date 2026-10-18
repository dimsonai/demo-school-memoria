import { Images, Snowflake, Upload } from "lucide-react";
import GalleryView from "@/components/GalleryView";
import UploadCTA from "@/components/UploadCTA";
import { getAlbumsWithStats, getMemories } from "@/lib/data";
import { plural } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Галерея — Снегопад",
};

export default async function GalleryPage() {
  const [memories, albums] = await Promise.all([getMemories(), getAlbumsWithStats()]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-20 sm:pt-24">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="section-kicker">
            <Snowflake size={13} />
            Все наши моменты
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold text-white sm:text-5xl">
            Галерея <span className="gold-text">воспоминаний</span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-300/75">
            {memories.length}{" "}
            {plural(memories.length, "воспоминание", "воспоминания", "воспоминаний")} — листайте,
            улыбайтесь и добавляйте новые.
          </p>
        </div>
        <UploadCTA className="!px-5 !py-3 text-sm">
          <Upload size={16} strokeWidth={2.5} />
          Загрузить
        </UploadCTA>
      </header>

      <GalleryView memories={memories} albums={albums} />
    </div>
  );
}
