"use client";

import { useState } from "react";
import { SHOOT_PRICE_LABEL } from "@/lib/shoots";

export default function BookShootForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/shoots/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  return (
    <form className="shoot-book" onSubmit={submit}>
      <div className="kicker">Book a 1-1</div>
      <h2 className="display md">
        HOLD A SHOOT · <span className="orange">{SHOOT_PRICE_LABEL}</span>
      </h2>
      <p>
        Pay {SHOOT_PRICE_LABEL} to hold the session. After the card goes through we email the studio
        and reach out to set the day and time.
      </p>
      <label>
        Name
        <input value={form.name} onChange={(e) => set("name", e.target.value)} required autoComplete="name" />
      </label>
      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label>
        Phone
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          required
          autoComplete="tel"
        />
      </label>
      <label>
        Who is the shoot for
        <textarea
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
          rows={3}
          placeholder="Player name, jersey, or a note"
        />
      </label>
      {error && <p className="shoot-error">{error}</p>}
      <button className="pill orange" type="submit" disabled={pending}>
        {pending ? "Starting checkout…" : `Pay ${SHOOT_PRICE_LABEL}`}
      </button>
    </form>
  );
}
