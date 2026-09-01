import Link from "next/link";
import Jersey from "@/components/Jersey";
import { players, staff } from "@/lib/data";

export const metadata = { title: "Get to Know the Roster" };

export default function PlayersPage() {
  const groups = [
    { label: "Skill", test: (p: string[]) => p.some((x) => ["QB", "RB", "WR", "ATH"].includes(x)) },
    { label: "Front seven", test: (p: string[]) => p.some((x) => ["DE", "DT", "DL", "OLB", "ILB", "LB"].includes(x)) },
    { label: "Secondary", test: (p: string[]) => p.some((x) => ["CB", "S", "SS", "DB"].includes(x)) },
    { label: "O-line", test: (p: string[]) => p.some((x) => ["C", "OG", "OT", "OL"].includes(x)) },
  ];

  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Get to know your Mavericks</div>
          <h1 className="display lg">
            THE <span className="orange">ROSTER</span>
          </h1>
          <hr className="rule" />
          <p>
            2026 varsity board from MaxPreps. Click a jersey to see every tagged
            frame. Faces live in the photos — the cards stay numbers, so the site
            stays about the kids without putting portraits on a public homepage.
          </p>
        </div>
      </div>

      {groups.map((g) => {
        const set = players.filter((p) => g.test(p.positions));
        const seen = new Set<number>();
        const unique = set.filter((p) => {
          if (seen.has(p.number)) return false;
          seen.add(p.number);
          return true;
        });
        return (
          <section key={g.label} style={{ marginBottom: 48 }}>
            <h2 className="display md">{g.label.toUpperCase()}</h2>
            <div className="roster-grid">
              {unique.map((p) => (
                <Link key={p.number} href={`/players/${p.number}`}>
                  <Jersey player={p} />
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section>
        <h2 className="display md">THE STAFF</h2>
        <p style={{ color: "var(--muted)", maxWidth: 560 }}>
          Head Coach Brett Tujague — also VP of Athletics. A new era in Maverick
          football, built in the trenches. {staff.length} names on the MaxPreps staff card.
        </p>
        <div className="roster-grid">
          {staff.map((s) => (
            <div key={s.name} className="jersey-card" style={{ minHeight: 140 }}>
              <div className="jersey-name">{s.name}</div>
              <div className="jersey-pos">{s.role}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
