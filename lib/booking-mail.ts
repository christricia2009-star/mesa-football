import { SHOOT_ADMIN_EMAIL } from "./shoots";

export type ShootBooking = {
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  note: string;
};

export async function sendBookingEmail(booking: ShootBooking) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SHOOT_ADMIN_EMAIL)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `1-1 shoot booked — ${booking.name} — $15 paid`,
      _template: "table",
      _captcha: "false",
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      notes: booking.note || "None",
      stripe_session: booking.sessionId,
      message: "Paid $15 for a 1-1 shoot. Reach out and book the appointment.",
    }),
  });
  const data = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
  if (!res.ok || data?.success === false || data?.success === "false") {
    throw new Error(`Booking email failed (${res.status})`);
  }
}
