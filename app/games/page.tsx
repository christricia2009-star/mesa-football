import Link from "next/link";
import { formatGameDate, games } from "@/lib/data";

export const metadata = { title: "Game Albums" };

export default function GamesPage() {
  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Albums</div>
          <h1 className="display lg">
            GAME <span className="orange">NIGHTS</span>
          </h1>
          <hr className="rule" />
          <p>
            One album per Friday. Home games are photo nights. Away games stay
            on the board so the season reads as a single story.
          </p>
        </div>
      </div>
      <div className="filmstrip" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {games.map((g) => (
          <Link key={g.slug} href={`/games/${g.slug}`}>
            <figure className="shot" style={{ minHeight: 280 }}>
              <img src={g.cover} alt="" />
              {g.photoNight && <span className="tag">Photo night</span>}
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
    </main>
  );
}
