import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Snowflake, Upload } from "lucide-react";
import MemoryGrid from "@/components/MemoryGrid";
import UploadCTA from "@/components/UploadCTA";
import { getAlbumById, getMemories } from "@/lib/data";
import { formatDate, plural } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) notFound();

  const [album, memories] = await Promise.all([
    getAlbumById(num),
    getMemories({ albumId: num }),
  ]);
  if (!album) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-20 sm:pt-24">
      <Link
        href="/albums"
        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300/70 transition hover:text-gold-300"
      >
        <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
        Все альбомы
      </Link>

      <header className="mb-10 mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="section-kicker">
            <Snowflake size={13} />
            Альбом · {memories.length}{" "}
            {plural(memories.length, "воспоминание", "воспоминания", "воспоминаний")}
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold text-white sm:text-5xl">
            {album.title}
          </h1>
          {album.description && (
            <p className="mt-4 max-w-xl text-slate-300/75">{album.description}</p>
          )}
          <p className="mt-2 text-xs text-slate-400/60">Создан {formatDate(album.createdAt)}</p>
        </div>
        <UploadCTA albumId={album.id} className="!px-5 !py-3 text-sm">
          <Upload size={16} strokeWidth={2.5} />
          Добавить в альбом
        </UploadCTA>
      </header>

      <MemoryGrid
        memories={memories}
        emptyText="В альбоме пока пусто"
        subEmptyText="Добавьте первые фото или видео — кнопка выше"
      />
    </div>
  );
}
