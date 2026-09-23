"use client";

import { useMemo } from "react";
import PackOffers from "@/components/PackOffers";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotos } from "@/components/PhotoProvider";
import { gameBySlug, levelLabel } from "@/lib/data";

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
  const game = gameBySlug(slug);

  return (
    <section className="section">
      {list.length > 0 && game && (
        <div className="pack-note">
          <p>
            Every {levelLabel(game.level)} photo from this game is $10. JV and varsity from the
            same night are $20 together. Single photos stay $1.
          </p>
          <PackOffers onlySlug={slug} />
        </div>
      )}
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
