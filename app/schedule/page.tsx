import Link from "next/link";
import { formatGameDate, games, levelLabel, school } from "@/lib/data";

export const metadata = { title: "2026 Schedule" };

export default function SchedulePage() {
  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">
            {school.season} · {school.league} · {school.section}
          </div>
          <h1 className="display lg">
            THE <span className="orange">BOARD</span>
          </h1>
          <hr className="rule" />
          <p>
            Varsity and JV share the Friday board. Confirmed dates are locked
            from the 2026 slate. Orange rows are home photo nights.
          </p>
        </div>
        <a className="pill" href={school.maxPrepsUrl} target="_blank" rel="noreferrer">
          MaxPreps
        </a>
      </div>
      <div className="sked">
        {games.map((g) => (
          <Link
            key={g.slug}
            href={`/games/${g.slug}`}
            className={g.location === "home" && g.photoNight ? "sked-row home" : "sked-row"}
          >
            <div className="when">{formatGameDate(g.date)}</div>
            <div>
              <strong>
                {levelLabel(g.level)} · {g.location === "home" ? "vs" : "@"} {g.opponent} {g.mascot}
              </strong>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{g.venue}</div>
            </div>
            <div>
              {g.league && <span className="badge">League</span>}{" "}
              {g.location === "home" ? (
                <span className="badge home">Home</span>
              ) : (
                <span className="badge">Away</span>
              )}
            </div>
            <div>{g.result || g.kickoff}</div>
            <div>
              {g.photoNight ? (
                <span className="badge photo">Photo night</span>
              ) : g.confirmed ? (
                <span className="badge">Locked</span>
              ) : (
                <span className="badge">TBA</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      <p style={{ color: "var(--muted)", marginTop: 28, maxWidth: 680 }}>
        Tickets:{" "}
        <a href={school.ticketsUrl} style={{ color: "var(--orange-400)" }}>
          GoFan
        </a>
        . Kickoff times default to 7:00 PM. Gates typically 5:30. The photographer
        is on the home sideline and in the end zone — look for the green lanyard.
      </p>
    </main>
  );
}
