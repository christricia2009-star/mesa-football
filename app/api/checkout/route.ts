import { NextResponse } from "next/server";
import { loadCatalog } from "@/lib/originals";
import { stripeOrNull } from "@/lib/payments";
import { clientIp, rateLimited } from "@/lib/session";
import {
  GAME_PRICE_CENTS,
  NIGHT_PRICE_CENTS,
  packPurchase,
  PHOTO_PRICE_CENTS,
  quoteCart,
} from "@/lib/shop";

const PHOTO_TAX_CODE = "txcd_10501000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`checkout:${ip}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many checkout attempts. Wait a few minutes." }, { status: 429 });
  }
  const stripe = stripeOrNull();
  if (!stripe) {
    return NextResponse.json(
      { error: "Card checkout is not connected yet. Add STRIPE_SECRET_KEY on the server." },
      { status: 503 }
    );
  }

  let body: { ids?: unknown; games?: unknown; nights?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const strings = (value: unknown) =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  const catalog = await loadCatalog();
  const quote = quoteCart(strings(body.ids), strings(body.games), strings(body.nights), catalog);
  if (!quote.lines.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (quote.ids.length > 400) {
    return NextResponse.json({ error: "Checkout holds 400 single photos at a time." }, { status: 400 });
  }
  const packed = packPurchase({ ids: quote.ids, games: quote.games, nights: quote.nights });
  if (Object.values(packed).some((value) => value.length > 500)) {
    return NextResponse.json({ error: "That cart is too large for one payment." }, { status: 400 });
  }

  const lineItems = quote.lines.map((line) => {
    if (line.kind === "night") {
      return {
        quantity: 1,
        price_data: {
          currency: "usd" as const,
          unit_amount: NIGHT_PRICE_CENTS,
          product_data: {
            name: line.label,
            description: `${line.count} clean originals. JV and varsity from this night.`,
            tax_code: PHOTO_TAX_CODE,
          },
        },
      };
    }
    if (line.kind === "game") {
      return {
        quantity: 1,
        price_data: {
          currency: "usd" as const,
          unit_amount: GAME_PRICE_CENTS,
          product_data: {
            name: line.label,
            description: `${line.count} clean originals from this game.`,
            tax_code: PHOTO_TAX_CODE,
          },
        },
      };
    }
    return null;
  }).filter((item) => item !== null);

  if (quote.ids.length) {
    lineItems.push({
      quantity: quote.ids.length,
      price_data: {
        currency: "usd" as const,
        unit_amount: PHOTO_PRICE_CENTS,
        product_data: {
          name: quote.ids.length === 1 ? "Football event photo" : `${quote.ids.length} football event photos`,
          description: "Clean original files. The site preview stays watermarked.",
          tax_code: PHOTO_TAX_CODE,
        },
      },
    });
  }

  const origin = new URL(req.url).origin;
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      metadata: packed,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
  } catch {
    return NextResponse.json({ error: "Checkout did not start." }, { status: 502 });
  }

  if (!session.url) {
    return NextResponse.json({ error: "Checkout did not start." }, { status: 502 });
  }
  return NextResponse.json({ url: session.url });
}
