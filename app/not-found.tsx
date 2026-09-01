import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section" style={{ minHeight: "60vh" }}>
      <div className="kicker">Incomplete pass</div>
      <h1 className="display lg">
        404 · <span className="orange">OUT OF BOUNDS</span>
      </h1>
      <p className="lede">That page isn’t on the call sheet.</p>
      <Link href="/" className="pill orange">
        Back to the stadium
      </Link>
    </main>
  );
}
