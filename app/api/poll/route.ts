import { NextResponse } from "next/server";
import { currentPolls, pollBoards, pollIsOpen } from "@/lib/poll";
import { loadStore, saveStore } from "@/lib/pollStore";
import { clientIp, rateLimited, sessionUserId } from "@/lib/session";
import type { TeamLevel } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asLevel(v: unknown): TeamLevel | null {
  return v === "varsity" || v === "jv" ? v : null;
}

function boardPayload(store: Awaited<ReturnType<typeof loadStore>>, uid: string | null) {
  return pollBoards.map((level) => {
    const week = currentPolls[level];
    const open = pollIsOpen(week);
    const ballots = store.votes.filter((v) => v.weekId === week.id);
    const counts = week.candidates.map((c) => ({
      level: c.level,
      number: c.number,
      votes: ballots.filter((v) => v.level === c.level && v.number === c.number).length,
    }));
    const mine = uid ? ballots.find((v) => v.userId === uid) : undefined;
    const total = ballots.length;
    const ranked = [...counts].sort((a, b) => b.votes - a.votes);
    const top = ranked[0];
    const winners =
      !open && top && top.votes > 0
        ? ranked.filter((c) => c.votes === top.votes).map((c) => ({ level: c.level, number: c.number }))
        : [];
    return {
      id: week.id,
      level: week.level,
      title: week.title,
      weekLabel: week.weekLabel,
      open,
      closesAt: week.closesAt,
      total,
      counts: open && !mine ? counts.map((c) => ({ ...c, votes: 0 })) : counts,
      revealed: !open || Boolean(mine),
      myVote: mine ? { level: mine.level, number: mine.number } : null,
      winners,
      candidates: week.candidates,
    };
  });
}

export async function GET() {
  const uid = sessionUserId();
  const store = await loadStore();
  return NextResponse.json({ boards: boardPayload(store, uid) });
}

export async function POST(req: Request) {
  const uid = sessionUserId();
  if (!uid) {
    return NextResponse.json({ error: "Sign up or log in to vote." }, { status: 401 });
  }
  const ip = clientIp(req);
  if (rateLimited(`vote:${ip}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Slow down a second." }, { status: 429 });
  }
  let body: { level?: string; number?: number; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (body.website) {
    return NextResponse.json({ ok: true });
  }
  const level = asLevel(body.level);
  const number = Number(body.number);
  if (!level || !Number.isInteger(number)) {
    return NextResponse.json({ error: "Pick a player on the ballot." }, { status: 400 });
  }
  const week = currentPolls[level];
  if (!pollIsOpen(week)) {
    return NextResponse.json({ error: "This ballot is closed." }, { status: 403 });
  }
  if (!week.candidates.some((c) => c.level === level && c.number === number)) {
    return NextResponse.json({ error: "That player is not on this ballot." }, { status: 400 });
  }
  const store = await loadStore();
  if (!store.users.some((u) => u.id === uid)) {
    return NextResponse.json({ error: "Sign up or log in to vote." }, { status: 401 });
  }
  const existing = store.votes.findIndex((v) => v.weekId === week.id && v.userId === uid);
  const vote = {
    weekId: week.id,
    userId: uid,
    level,
    number,
    at: new Date().toISOString(),
  };
  if (existing >= 0) store.votes[existing] = vote;
  else store.votes.push(vote);
  await saveStore(store);
  return NextResponse.json({ ok: true, boards: boardPayload(store, uid) });
}
