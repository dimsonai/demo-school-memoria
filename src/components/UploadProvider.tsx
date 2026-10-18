"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import UploadModal from "@/components/UploadModal";

interface UploadContextValue {
  openUpload: (albumId?: number | null) => void;
}

const UploadContext = createContext<UploadContextValue | null>(null);

export function useUpload(): UploadContextValue {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUpload must be used inside UploadProvider");
  return ctx;
}

export default function UploadProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [albumId, setAlbumId] = useState<number | null>(null);

  const openUpload = useCallback((forAlbum?: number | null) => {
    setAlbumId(forAlbum ?? null);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ openUpload }), [openUpload]);

  return (
    <UploadContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <UploadModal initialAlbumId={albumId} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </UploadContext.Provider>
  );
}
