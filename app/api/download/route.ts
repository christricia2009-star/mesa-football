import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { blobConfigured, signedOriginalUrl } from "@/lib/delivery";
import { loadCatalog, originalPath, safeName } from "@/lib/originals";
import { paidPhotoIds } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id") || "";
  const id = req.nextUrl.searchParams.get("id") || "";
  const allowed = await paidPhotoIds(sessionId);
  if (!allowed || !allowed.includes(id)) {
    return NextResponse.json({ error: "Pay for this photo before downloading it." }, { status: 401 });
  }

  const catalog = await loadCatalog();
  const photo = catalog.find((item) => item.id === id);
  if (!photo) return NextResponse.json({ error: "Unknown photo" }, { status: 404 });

  if (blobConfigured()) {
    try {
      const url = await signedOriginalUrl(photo.src);
      return NextResponse.redirect(url, { status: 302 });
    } catch {
      /* local file is the fallback while originals are still on this machine */
    }
  }

  let file: string;
  try {
    file = originalPath(photo.src);
  } catch {
    return NextResponse.json({ error: "Bad path" }, { status: 400 });
  }

  try {
    const info = await stat(file);
    const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeName(photo.originalName)}"`,
        "Content-Length": String(info.size),
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Clean file is not on this server." }, { status: 404 });
  }
}
