import Link from "next/link";
import { formatGameDate, games, levelLabel, nextHomeGame, photographer } from "@/lib/data";
import GuardedImage from "@/components/GuardedImage";
import HomeFilm from "@/components/HomeFilm";
import PhotoCredit from "@/components/PhotoCredit";

export default function HomePage() {
  const next = nextHomeGame();
  const photoNights = games.filter(
    (g) => g.location === "home" && g.photoNight && g.slug !== "bye-week"
  );

  return (
    <main>
      <section className="hero hero-lead">
        <div className="hero-media">
          <GuardedImage
            src="/gallery/kickoff.jpg"
            alt="Kickoff on a Friday night"
          />
        </div>
        <div className="hero-shade" />
        <PhotoCredit />
        <div className="hero-content">
          <div className="kicker">Northern California · {photographer.handle}</div>
          <h1 className="display xl">
            SPORTING
            <br />
            <span className="orange">EVENTS</span>
          </h1>
          <p className="brand-script">by {photographer.handle}</p>
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
        <div className="lead-credit">Lead frame · kickoff</div>
      </section>

      <div className="marquee" aria-hidden>
        <span>
          SPORTING EVENTS · {photographer.handle.toUpperCase()} · $1 A PHOTO · $10 A GAME · $20 A
          NIGHT · 1-1 SHOOTS · SPORTING EVENTS · {photographer.handle.toUpperCase()} ·&nbsp;
        </span>
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">From the sideline</div>
            <h2 className="display lg">
              FRIDAY NIGHT
              <br />
              <span className="orange">FRAMES</span>
            </h2>
            <hr className="rule" />
          </div>
          <p>
            Buy one photo at a time, or the entire game for $10. Previews have a
            watermark. Downloads will be clean.
          </p>
        </div>
        <HomeFilm />
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="section-head">
          <div>
            <div className="kicker">Your vote · their title</div>
            <h2 className="display md">
              PLAYER OF THE <span className="orange">WEEK</span>
            </h2>
            <hr className="rule" />
            <p>
              Varsity and JV each have a ballot from Friday’s frames. Sign up
              with an email — one account, one vote per board.
            </p>
          </div>
          <Link href="/poll" className="pill orange">
            Vote now
          </Link>
        </div>
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
                {g.homecoming && <span className="badge photo">Homecoming</span>}{" "}
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
