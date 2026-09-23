import SuccessScreen from "./ui";

export const metadata = { title: "Downloads" };

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id || "";
  if (!sessionId) {
    return (
      <main className="section">
        <h1 className="display lg">DOWNLOADS</h1>
        <p style={{ color: "var(--muted)" }}>This page needs the link from checkout.</p>
      </main>
    );
  }
  return <SuccessScreen sessionId={sessionId} />;
}
