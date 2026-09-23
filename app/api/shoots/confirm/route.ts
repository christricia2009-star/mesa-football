import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/booking-mail";
import { stripeOrNull } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = stripeOrNull();
  if (!stripe) {
    return NextResponse.json({ error: "Card checkout is not connected yet." }, { status: 503 });
  }

  let body: { sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const sessionId = body.sessionId || "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId) || sessionId.length > 255) {
    return NextResponse.json({ error: "That payment is not confirmed." }, { status: 402 });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: "That payment is not confirmed." }, { status: 402 });
  }
  if (session.payment_status !== "paid" || session.metadata?.kind !== "shoot-booking") {
    return NextResponse.json({ error: "That payment is not confirmed." }, { status: 402 });
  }

  const booking = {
    sessionId,
    name: session.metadata.name || "Unknown",
    email: session.metadata.email || session.customer_details?.email || "",
    phone: session.metadata.phone || "",
    note: session.metadata.note || "",
  };

  const jar = cookies();
  const key = `shoot_mail_${sessionId}`;
  let mailed = Boolean(jar.get(key));
  if (!mailed) {
    try {
      await sendBookingEmail(booking);
      jar.set(key, "1", { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
      mailed = true;
    } catch {
      mailed = false;
    }
  }

  return NextResponse.json({ ok: true, mailed, name: booking.name });
}
