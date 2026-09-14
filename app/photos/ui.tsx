"use client";

import { useMemo, useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotos } from "@/components/PhotoProvider";
import { games, levelLabel } from "@/lib/data";
import { searchPhotos } from "@/lib/photos";
import type { TeamLevel } from "@/lib/types";

export default function GalleryClient() {
  const { photos, favorites } = usePhotos();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<"all" | TeamLevel>("all");
  const [game, setGame] = useState("all");
  const [favOnly, setFavOnly] = useState(false);

  const levelGames = useMemo(
    () =>
      games.filter(
        (g) => g.photoNight && (level === "all" || g.level === level)
      ),
    [level]
  );

  const filtered = useMemo(() => {
    let list = searchPhotos(photos, q);
    if (level !== "all") list = list.filter((p) => p.level === level);
    if (game !== "all") list = list.filter((p) => p.game === game);
    if (favOnly) list = list.filter((p) => favorites.includes(p.id));
    return list;
  }, [photos, q, level, game, favOnly, favorites]);

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
            Varsity and JV are separate boards. Search a jersey, a last name, or
            a game, then save the original — not a compressed copy.
          </p>
        </div>
        <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          {filtered.length} / {photos.length} frames
        </div>
      </div>

      <div className="search-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search #3, Martens, Golden Sierra, JV…"
        />
      </div>

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
          </button>
        ))}
        <button className={favOnly ? "chip on" : "chip"} onClick={() => setFavOnly((v) => !v)}>
          ♥ Saved
        </button>
      </div>

      <PhotoGrid photos={filtered} />
    </main>
  );
}
