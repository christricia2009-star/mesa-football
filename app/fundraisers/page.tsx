import GuardedImage from "@/components/GuardedImage";
import PhotoCredit from "@/components/PhotoCredit";
import { facebookPage, fundraisers, photographer } from "@/lib/data";
import { thumbSrc } from "@/lib/utils";

export const metadata = { title: "Fundraisers" };

export default function FundraisersPage() {
  return (
    <main>
      <section className="hero" style={{ minHeight: "46vh" }}>
        <div className="hero-media">
          <GuardedImage src={thumbSrc("/gallery/take-the-field.jpg")} alt="Team taking the field" />
        </div>
        <div className="hero-shade" />
        <PhotoCredit />
        <div className="hero-content">
          <div className="kicker">Boost the program</div>
          <h1 className="display lg">
            FRIDAY NIGHT
            <br />
            <span className="orange">DOESN’T RUN ITSELF</span>
          </h1>
          <p className="lede">
            Meals, banners, and the snack bar. Photo sales on this site are separate:
            $1 a frame, $10 a game, $20 a night.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="raise-grid">
          {fundraisers.map((f) => (
            <article key={f.slug} className="raise-card">
              <div className="status">{f.status} · {f.when}</div>
              <h3>{f.title}</h3>
              <p>{f.summary}</p>
              <p style={{ color: "var(--muted)" }}>{f.how}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--orange-300)" }}>
                {f.contact}
              </p>
            </article>
          ))}
        </div>
        <div className="raise-card" style={{ marginTop: 16 }}>
          <div className="status">Elsewhere</div>
          <h3>THE STUDIO</h3>
          <p>
            Questions about photos go to{" "}
            <a href={photographer.href} target="_blank" rel="noreferrer" style={{ color: "var(--orange-400)" }}>
              {photographer.handle}
            </a>{" "}
            or{" "}
            <a href={facebookPage.href} target="_blank" rel="noreferrer" style={{ color: "var(--orange-400)" }}>
              Facebook
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
