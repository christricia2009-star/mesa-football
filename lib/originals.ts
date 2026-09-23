import { readFile } from "fs/promises";
import path from "path";
import { seedPhotos } from "./photos";
import type { Photo } from "./types";

export async function loadCatalog(): Promise<Photo[]> {
  const map = new Map<string, Photo>();
  seedPhotos.forEach((photo) => map.set(photo.id, photo));
  try {
    const raw = await readFile(path.join(process.cwd(), "data", "photos.json"), "utf8");
    const extras = JSON.parse(raw) as Photo[];
    extras.forEach((photo) => {
      if (photo?.id && photo.src?.startsWith("/gallery/")) map.set(photo.id, photo);
    });
  } catch {
    /* seed catalog still sells */
  }
  const photos: Photo[] = [];
  map.forEach((photo) => photos.push(photo));
  return photos;
}

export function originalPath(src: string) {
  if (!src.startsWith("/gallery/") || src.includes("..") || src.includes("\0") || src.includes("\\")) {
    throw new Error("bad path");
  }
  const root = path.resolve(process.cwd(), "storage", "originals");
  const file = path.resolve(root, src.replace(/^\//, ""));
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error("bad path");
  return file;
}

export function blobPathname(src: string) {
  if (!src.startsWith("/gallery/") || src.includes("..") || src.includes("\0") || src.includes("\\")) {
    throw new Error("bad path");
  }
  return src.replace(/^\//, "");
}

export function safeName(name: string) {
  const cleaned = name.replace(/[\r\n"]/g, "").replace(/[^A-Za-z0-9._ -]/g, "_").trim();
  return (cleaned || "photo.jpg").slice(0, 120);
}
