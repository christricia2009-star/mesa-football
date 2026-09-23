import { stat } from "fs/promises";
import { PassThrough, Readable } from "stream";
import { ZipArchive } from "archiver";
import { NextRequest, NextResponse } from "next/server";
import { loadCatalog, originalPath, safeName } from "@/lib/originals";
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

  const files: { file: string; name: string }[] = [];
  for (let i = 0; i < allowed.length; i += 1) {
    const photo = byId.get(allowed[i]);
    if (!photo) continue;
    let file: string;
    try {
      file = originalPath(photo.src);
      await stat(file);
    } catch {
      continue;
    }
    files.push({
      file,
      name: `${String(i + 1).padStart(3, "0")}-${safeName(photo.originalName)}`,
    });
  }
  if (!files.length) {
    return NextResponse.json({ error: "Clean files are not on this server." }, { status: 404 });
  }

  const pass = new PassThrough();
  const archive = new ZipArchive({ store: true });
  archive.on("error", (err) => pass.destroy(err));
  archive.pipe(pass);
  files.forEach((item) => archive.file(item.file, { name: item.name }));
  void archive.finalize();

  return new NextResponse(Readable.toWeb(pass) as ReadableStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="mesa-verde-photos.zip"',
      "Cache-Control": "private, no-store",
    },
  });
}
