"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Photo } from "@/lib/types";
import { gameBySlug, levelLabel, playerHref, playerName } from "@/lib/data";
import { downloadUrl, formatBytes } from "@/lib/utils";
import { usePhotos } from "./PhotoProvider";

export default function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const photo = photos[index];
  const { favorites, toggleFav } = usePhotos();
  const game = gameBySlug(photo.game);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onClose, onIndex]);

  if (!photo) return null;

  return (
    <div className="lb" role="dialog" aria-modal="true">
      <div className="lb-top">
        <div className="lb-meta">
          <strong>{photo.caption}</strong>
          <div>
            {game
              ? `${levelLabel(game.level)} ${game.location === "home" ? "vs" : "@"} ${game.opponent}`
              : photo.game}
            {photo.bytes ? ` · ${formatBytes(photo.bytes)} original` : " · original file"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="pill" onClick={() => toggleFav(photo.id)}>
            {favorites.includes(photo.id) ? "♥ Saved" : "♡ Save"}
          </button>
          <a className="pill orange" href={downloadUrl(photo.src, photo.originalName)}>
            Download original
          </a>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
      </div>
      <div className="lb-stage">
        <button
          className="lb-nav prev"
          onClick={() => onIndex((index - 1 + photos.length) % photos.length)}
        >
          ‹
        </button>
        <img src={photo.src} alt={photo.caption} />
        <button
          className="lb-nav next"
          onClick={() => onIndex((index + 1) % photos.length)}
        >
          ›
        </button>
      </div>
      <div className="lb-bot">
        <div className="player-pills">
          {photo.players.length === 0 && (
            <span style={{ color: "var(--muted)", fontSize: 12 }}>No jersey tags yet</span>
          )}
          {photo.players.map((n) => (
            <Link
              key={n}
              href={playerHref({ level: photo.level, number: n })}
              onClick={onClose}
            >
              #{n} {playerName(n, photo.level)}
            </Link>
          ))}
        </div>
        <span className="lb-meta">
          {index + 1} / {photos.length} · ← → to flip · Esc to close
        </span>
      </div>
    </div>
  );
}
