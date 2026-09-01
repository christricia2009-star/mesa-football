import Link from "next/link";
import { formatGameDate, games, levelLabel, nextHomeGame, school } from "@/lib/data";
import HomeFilm from "@/components/HomeFilm";

export default function HomePage() {
  const next = nextHomeGame();
  const photoNights = games.filter((g) => g.photoNight && g.slug !== "bye-week");

  return (
    <main>
      <section className="hero hero-lead">
        <div className="hero-content">
          <div className="kicker">
            {school.city} · {school.league} · {school.season}
          </div>
          <h1 className="display xl">
            MESA VERDE
            <br />
            <span className="orange">MAVERICKS</span>
          </h1>
          <p className="lede">
            Friday night photos from the house that waited 48 years. Home-game
            frames, tagged by jersey, searchable by family, downloadable at the
            original resolution. No watermark. No cart. Just the night.
          </p>
          <div className="hero-row">
            <Link href="/photos" className="pill orange">
              View photos
            </Link>
            <Link href="/players" className="pill">
              Get to know the roster
            </Link>
            {next && (
              <div className="next-game">
                <div>
                  <div className="kicker" style={{ margin: 0 }}>
                    Next photo night
                  </div>
                  <strong>
                    vs {next.opponent} · {formatGameDate(next.date)}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hero-media">
          <img
            src="/gallery/tunnel-longhorn.jpg"
            alt="Mesa Verde Mavericks inflatable tunnel with the longhorn, smoke rolling onto the field"
          />
          <div className="lead-credit">Lead frame · the tunnel</div>
        </div>
      </section>

      <div className="marquee" aria-hidden>
        <span>
          {school.motto} · FOREST GREEN & ORANGE · {school.stadium.toUpperCase()} ·{" "}
          {school.hashtag} · ONCE A MAVERICK ALWAYS A MAVERICK · {school.motto} ·
          FOREST GREEN & ORANGE · {school.hashtag} ·&nbsp;
        </span>
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">The house</div>
            <h2 className="display lg">
              A STADIUM THAT
              <br />
              <span className="orange">FINALLY CAME HOME</span>
            </h2>
            <hr className="rule" />
          </div>
          <p>
            {school.stadiumNote} Green bleachers. Orange track. LED lights. This
            site is the family archive of what happens under them.
          </p>
        </div>
        <HomeFilm />
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="section-head">
          <div>
            <div className="kicker">Home Fridays</div>
            <h2 className="display md">PHOTO NIGHTS</h2>
          </div>
          <Link href="/schedule" className="pill">
            Full schedule
          </Link>
        </div>
        <div className="sked">
          {photoNights.map((g) => (
            <Link key={g.slug} href={`/games/${g.slug}`} className="sked-row home">
              <div className="when">{formatGameDate(g.date)}</div>
              <div>
                <strong>
                  {levelLabel(g.level)} vs {g.opponent} {g.mascot}
                </strong>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>{g.venue}</div>
              </div>
              <div>
                {g.league && <span className="badge">League</span>}{" "}
                {g.confirmed ? <span className="badge">Locked</span> : <span className="badge">TBA</span>}
              </div>
              <div>{g.result || g.kickoff}</div>
              <div>
                <span className="badge photo">Photo night</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
