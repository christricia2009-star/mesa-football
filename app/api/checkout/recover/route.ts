import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/session";
import { loadCatalog } from "@/lib/originals";
import { stripeOrNull } from "@/lib/payments";
import { expandPurchase, unpackPurchase } from "@/lib/shop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`recover:${ip}`, 8, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many lookups. Wait a few minutes." }, { status: 429 });
  }
  const stripe = stripeOrNull();
  if (!stripe) {
    return NextResponse.json({ error: "Card checkout is not connected yet." }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter the email you used at checkout." }, { status: 400 });
  }

  const catalog = await loadCatalog();
  const orders: { sessionId: string; count: number; created: number }[] = [];
  let startingAfter: string | undefined;
  for (let page = 0; page < 5; page += 1) {
    const listed = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
      starting_after: startingAfter,
    });
    listed.data.forEach((session) => {
      const paidEmail = session.customer_details?.email?.trim().toLowerCase();
      if (session.payment_status !== "paid" || paidEmail !== email) return;
      orders.push({
        sessionId: session.id,
        count: expandPurchase(unpackPurchase(session.metadata), catalog).length,
        created: session.created,
      });
    });
    if (!listed.has_more || listed.data.length === 0) break;
    startingAfter = listed.data[listed.data.length - 1]?.id;
  }

  return NextResponse.json({ orders });
}
