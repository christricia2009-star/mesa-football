import { NextResponse } from "next/server";
import {
  clientIp,
  hashPassword,
  newId,
  rateLimited,
  setSessionCookie,
} from "@/lib/session";
import { loadStore, saveStore } from "@/lib/pollStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`signup:${ip}`, 8, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many signups. Try later." }, { status: 429 });
  }
  let body: { name?: string; email?: string; password?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (body.website) {
    return NextResponse.json({ ok: true });
  }
  const name = (body.name || "").trim().slice(0, 60);
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (name.length < 2) {
    return NextResponse.json({ error: "Name needs at least 2 characters." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Use a real email so we can keep the ballot honest." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password needs at least 8 characters." }, { status: 400 });
  }
  const store = await loadStore();
  if (store.users.some((u) => u.email === email)) {
    return NextResponse.json({ error: "That email already has an account. Log in." }, { status: 409 });
  }
  const user = {
    id: newId(),
    name,
    email,
    passHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await saveStore(store);
  setSessionCookie(user.id);
  return NextResponse.json({ ok: true, name: user.name, email: user.email });
}
