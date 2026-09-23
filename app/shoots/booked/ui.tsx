"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookedScreen({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<"checking" | "paid" | "mail" | "bad">("checking");
  const [name, setName] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      const res = await fetch("/api/shoots/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = (await res.json()) as { ok?: boolean; mailed?: boolean; name?: string };
      if (cancel) return;
      if (!res.ok || !data.ok) {
        setState("bad");
        return;
      }
      setName(data.name || "");
      setState(data.mailed ? "paid" : "mail");
    })();
    return () => {
      cancel = true;
    };
  }, [sessionId]);

  return (
    <main className="section">
      <div className="kicker">1-1 shoot</div>
      <h1 className="display lg">
        {state === "bad" ? "PAYMENT" : "YOU'RE"} <span className="orange">{state === "bad" ? "PENDING" : "BOOKED"}</span>
      </h1>
      <hr className="rule" />
      {state === "checking" && <p className="cart-note">Checking the payment…</p>}
      {state === "paid" && (
        <p className="cart-note">
          {name ? `${name}, the ` : "The "}$15 is in. The studio has the request and will reach out
          at the email and phone you entered to set the appointment.
        </p>
      )}
      {state === "mail" && (
        <p className="cart-note">
          The $15 is in. We could not send the studio email just now. Write
          admin@snapcollectibles.com with your name and phone so the appointment still gets set.
        </p>
      )}
      {state === "bad" && (
        <p className="cart-note">This page needs a finished checkout. Head back and try the payment again.</p>
      )}
      <p style={{ marginTop: 28 }}>
        <Link href="/shoots">Back to shoots</Link>
      </p>
    </main>
  );
}
