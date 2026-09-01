"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { seedPhotos } from "@/lib/photos";
import type { Photo } from "@/lib/types";

type Ctx = {
  photos: Photo[];
  favorites: string[];
  toggleFav: (id: string) => void;
  refresh: () => Promise<void>;
};

const PhotoCtx = createContext<Ctx | null>(null);

export function PhotoProvider({ children }: { children: React.ReactNode }) {
  const [uploaded, setUploaded] = useState<Photo[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as Photo[];
      setUploaded(data);
    } catch {
      /* local demo still works on seed photos */
    }
  }, []);

  useEffect(() => {
    refresh();
    const raw = localStorage.getItem("mavs-favs");
    if (raw) setFavorites(JSON.parse(raw));
  }, [refresh]);

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("mavs-favs", JSON.stringify(next));
      return next;
    });
  };

  const photos = useMemo(() => {
    const map = new Map<string, Photo>();
    seedPhotos.forEach((p) => map.set(p.id, p));
    uploaded.forEach((p) => map.set(p.id, p));
    return Array.from(map.values()).sort(
      (a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)
    );
  }, [uploaded]);

  return (
    <PhotoCtx.Provider value={{ photos, favorites, toggleFav, refresh }}>
      {children}
    </PhotoCtx.Provider>
  );
}

export function usePhotos() {
  const ctx = useContext(PhotoCtx);
  if (!ctx) throw new Error("usePhotos must be used inside PhotoProvider");
  return ctx;
}
