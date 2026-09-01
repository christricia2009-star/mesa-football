import Link from "next/link";
import { notFound } from "next/navigation";
import Jersey from "@/components/Jersey";
import { levelLabel, playerByNumber, playerHref, players } from "@/lib/data";
import type { TeamLevel } from "@/lib/types";
import PlayerFilm from "./ui";

function asLevel(value: string): TeamLevel | null {
  return value === "varsity" || value === "jv" ? value : null;
}

export function generateStaticParams() {
  return players.map((p) => ({ level: p.level, number: String(p.number) }));
}

export function generateMetadata({
  params,
}: {
  params: { level: string; number: string };
}) {
  const level = asLevel(params.level);
  const p = level ? playerByNumber(Number(params.number), level) : undefined;
  return {
    title: p ? `${levelLabel(p.level)} #${p.number} ${p.first} ${p.last}` : "Player",
  };
}

export default function PlayerPage({
  params,
}: {
  params: { level: string; number: string };
}) {
  const level = asLevel(params.level);
  if (!level) notFound();
  const player = playerByNumber(Number(params.number), level);
  if (!player) notFound();

  const mates = players
    .filter(
      (p) =>
        p.level === player.level &&
        p.number !== player.number &&
        p.positions.some((pos) => player.positions.includes(pos))
    )
    .slice(0, 6);

  return (
    <main className="section">
      <Link href="/players" className="kicker">
        ← {levelLabel(player.level)} roster
      </Link>
      <div className="player-hero" style={{ marginTop: 24 }}>
        <Jersey player={player} huge />
        <div>
          <div className="kicker">
            {levelLabel(player.level)} · {player.grade}
            {player.positions.length ? ` · ${player.positions.join(" / ")}` : ""}
          </div>
          <h1 className="display lg">
            {player.first.toUpperCase()}
            <br />
            <span className="orange">{player.last.toUpperCase()}</span>
          </h1>
          <p className="lede">{player.blurb}</p>
          <div className="stat-row">
            <div>
              <span>No.</span>
              <strong>{player.number}</strong>
            </div>
            <div>
              <span>Height</span>
              <strong>{player.height}</strong>
            </div>
            <div>
              <span>Weight</span>
              <strong>{player.weight}</strong>
            </div>
            <div>
              <span>Class</span>
              <strong>{player.grade}</strong>
            </div>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Photos tagged to this {levelLabel(player.level).toLowerCase()} jersey.
            Families can download any original at full resolution.
          </p>
        </div>
      </div>
      <section style={{ marginTop: 48 }}>
        <h2 className="display md">
          {levelLabel(player.level).toUpperCase()} FRAMES WITH #{player.number}
        </h2>
        <PlayerFilm number={player.number} level={player.level} />
      </section>
      {mates.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 className="display md">SAME SIDE OF THE BALL</h2>
          <div className="roster-grid">
            {mates.map((p) => (
              <Link key={`${p.level}-${p.number}`} href={playerHref(p)}>
                <Jersey player={p} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
