"use client";

import { useEffect, useMemo, useState } from "react";
import PackOffers from "@/components/PackOffers";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotos } from "@/components/PhotoProvider";
import { games, levelLabel } from "@/lib/data";
import { searchPhotoGroups } from "@/lib/photo-search";
import type { TeamLevel } from "@/lib/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function chipDate(iso: string) {
  return `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8))}`;
}

export default function GalleryClient({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const { photos, favorites } = usePhotos();
  const [q, setQ] = useState(initialQuery);
  const [level, setLevel] = useState<"all" | TeamLevel>("all");
  const [game, setGame] = useState("all");
  const [favOnly, setFavOnly] = useState(false);

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  const levelGames = useMemo(
    () =>
      games.filter(
        (g) => g.photoNight && (level === "all" || g.level === level)
      ),
    [level]
  );
  const repeatedOpponents = useMemo(() => {
    const counts = new Map<string, number>();
    for (const g of levelGames) {
      const key = `${g.level}:${g.opponent}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const repeated = new Set<string>();
    counts.forEach((n, key) => {
      if (n > 1) repeated.add(key);
    });
    return repeated;
  }, [levelGames]);

  const groups = useMemo(() => {
    let list = photos;
    if (level !== "all") list = list.filter((p) => p.level === level);
    if (game !== "all") list = list.filter((p) => p.game === game);
    if (favOnly) list = list.filter((p) => favorites.includes(p.id));
    return searchPhotoGroups(list, q);
  }, [photos, q, level, game, favOnly, favorites]);
  const shown = groups.reduce((n, g) => n + g.photos.length, 0);

  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Every home frame</div>
          <h1 className="display lg">
            THE <span className="orange">PHOTOS</span>
          </h1>
          <hr className="rule" />
          <p>
            Varsity and JV are separate games. One photo is $1. One game is $10.
            Both games from the same night are $20. Previews stay marked.
          </p>
        </div>
        <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          {shown} / {photos.length} frames
        </div>
      </div>

      <PackOffers />

      <div className="search-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search #3, Martens, Golden Sierra, JV…"
          aria-label="Search photos"
        />
      </div>
      {q && groups.length === 1 && groups[0].label && (
        <p className="search-note">
          {groups[0].photos.length} frames · {groups[0].label}
        </p>
      )}
      {q && groups.length === 0 && (
        <p className="search-note">No frames match that search.</p>
      )}

      <div className="filters">
        <button
          className={level === "all" ? "chip on" : "chip"}
          onClick={() => {
            setLevel("all");
            setGame("all");
          }}
        >
          All teams
        </button>
        <button
          className={level === "varsity" ? "chip on" : "chip"}
          onClick={() => {
            setLevel("varsity");
            setGame("all");
          }}
        >
          Varsity
        </button>
        <button
          className={level === "jv" ? "chip on" : "chip"}
          onClick={() => {
            setLevel("jv");
            setGame("all");
          }}
        >
          JV
        </button>
      </div>

      <div className="filters">
        <button className={game === "all" ? "chip on" : "chip"} onClick={() => setGame("all")}>
          All albums
        </button>
        {levelGames.map((g) => (
          <button
            key={g.slug}
            className={game === g.slug ? "chip on" : "chip"}
            onClick={() => setGame(g.slug)}
          >
            {level === "all" ? `${levelLabel(g.level)} · ` : ""}
            {g.opponent}
            {repeatedOpponents.has(`${g.level}:${g.opponent}`) ? ` · ${chipDate(g.date)}` : ""}
          </button>
        ))}
        <button className={favOnly ? "chip on" : "chip"} onClick={() => setFavOnly((v) => !v)}>
          ♥ Saved
        </button>
      </div>

      {groups.map((g) => (
        <section key={g.key}>
          {groups.length > 1 && g.label && (
            <h2 className="search-group">
              {g.label} · {g.photos.length}
            </h2>
          )}
          <PhotoGrid photos={g.photos} />
        </section>
      ))}
    </main>
  );
}
