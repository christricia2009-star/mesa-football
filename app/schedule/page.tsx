import Link from "next/link";
import { formatGameDate, games, levelLabel } from "@/lib/data";

export const metadata = { title: "2026 Schedule" };

export default function SchedulePage() {
  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">2026 season</div>
          <h1 className="display lg">
            THE <span className="orange">BOARD</span>
          </h1>
          <hr className="rule" />
          <p>
            Varsity and JV share the Friday board. Highlighted rows are home photo nights.
          </p>
        </div>
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
              {g.homecoming && <span className="badge photo">Homecoming</span>}{" "}
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
        Kickoff times default to 7:00 PM. The photographer works the home sideline and the end zone.
      </p>
    </main>
  );
}
