import Stripe from "stripe";
import { loadCatalog } from "./originals";
import { expandPurchase, unpackPurchase } from "./shop";

export function stripeOrNull() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

async function paidSession(sessionId: string) {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId) || sessionId.length > 255) return null;
  const stripe = stripeOrNull();
  if (!stripe) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;
    return session;
  } catch {
    return null;
  }
}

export async function paidPurchase(sessionId: string) {
  const session = await paidSession(sessionId);
  if (!session) return null;
  return unpackPurchase(session.metadata);
}

export async function paidPhotoIds(sessionId: string): Promise<string[] | null> {
  const purchase = await paidPurchase(sessionId);
  if (!purchase) return null;
  const catalog = await loadCatalog();
  return expandPurchase(purchase, catalog);
}
