"use client";

import { useState } from "react";
import GuardedImage from "@/components/GuardedImage";
import type { ShootPhoto } from "@/lib/shoots";
import { thumbSrc } from "@/lib/utils";

export default function ShootGallery({ photos }: { photos: ShootPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const photo = open === null ? null : photos[open];

  return (
    <>
      <div className="shoot-photos">
        {photos.map((item, index) => (
          <button key={item.src} className="shoot-photo" onClick={() => setOpen(index)} type="button">
            <GuardedImage src={thumbSrc(item.src)} alt={item.caption} loading="lazy" />
          </button>
        ))}
      </div>
      {photo && (
        <div className="lb" onClick={() => setOpen(null)}>
          <div className="lb-photo" onClick={(e) => e.stopPropagation()}>
            <GuardedImage src={photo.src} alt={photo.caption} />
          </div>
          <button className="pill" type="button" onClick={() => setOpen(null)}>
            Close
          </button>
        </div>
      )}
    </>
  );
}
