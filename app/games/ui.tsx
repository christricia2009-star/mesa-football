"use client";

import { useState } from "react";
import Link from "next/link";
import { formatGameDate, games, levelLabel } from "@/lib/data";
import { thumbSrc } from "@/lib/utils";
import type { TeamLevel } from "@/lib/types";

export default function GamesBoard() {
  const [level, setLevel] = useState<"all" | TeamLevel>("all");
  const list = games.filter((g) => level === "all" || g.level === level);

  return (
    <>
      <div className="filters">
        <button className={level === "all" ? "chip on" : "chip"} onClick={() => setLevel("all")}>
          All teams
        </button>
        <button className={level === "varsity" ? "chip on" : "chip"} onClick={() => setLevel("varsity")}>
          Varsity
        </button>
        <button className={level === "jv" ? "chip on" : "chip"} onClick={() => setLevel("jv")}>
          JV
        </button>
      </div>
      <div className="filmstrip" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {list.map((g) => (
          <Link key={g.slug} href={`/games/${g.slug}`}>
            <figure className="shot" style={{ minHeight: 280 }}>
              <img src={thumbSrc(g.cover)} alt="" />
              <span className="tag">{levelLabel(g.level)}</span>
              <figcaption>
                <div className="kicker" style={{ marginBottom: 4 }}>
                  {formatGameDate(g.date)} · {g.location === "home" ? "HOME" : "AWAY"}
                </div>
                {g.location === "home" ? "vs" : "@"} {g.opponent}
                {g.result ? ` · ${g.result}` : ""}
              </figcaption>
            </figure>
          </Link>
        ))}
      </div>
    </>
  );
}
