import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Снегопад — наши воспоминания",
    short_name: "Снегопад",
    description:
      "Уютное зимнее хранилище фотографий, комментариев и пожеланий для нас и наших друзей.",
    lang: "ru",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#060b1e",
    theme_color: "#0b1430",
    icons: [
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
