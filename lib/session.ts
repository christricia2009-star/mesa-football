import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "mavs_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  return process.env.POLL_SECRET || "mesa-poll-dev-secret-change-me";
}

function b64url(buf: Buffer) {
  return buf.toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return `${b64url(salt)}$${b64url(hash)}`;
}

export function verifyPassword(password: string, stored: string) {
  const [saltB64, hashB64] = stored.split("$");
  if (!saltB64 || !hashB64) return false;
  const salt = Buffer.from(saltB64, "base64url");
  const hash = Buffer.from(hashB64, "base64url");
  const next = scryptSync(password, salt, 32);
  if (hash.length !== next.length) return false;
  return timingSafeEqual(hash, next);
}

export function makeSession(userId: string) {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = b64url(Buffer.from(JSON.stringify({ uid: userId, exp })));
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string): { uid: string } | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      uid: string;
      exp: number;
    };
    if (!data.uid || data.exp < Date.now()) return null;
    return { uid: data.uid };
  } catch {
    return null;
  }
}

export function setSessionCookie(userId: string) {
  cookies().set(COOKIE, makeSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}

export function sessionUserId() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  return readSessionToken(token)?.uid ?? null;
}

export function newId() {
  return randomBytes(12).toString("hex");
}

const hits = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  return false;
}

export function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}
