import BookedScreen from "./ui";

export const metadata = { title: "Shoot booked" };

export default function BookedPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id || "";
  if (!sessionId) {
    return (
      <main className="section">
        <h1 className="display lg">SHOOT</h1>
        <p className="cart-note">This page needs the link from checkout.</p>
      </main>
    );
  }
  return <BookedScreen sessionId={sessionId} />;
}
