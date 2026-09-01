"use client";

import PhotoGrid from "@/components/PhotoGrid";
import { usePhotos } from "@/components/PhotoProvider";
import type { TeamLevel } from "@/lib/types";

export default function PlayerFilm({
  number,
  level,
}: {
  number: number;
  level: TeamLevel;
}) {
  const { photos } = usePhotos();
  const list = photos.filter(
    (p) => p.level === level && p.players.includes(number)
  );
  return (
    <div style={{ marginTop: 20 }}>
      <PhotoGrid photos={list} empty={`No tagged ${level === "jv" ? "JV" : "varsity"} photos for #${number} yet.`} />
    </div>
  );
}
