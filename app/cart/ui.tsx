"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import GuardedImage from "@/components/GuardedImage";
import { useCart } from "@/components/CartProvider";
import { usePhotos } from "@/components/PhotoProvider";
import { formatDollars, GAME_PRICE_LABEL, NIGHT_PRICE_LABEL, quoteCart } from "@/lib/shop";
import type { Photo } from "@/lib/types";
import { thumbSrc } from "@/lib/utils";

export default function CartScreen() {
  const { photos } = usePhotos();
  const { ids, games, nights, remove, removeGame, removeNight, clear } = useCart();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState<{ sessionId: string; count: number; created: number }[]>([]);

  const quote = useMemo(() => quoteCart(ids, games, nights, photos), [ids, games, nights, photos]);
  const photosById = useMemo(() => {
    const byId = new Map<string, Photo>();
    photos.forEach((photo) => byId.set(photo.id, photo));
    return byId;
  }, [photos]);

  async function checkout() {
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, games, nights }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Checkout did not start.");
        setPending(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Checkout did not start.");
      setPending(false);
    }
  }

  async function findOrders(e: React.FormEvent) {
    e.preventDefault();
    setLookup("");
    setFound([]);
    const res = await fetch("/api/checkout/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as {
      error?: string;
      orders?: { sessionId: string; count: number; created: number }[];
    };
    if (!res.ok) {
      setLookup(data.error || "Lookup failed.");
      return;
    }
    if (!data.orders?.length) {
      setLookup("No paid orders for that email.");
      return;
    }
    setFound(data.orders);
  }

  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Clean originals</div>
          <h1 className="display lg">
            YOUR <span className="orange">CART</span>
          </h1>
          <hr className="rule" />
          <p className="cart-note">
            $1 a photo, {GAME_PRICE_LABEL} for every photo from one JV or varsity game, and{" "}
            {NIGHT_PRICE_LABEL} for both games on the same night. After payment the clean files
            download with no watermark.
          </p>
        </div>
      </div>

      {quote.lines.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          Cart is empty. <Link href="/photos">Pick photos</Link>.
        </p>
      ) : (
        <>
          <div className="cart-list">
            {quote.lines.map((line) => {
              if (line.kind === "photo") {
                const photo = photosById.get(line.id);
                if (!photo) return null;
                return (
                  <div className="cart-row" key={photo.id}>
                    <GuardedImage src={thumbSrc(photo.src)} alt="" />
                    <div>
                      <strong>{photo.caption}</strong>
                      <div style={{ color: "var(--muted)", fontSize: 13 }}>{formatDollars(line.cents)}</div>
                    </div>
                    <button className="pill" onClick={() => remove(photo.id)}>
                      Remove
                    </button>
                  </div>
                );
              }
              return (
                <div className="cart-row pack-row" key={`${line.kind}-${line.kind === "game" ? line.slug : line.date}`}>
                  <div>
                    <strong>{line.label}</strong>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>
                      {line.count} photos · {formatDollars(line.cents)}
                    </div>
                  </div>
                  <button
                    className="pill"
                    onClick={() =>
                      line.kind === "game" ? removeGame(line.slug) : removeNight(line.date)
                    }
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          <div className="cart-total">
            <div>
              <div className="kicker" style={{ marginBottom: 4 }}>
                {quote.accessIds.length} photo{quote.accessIds.length === 1 ? "" : "s"}
              </div>
              <strong className="display md">{formatDollars(quote.total)}</strong>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="pill" onClick={clear}>
                Clear
              </button>
              <button className="pill orange" onClick={checkout} disabled={pending}>
                {pending ? "Starting checkout…" : "Pay and download"}
              </button>
            </div>
          </div>
          {error && <p style={{ color: "var(--orange-300)" }}>{error}</p>}
        </>
      )}

      <form className="cart-recover" onSubmit={findOrders}>
        <div className="kicker">Already paid?</div>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Use the email from checkout to get the download page back.
        </p>
        <div className="search-wrap">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email used at checkout"
            required
          />
          <button className="pill" type="submit">
            Find
          </button>
        </div>
        {lookup && <p style={{ color: "var(--muted)" }}>{lookup}</p>}
        {found.map((order) => (
          <p key={order.sessionId}>
            <Link href={`/checkout/success?session_id=${encodeURIComponent(order.sessionId)}`}>
              {order.count} photo{order.count === 1 ? "" : "s"} ·{" "}
              {new Date(order.created * 1000).toLocaleDateString()}
            </Link>
          </p>
        ))}
      </form>
    </main>
  );
}
