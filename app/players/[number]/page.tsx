import Link from "next/link";
import { notFound } from "next/navigation";
import Jersey from "@/components/Jersey";
import { playerByNumber, players } from "@/lib/data";
import PlayerFilm from "./ui";

export function generateStaticParams() {
  return players.map((p) => ({ number: String(p.number) }));
}

export function generateMetadata({ params }: { params: { number: string } }) {
  const p = playerByNumber(Number(params.number));
  return { title: p ? `#${p.number} ${p.first} ${p.last}` : "Player" };
}

export default function PlayerPage({ params }: { params: { number: string } }) {
  const player = playerByNumber(Number(params.number));
  if (!player) notFound();

  const mates = players.filter(
    (p) =>
      p.number !== player.number &&
      p.positions.some((pos) => player.positions.includes(pos))
  ).slice(0, 6);

  return (
    <main className="section">
      <Link href="/players" className="kicker">
        ← Full roster
      </Link>
      <div className="player-hero" style={{ marginTop: 24 }}>
        <Jersey player={player} huge />
        <div>
          <div className="kicker">
            {player.grade} · {player.positions.join(" / ")}
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
            Search this number in the photos. Families can download any tagged
            original at full resolution.
          </p>
        </div>
      </div>
      <section style={{ marginTop: 48 }}>
        <h2 className="display md">FRAMES WITH #{player.number}</h2>
        <PlayerFilm number={player.number} />
      </section>
      {mates.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 className="display md">SAME SIDE OF THE BALL</h2>
          <div className="roster-grid">
            {mates.map((p) => (
              <Link key={p.number} href={`/players/${p.number}`}>
                <Jersey player={p} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
