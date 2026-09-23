"use client";

import { useState } from "react";
import { usePhotos } from "./PhotoProvider";
import Lightbox from "./Lightbox";
import { LEAD_PHOTO_ID } from "@/lib/photos";
import { thumbSrc } from "@/lib/utils";
import GuardedImage from "./GuardedImage";
import PhotoCredit from "./PhotoCredit";

export default function HomeFilm() {
  const { photos } = usePhotos();
  const featured = photos.filter((p) => p.featured && p.level === "varsity");
  const lead = featured.find((p) => p.id === LEAD_PHOTO_ID) || featured[0];
  const rest = featured.filter((p) => p.id !== lead?.id).slice(0, 4);
  const shots = lead ? [lead, ...rest] : photos.slice(0, 5);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="filmstrip">
        {shots[0] && (
          <figure className="shot tall" onClick={() => setOpen(0)} style={{ cursor: "pointer" }}>
            <GuardedImage src={thumbSrc(shots[0].src)} alt={shots[0].caption} />
            <PhotoCredit />
            <span className="tag">Lead</span>
            <figcaption>{shots[0].caption}</figcaption>
          </figure>
        )}
        {shots.slice(1, 5).map((p, i) => (
          <figure
            key={p.id}
            className="shot"
            onClick={() => setOpen(i + 1)}
            style={{ cursor: "pointer" }}
          >
            <GuardedImage src={thumbSrc(p.src)} alt={p.caption} />
            <PhotoCredit />
            <figcaption>{p.caption}</figcaption>
          </figure>
        ))}
      </div>
      {open !== null && (
        <Lightbox
          photos={shots}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
