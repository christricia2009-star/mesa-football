import { fundraisers, school, social } from "@/lib/data";
import { thumbSrc } from "@/lib/utils";

export const metadata = { title: "Fundraisers" };

export default function FundraisersPage() {
  return (
    <main>
      <section className="hero" style={{ minHeight: "46vh" }}>
        <div className="hero-media">
          <img src={thumbSrc("/gallery/take-the-field.jpg")} alt="Mavericks taking the field" />
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="kicker">Boost the program</div>
          <h1 className="display lg">
            FRIDAY NIGHT
            <br />
            <span className="orange">DOESN’T RUN ITSELF</span>
          </h1>
          <p className="lede">
            Meals, banners, the snack bar, the photos. Every dollar stays in Citrus
            Heights. This page is the booster board — not a payment processor.
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
          <h3>THE ACCOUNTS WE DON’T RUN</h3>
          <p>
            School athletics lives on Instagram, Facebook, and X. We link them so
            families can follow — we do not post there, and this site is not an
            official district page.
          </p>
          <p>
            {social.map((s) => (
              <span key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" style={{ color: "var(--orange-400)" }}>
                  {s.name} {s.handle}
                </a>
                {" · "}
              </span>
            ))}
          </p>
          <p style={{ color: "var(--muted)" }}>
            Questions for the athletic office: {school.athleticDirector} ·{" "}
            {school.athleticDirectorEmail} · {school.phone}
          </p>
        </div>
      </section>
    </main>
  );
}
