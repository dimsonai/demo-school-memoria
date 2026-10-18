"use client";

import type { ReactNode } from "react";
import { useUpload } from "@/components/UploadProvider";
import { cn } from "@/lib/utils";

export default function UploadCTA({
  children,
  albumId,
  variant = "gold",
  className,
}: {
  children: ReactNode;
  albumId?: number | null;
  variant?: "gold" | "ghost";
  className?: string;
}) {
  const { openUpload } = useUpload();
  return (
    <button
      onClick={() => openUpload(albumId ?? null)}
      className={cn(variant === "gold" ? "btn-gold" : "btn-ghost", className)}
    >
      {children}
    </button>
  );
}
