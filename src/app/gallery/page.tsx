import * as GalleryViewModule from "@/components/GalleryView";
import * as dataModule from "@/lib/data";

export const dynamic = "force-dynamic";

const GalleryView =
  (GalleryViewModule as any).default ||
  (GalleryViewModule as any).GalleryView;

export default async function GalleryPage() {
  let memories: any[] = [];
  let albums: any[] = [];

  try {
    if (typeof dataModule.getMemories === "function") {
      memories = await dataModule.getMemories();
    }
  } catch (error) {
    console.error("Failed to load memories:", error);
  }

  try {
    if (typeof (dataModule as any).getAlbums === "function") {
      albums = await (dataModule as any).getAlbums();
    }
  } catch (error) {
    console.error("Failed to load albums:", error);
  }

  return (
    <GalleryView
      memories={memories}
      initialMemories={memories}
      albums={albums}
      initialAlbums={albums}
    />
  );
}
