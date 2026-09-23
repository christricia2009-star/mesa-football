import { NextRequest, NextResponse } from "next/server";
import { blobConfigured, signedOriginalUrl } from "@/lib/delivery";
import { loadCatalog, safeName } from "@/lib/originals";
import { paidPhotoIds } from "@/lib/payments";
import type { Photo } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id") || "";
  const allowed = await paidPhotoIds(sessionId);
  if (!allowed || allowed.length === 0) {
    return NextResponse.json({ error: "Pay for these photos before downloading them." }, { status: 401 });
  }

  const catalog = await loadCatalog();
  const byId = new Map<string, Photo>();
  catalog.forEach((photo) => byId.set(photo.id, photo));

  const files: { name: string; url: string }[] = [];
  for (let i = 0; i < allowed.length; i += 1) {
    const photo = byId.get(allowed[i]);
    if (!photo) continue;
    const name = `${String(i + 1).padStart(3, "0")}-${safeName(photo.originalName)}`;
    if (blobConfigured()) {
      try {
        files.push({ name, url: await signedOriginalUrl(photo.src) });
        continue;
      } catch {
        /* fall through to the same-site download */
      }
    }
    const url = new URL("/api/download", req.url);
    url.searchParams.set("session_id", sessionId);
    url.searchParams.set("id", photo.id);
    files.push({ name, url: url.toString() });
  }

  if (!files.length) {
    return NextResponse.json({ error: "Clean files are not on this server." }, { status: 404 });
  }
  return NextResponse.json({ files });
}
