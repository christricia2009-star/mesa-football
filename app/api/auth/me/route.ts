import { NextResponse } from "next/server";
import { sessionUserId } from "@/lib/session";
import { loadStore } from "@/lib/pollStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = sessionUserId();
  if (!uid) return NextResponse.json({ user: null });
  const store = await loadStore();
  const user = store.users.find((u) => u.id === uid);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { name: user.name, email: user.email } });
}
