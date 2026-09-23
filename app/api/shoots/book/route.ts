import { NextResponse } from "next/server";
import { stripeOrNull } from "@/lib/payments";
import { clientIp, rateLimited } from "@/lib/session";
import { SHOOT_PRICE_CENTS } from "@/lib/shoots";

const PHOTO_TAX_CODE = "txcd_10501000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`shoot-book:${ip}`, 8, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many booking attempts. Wait a few minutes." }, { status: 429 });
  }
  let body: { name?: unknown; email?: unknown; phone?: unknown; note?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 120).toLowerCase();
  const phone = clean(body.phone, 30);
  const note = clean(body.note, 400);
  if (name.length < 2) return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter an email we can reply to." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "Enter a phone number." }, { status: 400 });
  }

  const stripe = stripeOrNull();
  if (!stripe) {
    return NextResponse.json({ error: "Card checkout is not connected yet." }, { status: 503 });
  }

  const origin = new URL(req.url).origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: SHOOT_PRICE_CENTS,
            product_data: {
              name: "1-1 photo shoot",
              description: "Booking hold. We will reach out to set the appointment.",
              tax_code: PHOTO_TAX_CODE,
            },
          },
        },
      ],
      metadata: {
        kind: "shoot-booking",
        name,
        email,
        phone,
        note,
      },
      success_url: `${origin}/shoots/booked?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shoots`,
    });
    if (!session.url) {
      return NextResponse.json({ error: "Checkout did not start." }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Checkout did not start." }, { status: 502 });
  }
}
