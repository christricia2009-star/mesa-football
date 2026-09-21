"use client";

import { photographer } from "@/lib/data";

export default function PhotoCredit({ link = true }: { link?: boolean }) {
  if (!link) {
    return <span className="photo-credit">{photographer.handle}</span>;
  }

  return (
    <a
      className="photo-credit"
      href={photographer.href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {photographer.handle}
    </a>
  );
}
