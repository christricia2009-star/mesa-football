import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src") || "";
  const filename = req.nextUrl.searchParams.get("filename") || "maverick.jpg";
  if (!src.startsWith("/gallery/") && !src.startsWith("/uploads/") && !src.startsWith("/brand/")) {
    return NextResponse.json({ error: "Bad path" }, { status: 400 });
  }
  const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  try {
    const buf = await readFile(file);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
        "Cache-Control": "private, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ error: "Missing" }, { status: 404 });
  }
}
