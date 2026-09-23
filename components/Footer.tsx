import Link from "next/link";
import { facebookPage, photographer, school, social } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <img
            src="/brand/maverick-crest.jpg"
            alt=""
            width={72}
            height={72}
            style={{ borderRadius: "50%", border: "2px solid var(--orange-500)", objectFit: "cover" }}
          />
          <h3 className="display md" style={{ margin: "16px 0 8px" }}>
            MESA VERDE
            <br />
            <span className="orange">MAVERICKS</span>
          </h3>
          <p style={{ color: "var(--muted)", maxWidth: 360 }}>
            {school.stadium}, {school.city}. Home game photography for families.
            Previews are marked. Clean originals are $1 each, $10 for one game, or $20 for the whole night.
          </p>
          <p style={{ color: "var(--muted)", maxWidth: 360 }}>
            Frames by{" "}
            <a href={photographer.href} target="_blank" rel="noreferrer">
              {photographer.handle}
            </a>
            .
          </p>
          <p style={{ color: "var(--orange-400)", letterSpacing: "0.12em", fontSize: 13 }}>
            {school.motto}
          </p>
        </div>
        <div>
          <h4>On this site</h4>
          <Link href="/photos">Photos</Link>
          <Link href="/games">Game albums</Link>
          <Link href="/players">Get to know the roster</Link>
          <Link href="/poll">Player of the Week</Link>
          <Link href="/schedule">2026 schedule</Link>
          <Link href="/fundraisers">Fundraisers</Link>
        </div>
        <div>
          <h4>Follow the photos</h4>
          <a href={facebookPage.href} target="_blank" rel="noreferrer">
            Facebook · {facebookPage.name}
          </a>
          <p style={{ color: "var(--muted)", margin: "8px 0 0" }}>{facebookPage.note}</p>
        </div>
        <div>
          <h4>We don’t manage these</h4>
          {social.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
              {s.name} · {s.handle}
            </a>
          ))}
        </div>
        <div>
          <h4>Campus</h4>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            {school.address}
            <br />
            {school.phone}
            <br />
            AD {school.athleticDirector}
          </p>
          <a href={school.ticketsUrl} target="_blank" rel="noreferrer">
            Buy tickets on GoFan
          </a>
          <a href={school.schoolUrl} target="_blank" rel="noreferrer">
            School website
          </a>
          <a href={school.juniorMavsUrl} target="_blank" rel="noreferrer">
            Junior Mavericks
          </a>
        </div>
      </div>
      <div className="legal">
        <span>
          Independent parent photography site · not an official San Juan Unified page ·{" "}
          {school.hashtag}
        </span>
        <span>
          Frames by{" "}
          <a href={photographer.href} target="_blank" rel="noreferrer">
            {photographer.handle}
          </a>
          . Clean originals are $1, $10 a game, or $20 a night, with no watermark.
        </span>
      </div>
    </footer>
  );
}
