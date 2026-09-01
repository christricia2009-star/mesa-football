"use client";

import { useMemo, useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import { usePhotos } from "@/components/PhotoProvider";
import { games } from "@/lib/data";
import { searchPhotos } from "@/lib/photos";

export default function GalleryClient() {
  const { photos, favorites } = usePhotos();
  const [q, setQ] = useState("");
  const [game, setGame] = useState("all");
  const [favOnly, setFavOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = searchPhotos(photos, q);
    if (game !== "all") list = list.filter((p) => p.game === game);
    if (favOnly) list = list.filter((p) => favorites.includes(p.id));
    return list;
  }, [photos, q, game, favOnly, favorites]);

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
            Search a jersey, a last name, or a game. Click any frame for the
            lightbox — then save the original, not a compressed copy.
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
          placeholder="Search #13, Weldy, Golden Sierra…"
        />
      </div>

      <div className="filters">
        <button className={game === "all" ? "chip on" : "chip"} onClick={() => setGame("all")}>
          All albums
        </button>
        {games
          .filter((g) => g.photoNight)
          .map((g) => (
            <button
              key={g.slug}
              className={game === g.slug ? "chip on" : "chip"}
              onClick={() => setGame(g.slug)}
            >
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
