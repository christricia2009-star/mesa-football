"use client";

import { useMemo } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotos } from "@/components/PhotoProvider";

export default function GameAlbum({
  slug,
  photoNight,
}: {
  slug: string;
  photoNight: boolean;
}) {
  const { photos } = usePhotos();
  const list = useMemo(
    () => photos.filter((p) => p.game === slug),
    [photos, slug]
  );

  return (
    <section className="section">
      <PhotoGrid
        photos={list}
        empty={
          photoNight
            ? "No photos in this album yet."
            : "Away game — no home photos posted for this night."
        }
      />
    </section>
  );
}
