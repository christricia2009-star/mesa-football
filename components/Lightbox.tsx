"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Photo } from "@/lib/types";
import { gameBySlug, levelLabel, playerHref, playerName } from "@/lib/data";
import { GAME_PRICE_LABEL, NIGHT_PRICE_LABEL, nightPack, PHOTO_PRICE_LABEL } from "@/lib/shop";
import { formatBytes, paidDownloadUrl, thumbSrc } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { usePhotos } from "./PhotoProvider";
import PhotoCredit from "./PhotoCredit";

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
  const { favorites, toggleFav, photos: allPhotos } = usePhotos();
  const { add, remove, has, covers, addGame, removeGame, addNight, removeNight, hasGame, hasNight, orderFor } = useCart();
  const [fullReady, setFullReady] = useState(false);

  useEffect(() => {
    setFullReady(false);
  }, [photo?.src]);

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

  const game = gameBySlug(photo.game);
  const paid = orderFor(photo);
  const inCart = covers(photo);
  const night = game ? nightPack(game.date, allPhotos) : null;
  const gameInCart = game ? hasGame(game.slug) || (night ? hasNight(night.date) : false) : false;

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
          {paid ? (
            <a className="pill orange" href={paidDownloadUrl(paid.sessionId, photo.id)}>
              Download original
            </a>
          ) : (
            <button
              className="pill orange"
              onClick={() => {
                if (has(photo.id)) remove(photo.id);
                else if (!inCart) add(photo.id);
              }}
            >
              {inCart ? `In cart · ${PHOTO_PRICE_LABEL}` : `Add · ${PHOTO_PRICE_LABEL}`}
            </button>
          )}
          {inCart && !paid && (
            <Link className="pill" href="/cart" onClick={onClose}>
              Cart
            </Link>
          )}
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
        <div className="lb-frame">
          <div className="lb-photo">
            <span
              className="guarded"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <img src={thumbSrc(photo.src)} alt="" draggable={false} />
              <img
                src={photo.src}
                alt={photo.caption}
                draggable={false}
                onLoad={() => setFullReady(true)}
                style={{ opacity: fullReady ? 1 : 0 }}
              />
              <span className="guarded-shield" aria-hidden="true" />
            </span>
            <PhotoCredit />
          </div>
        </div>
        <button
          className="lb-nav next"
          onClick={() => onIndex((index + 1) % photos.length)}
        >
          ›
        </button>
      </div>
      <div className="lb-bot">
        <div className="lb-side">
        {!paid && game && (
          <div className="lb-packs">
            <button
              className={gameInCart ? "pill orange" : "pill"}
              onClick={() => {
                if (night && hasNight(night.date)) return;
                if (hasGame(game.slug)) removeGame(game.slug);
                else addGame(game.slug);
              }}
            >
              {night && hasNight(night.date)
                ? "In the night"
                : hasGame(game.slug)
                  ? `Game added · ${GAME_PRICE_LABEL}`
                  : `Whole game · ${GAME_PRICE_LABEL}`}
            </button>
            {night && (
              <button
                className={hasNight(night.date) ? "pill orange" : "pill"}
                onClick={() => (hasNight(night.date) ? removeNight(night.date) : addNight(night.date))}
              >
                {hasNight(night.date) ? `Night added · ${NIGHT_PRICE_LABEL}` : `Whole night · ${NIGHT_PRICE_LABEL}`}
              </button>
            )}
          </div>
        )}
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
        </div>
        <span className="lb-meta">
          {index + 1} / {photos.length} · marked preview · {PHOTO_PRICE_LABEL} for the clean file · ← → · Esc
        </span>
      </div>
    </div>
  );
}
