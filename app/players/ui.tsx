"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Jersey from "@/components/Jersey";
import { levelLabel, playerHref, players, staff } from "@/lib/data";
import type { TeamLevel } from "@/lib/types";

const groups = [
  { label: "Skill", test: (p: string[]) => p.some((x) => ["QB", "RB", "WR", "ATH"].includes(x)) },
  { label: "Front seven", test: (p: string[]) => p.some((x) => ["DE", "DT", "DL", "OLB", "ILB", "LB"].includes(x)) },
  { label: "Secondary", test: (p: string[]) => p.some((x) => ["CB", "S", "SS", "DB"].includes(x)) },
  { label: "O-line", test: (p: string[]) => p.some((x) => ["C", "OG", "OT", "OL"].includes(x)) },
];

export default function RosterBoard() {
  const [level, setLevel] = useState<TeamLevel>("varsity");
  const roster = useMemo(
    () => players.filter((p) => p.level === level).sort((a, b) => a.number - b.number),
    [level]
  );
  const coaches = staff.filter((s) => s.level === level);
  const grouped = groups
    .map((g) => ({
      ...g,
      people: roster.filter((p) => g.test(p.positions)),
    }))
    .filter((g) => g.people.length > 0);
  const ungrouped = roster.filter((p) => !p.positions.length);

  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Get to know your Mavericks</div>
          <h1 className="display lg">
            THE <span className="orange">ROSTER</span>
          </h1>
          <hr className="rule" />
          <p>
            Varsity and JV are separate boards from MaxPreps. Click a jersey to
            see every tagged frame for that level.
          </p>
        </div>
      </div>

      <div className="filters">
        <button
          className={level === "varsity" ? "chip on" : "chip"}
          onClick={() => setLevel("varsity")}
        >
          Varsity
        </button>
        <button
          className={level === "jv" ? "chip on" : "chip"}
          onClick={() => setLevel("jv")}
        >
          JV
        </button>
      </div>

      {grouped.map((g) => (
        <section key={g.label} style={{ marginBottom: 48 }}>
          <h2 className="display md">{g.label.toUpperCase()}</h2>
          <div className="roster-grid">
            {g.people.map((p) => (
              <Link key={`${p.level}-${p.number}`} href={playerHref(p)}>
                <Jersey player={p} />
              </Link>
            ))}
          </div>
        </section>
      ))}

      {ungrouped.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <h2 className="display md">{levelLabel(level).toUpperCase()} BOARD</h2>
          <div className="roster-grid">
            {ungrouped.map((p) => (
              <Link key={`${p.level}-${p.number}`} href={playerHref(p)}>
                <Jersey player={p} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="display md">{levelLabel(level).toUpperCase()} STAFF</h2>
        <div className="roster-grid">
          {coaches.map((s) => (
            <div key={s.name} className="jersey-card" style={{ minHeight: 140 }}>
              <div className="jersey-name">{s.name}</div>
              <div className="jersey-pos">{s.role}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
