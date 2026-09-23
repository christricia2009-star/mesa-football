"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatBytes, paidDownloadUrl } from "@/lib/utils";

type Item = { id: string; caption: string; filename: string; bytes?: number };

export default function SuccessScreen({ sessionId }: { sessionId: string }) {
  const { rememberOrder, dropPurchase } = useCart();
  const [photos, setPhotos] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      const res = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`);
      const data = (await res.json()) as {
        error?: string;
        photos?: Item[];
        games?: string[];
        nights?: string[];
      };
      if (cancel) return;
      if (!res.ok || !data.photos) {
        setError(data.error || "That payment is not confirmed.");
        return;
      }
      setPhotos(data.photos);
      const purchase = {
        ids: data.photos.map((photo) => photo.id),
        games: data.games || [],
        nights: data.nights || [],
      };
      rememberOrder({ sessionId, ...purchase });
      dropPurchase(purchase);
    })();
    return () => {
      cancel = true;
    };
  }, [sessionId, rememberOrder, dropPurchase]);

  async function downloadAll() {
    setError("");
    setSaving("Preparing downloads…");
    const res = await fetch(`/api/download/links?session_id=${encodeURIComponent(sessionId)}`);
    const data = (await res.json()) as { error?: string; files?: { name: string; url: string }[] };
    if (!res.ok || !data.files?.length) {
      setSaving("");
      setError(data.error || "Downloads are not ready.");
      return;
    }
    for (let i = 0; i < data.files.length; i += 1) {
      const file = data.files[i];
      setSaving(`Saving ${i + 1} of ${data.files.length}`);
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    setSaving("");
  }

  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Payment</div>
          <h1 className="display lg">
            YOUR <span className="orange">DOWNLOADS</span>
          </h1>
          <hr className="rule" />
          <p className="cart-note">
            These are the clean originals. Bookmark this page. The address is the download link
            for this order.
          </p>
        </div>
      </div>
      {error && <p style={{ color: "var(--orange-300)" }}>{error}</p>}
      {photos && (
        <>
          <p>
            <button className="pill orange" onClick={downloadAll} disabled={Boolean(saving)}>
              {saving || `Download all (${photos.length})`}
            </button>
          </p>
          <div className="cart-list">
            {photos.map((photo) => (
              <div className="cart-row" key={photo.id} style={{ gridTemplateColumns: "1fr auto" }}>
                <div>
                  <strong>{photo.caption}</strong>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {photo.filename}
                    {photo.bytes ? ` · ${formatBytes(photo.bytes)}` : ""}
                  </div>
                </div>
                <a className="pill" href={paidDownloadUrl(sessionId, photo.id)}>
                  Download
                </a>
              </div>
            ))}
          </div>
        </>
      )}
      {!photos && !error && <p style={{ color: "var(--muted)" }}>Checking payment…</p>}
      <p style={{ marginTop: 28 }}>
        <Link href="/photos">Back to photos</Link>
      </p>
    </main>
  );
}
