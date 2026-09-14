import { NextResponse } from "next/server";
import {
  clientIp,
  rateLimited,
  setSessionCookie,
  verifyPassword,
} from "@/lib/session";
import { loadStore } from "@/lib/pollStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`login:${ip}`, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many tries. Wait a few minutes." }, { status: 429 });
  }
  let body: { email?: string; password?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (body.website) {
    return NextResponse.json({ ok: true });
  }
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const store = await loadStore();
  const user = store.users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passHash)) {
    return NextResponse.json({ error: "Email or password is wrong." }, { status: 401 });
  }
  setSessionCookie(user.id);
  return NextResponse.json({ ok: true, name: user.name, email: user.email });
}
