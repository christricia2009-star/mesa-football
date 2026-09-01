import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { Photo } from "@/lib/types";

const file = path.join(process.cwd(), "data", "photos.json");

export async function GET() {
  try {
    const raw = await readFile(file, "utf8");
    const photos = JSON.parse(raw) as Photo[];
    return NextResponse.json(photos);
  } catch {
    return NextResponse.json([]);
  }
}
