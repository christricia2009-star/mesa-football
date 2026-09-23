import { NextRequest, NextResponse } from "next/server";
import { loadCatalog } from "@/lib/originals";
import { paidPhotoIds, paidPurchase } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id") || "";
  const ids = await paidPhotoIds(sessionId);
  if (!ids) {
    return NextResponse.json({ error: "That payment is not confirmed." }, { status: 402 });
  }
  const catalog = await loadCatalog();
  const byId = new Map<string, { id: string; caption: string; filename: string; bytes?: number }>();
  catalog.forEach((photo) => {
    byId.set(photo.id, {
      id: photo.id,
      caption: photo.caption,
      filename: photo.originalName,
      bytes: photo.bytes,
    });
  });
  const photos: { id: string; caption: string; filename: string; bytes?: number }[] = [];
  ids.forEach((id) => {
    const photo = byId.get(id);
    if (photo) photos.push(photo);
  });
  const purchase = await paidPurchase(sessionId);
  return NextResponse.json({
    paid: true,
    sessionId,
    photos,
    games: purchase?.games || [],
    nights: purchase?.nights || [],
  });
}
