import Link from "next/link";
import { facebookPage, photographer } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 className="display md" style={{ margin: "0 0 8px" }}>
            FOOTBALL
            <br />
            <span className="orange">EVENTS</span>
          </h3>
          <p className="brand-script" style={{ color: "var(--ink)", marginTop: 0 }}>
            by {photographer.handle}
          </p>
          <p style={{ color: "var(--muted)", maxWidth: 360 }}>
            Game nights and 1-1 sessions. Previews are marked. Clean originals are $1 each,
            $10 for one game, or $20 for the whole night.
          </p>
        </div>
        <div>
          <h4>On this site</h4>
          <Link href="/photos">Photos</Link>
          <Link href="/shoots">1-1 shoots</Link>
          <Link href="/games">Game albums</Link>
          <Link href="/players">Roster</Link>
          <Link href="/poll">Player of the Week</Link>
          <Link href="/schedule">Schedule</Link>
        </div>
        <div>
          <h4>The studio</h4>
          <a href="https://www.truefamilyphotography.com/" target="_blank" rel="noreferrer">
            truefamilyphotography.com
          </a>
          <a href={photographer.href} target="_blank" rel="noreferrer">
            Instagram · {photographer.handle}
          </a>
          <a href={facebookPage.href} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <div className="legal">
        <span>Football Events by {photographer.handle}</span>
        <span>Clean originals are $1, $10 a game, or $20 a night, with no watermark.</span>
      </div>
    </footer>
  );
}
