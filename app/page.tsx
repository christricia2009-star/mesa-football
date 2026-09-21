import Link from "next/link";
import { formatGameDate, games, homecomingLive, levelLabel, nextHomeGame, school } from "@/lib/data";
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
          <img
            src="/gallery/tunnel-longhorn-hero.jpg"
            alt="Green and orange Mavericks inflatable tunnel on the field, WELCOME TO THE CHUTE across the bleachers"
          />
        </div>
        <div className="hero-shade" />
        <PhotoCredit />
        <div className="hero-content">
          <div className="kicker">
            {school.city} · {school.league} · {school.season}
          </div>
          <h1 className="display xl">
            MESA VERDE
            <br />
            <span className="orange">MAVERICKS</span>
          </h1>
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
        <div className="lead-credit">Lead frame · the tunnel</div>
      </section>

      <div className="marquee" aria-hidden>
        <span>
          {school.motto} · {homecomingLive() ? "HOMECOMING WEEK · " : ""}
          FOREST GREEN & ORANGE · {school.stadium.toUpperCase()} · {school.hashtag} ·{" "}
          {homecomingLive() ? "RALLY FRIDAY · DANCE SATURDAY · " : ""}
          ONCE A MAVERICK ALWAYS A MAVERICK · {school.motto} ·{" "}
          {homecomingLive() ? "HOMECOMING WEEK · " : ""}
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
