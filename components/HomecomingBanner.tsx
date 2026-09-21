import Link from "next/link";
import { homecomingLive, school } from "@/lib/data";

export default function HomecomingBanner() {
  if (!homecomingLive()) return null;

  return (
    <aside className="hc-banner" aria-label="Homecoming week">
      <div className="hc-lockup">
        <div className="kicker">Spirit week · live now</div>
        <h2 className="display hc-title">
          HOMECOMING
          <span className="orange"> WEEK</span>
        </h2>
        <p>Wear the green. Wear the orange. {school.hashtag}</p>
      </div>
      <ul className="hc-events">
        <li>
          <strong>Friday · Rally</strong>
          Sep 25 · 11:20 AM
        </li>
        <li>
          <strong>Friday · The game</strong>
          vs Lindhurst · 7:00 PM · Maverick Stadium
        </li>
        <li>
          <strong>Saturday · The dance</strong>
          Sep 26 · 7:00 PM
        </li>
      </ul>
      <Link href="/games/vs-lindhurst" className="pill orange">
        Be there
      </Link>
    </aside>
  );
}
