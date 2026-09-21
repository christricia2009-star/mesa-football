"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { levelLabel, playerByNumber, playerHref } from "@/lib/data";
import PhotoCredit from "@/components/PhotoCredit";
import { thumbSrc } from "@/lib/utils";
import type { TeamLevel } from "@/lib/types";
import type { PollCandidate } from "@/lib/poll";

type Count = { level: TeamLevel; number: number; votes: number };
type Board = {
  id: string;
  level: TeamLevel;
  title: string;
  weekLabel: string;
  open: boolean;
  closesAt: string;
  total: number;
  counts: Count[];
  revealed: boolean;
  myVote: { level: TeamLevel; number: number } | null;
  winners: { level: TeamLevel; number: number }[];
  candidates: PollCandidate[];
};
type User = { name: string; email: string };

export default function PollBoard() {
  const [boards, setBoards] = useState<Board[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "", website: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [me, poll] = await Promise.all([
      fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/poll", { cache: "no-store" }).then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setBoards(poll.boards ?? []);
  }, []);

  useEffect(() => {
    refresh().catch(() => setError("Could not load the ballot."));
  }, [refresh]);

  async function auth(path: "/api/auth/signup" | "/api/auth/login") {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }
      setForm((f) => ({ ...f, password: "" }));
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh();
  }

  async function vote(level: TeamLevel, number: number) {
    if (!user) {
      setError("Sign up with a real email first — one account, one ballot per board.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, number, website: form.website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Vote did not land.");
        return;
      }
      setBoards(data.boards);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Your vote · their title</div>
          <h1 className="display lg">
            PLAYER OF THE <span className="orange">WEEK</span>
          </h1>
          <hr className="rule" />
          <p>
            Two ballots — varsity and JV. One email account, one vote per board.
          </p>
        </div>
        {user ? (
          <div className="poll-user">
            <span>
              Signed in as <strong>{user.name}</strong>
            </span>
            <button className="pill" onClick={logout}>
              Log out
            </button>
          </div>
        ) : null}
      </div>

      {!user && (
        <section className="auth-card">
          <div className="filters">
            <button
              className={mode === "signup" ? "chip on" : "chip"}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
            <button
              className={mode === "login" ? "chip on" : "chip"}
              onClick={() => setMode("login")}
            >
              Log in
            </button>
          </div>
          <p className="auth-note">
            A real email keeps the ballot honest. No bots. No ten-tab stuffing.
          </p>
          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              auth(mode === "signup" ? "/api/auth/signup" : "/api/auth/login");
            }}
          >
            {mode === "signup" && (
              <label className="field">
                Your name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  required
                />
              </label>
            )}
            <label className="field">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </label>
            <label className="field">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </label>
            <input
              className="hp"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              aria-hidden
            />
            <button className="pill orange" type="submit" disabled={busy}>
              {busy ? "Working…" : mode === "signup" ? "Create account" : "Log in"}
            </button>
          </form>
        </section>
      )}

      {error && <p className="alert">{error}</p>}

      {!boards && <p style={{ color: "var(--muted)" }}>Loading the ballots…</p>}

      {boards?.map((board) => (
        <BoardSection
          key={board.id}
          board={board}
          locked={!user || busy}
          onVote={vote}
        />
      ))}
    </main>
  );
}

function BoardSection({
  board,
  locked,
  onVote,
}: {
  board: Board;
  locked: boolean;
  onVote: (level: TeamLevel, number: number) => void;
}) {
  const max = Math.max(1, ...board.counts.map((c) => c.votes));
  return (
    <section className="poll-board">
      <div className="section-head">
        <div>
          <div className="kicker">
            {levelLabel(board.level)} · {board.weekLabel}
          </div>
          <h2 className="display md">
            {board.level === "jv" ? "JV" : "VARSITY"}{" "}
            <span className="orange">TITLE</span>
          </h2>
          <p style={{ color: "var(--muted)", margin: "8px 0 0" }}>
            {board.open
              ? `Open through ${new Date(board.closesAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  timeZoneName: "short",
                })}.`
              : "Ballot closed."}{" "}
            {board.revealed ? `${board.total} vote${board.total === 1 ? "" : "s"} in.` : "Counts hide until you vote."}
          </p>
        </div>
      </div>
      {board.winners.length > 0 && (
        <div className="potw-banner">
          {board.winners.map((w) => {
            const p = playerByNumber(w.number, w.level);
            return (
              <Link key={`${w.level}-${w.number}`} href={playerHref({ level: w.level, number: w.number })}>
                {levelLabel(w.level)} Player of the Week · #{w.number}{" "}
                {p ? `${p.first} ${p.last}` : ""}
              </Link>
            );
          })}
        </div>
      )}
      <div className="poll-grid">
        {board.candidates.map((c) => {
          const p = playerByNumber(c.number, c.level);
          const count = board.counts.find((x) => x.level === c.level && x.number === c.number);
          const selected = board.myVote?.level === c.level && board.myVote?.number === c.number;
          const isWinner = board.winners.some((w) => w.level === c.level && w.number === c.number);
          return (
            <article
              key={`${c.level}-${c.number}`}
              className={`poll-card${selected ? " on" : ""}${isWinner ? " win" : ""}`}
            >
              <div className="poll-photo">
                <img src={thumbSrc(c.photo)} alt="" />
                <PhotoCredit />
              </div>
              <div className="poll-card-body">
                <div className="kicker">
                  {levelLabel(c.level)} · #{c.number}
                  {isWinner ? " · WEEK TITLE" : ""}
                </div>
                <h3>
                  {p ? (
                    <Link href={playerHref(p)}>
                      {p.first} {p.last}
                    </Link>
                  ) : (
                    `#${c.number}`
                  )}
                </h3>
                <p>{c.blurb}</p>
                {p && (
                  <div className="jersey-pos">
                    {p.grade} · {p.positions.join(" / ")}
                  </div>
                )}
                {board.revealed && count && (
                  <div className="poll-bar">
                    <span
                      style={{ width: `${Math.round((count.votes / max) * 100)}%` }}
                    />
                    <em>
                      {count.votes} vote{count.votes === 1 ? "" : "s"}
                    </em>
                  </div>
                )}
                {board.open && (
                  <button
                    className={selected ? "pill orange" : "pill"}
                    disabled={locked}
                    onClick={() => onVote(c.level, c.number)}
                  >
                    {selected ? "Your vote" : "This is my Maverick"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
