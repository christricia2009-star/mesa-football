"use client";

import PhotoGrid from "@/components/PhotoGrid";
import { usePhotos } from "@/components/PhotoProvider";

export default function PlayerFilm({ number }: { number: number }) {
  const { photos } = usePhotos();
  const list = photos.filter((p) => p.players.includes(number));
  return (
    <div style={{ marginTop: 20 }}>
      <PhotoGrid
        photos={list}
        empty={`No tagged photos for #${number} yet.`}
      />
    </div>
  );
}
