"use client";

import { useMemo, useState } from "react";
import type { Photo } from "@/lib/types";
import { gameBySlug, levelLabel } from "@/lib/data";
import { PHOTO_PRICE_LABEL } from "@/lib/shop";
import { thumbSrc } from "@/lib/utils";
import { useCart } from "./CartProvider";
import GuardedImage from "./GuardedImage";
import Lightbox from "./Lightbox";
import PhotoCredit from "./PhotoCredit";

export default function PhotoGrid({
  photos,
  empty = "No photos in this set yet.",
}: {
  photos: Photo[];
  empty?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const { add, remove, has, covers } = useCart();
  const list = useMemo(() => photos, [photos]);

  if (!list.length) {
    return <p style={{ color: "var(--muted)" }}>{empty}</p>;
  }

  return (
    <>
      <div className="masonry">
        {list.map((p, i) => {
          const game = gameBySlug(p.game);
          return (
            <figure key={p.id} className="tile" onClick={() => setOpen(i)}>
              <GuardedImage src={thumbSrc(p.src)} alt={p.caption} loading="lazy" />
              <button
                className="tile-buy"
                onClick={(e) => {
                  e.stopPropagation();
                  if (has(p.id)) remove(p.id);
                  else if (!covers(p)) add(p.id);
                }}
              >
                {covers(p) ? "In cart" : PHOTO_PRICE_LABEL}
              </button>
              <PhotoCredit />
              <figcaption className="tile-meta">
                {game ? `${levelLabel(game.level)} · ${game.opponent}` : ""}
                {p.players.length ? ` · #${p.players.join(" #")}` : ""}
              </figcaption>
            </figure>
          );
        })}
      </div>
      {open !== null && (
        <Lightbox
          photos={list}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
