import { notFound } from "next/navigation";
import { formatGameDate, gameBySlug, games } from "@/lib/data";
import GameAlbum from "./ui";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const g = gameBySlug(params.slug);
  return { title: g ? `${g.location === "home" ? "vs" : "@"} ${g.opponent}` : "Album" };
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = gameBySlug(params.slug);
  if (!game) notFound();

  return (
    <main>
      <section className="hero" style={{ minHeight: "54vh" }}>
        <div className="hero-media">
          <img src={game.cover} alt="" />
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="kicker">
            {formatGameDate(game.date)} · {game.kickoff} · {game.venue}
          </div>
          <h1 className="display lg">
            {game.location === "home" ? "VS" : "@"}{" "}
            <span className="orange">{game.opponent.toUpperCase()}</span>
          </h1>
          <p className="lede" style={{ marginBottom: 12 }}>
            {game.mascot}
            {game.league ? " · Sierra Delta League" : " · Non-league"}
            {game.result ? ` · ${game.result}` : ""}
            {!game.confirmed ? " · Date TBA — confirm with the league calendar" : ""}
          </p>
          {game.note && <p style={{ color: "var(--muted)" }}>{game.note}</p>}
        </div>
      </section>
      <GameAlbum slug={game.slug} photoNight={game.photoNight} />
    </main>
  );
}
