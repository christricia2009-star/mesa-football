/**
 * Upload storage/originals to the private Blob store.
 * Pathnames match the public gallery path without the leading slash.
 * Safe to rerun: blobs that already exist are skipped.
 */
import { readFileSync } from "node:fs";
import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const file = path.join(root, ".env.local");
  const text = readFileSync(file, "utf8");
  text.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  });
}

loadEnv();

const { head, put } = await import("@vercel/blob");
const originals = path.join(root, "storage", "originals");

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(abs, out);
    else if (/\.jpe?g$/i.test(entry.name)) out.push(abs);
  }
  return out;
}

async function exists(pathname) {
  try {
    await head(pathname);
    return true;
  } catch {
    return false;
  }
}

async function uploadOne(abs) {
  const pathname = path.relative(originals, abs).split(path.sep).join("/");
  if (await exists(pathname)) return "skip";
  const info = await stat(abs);
  await put(pathname, createReadStream(abs), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "image/jpeg",
    multipart: info.size > 8 * 1024 * 1024,
  });
  return "ok";
}

const files = await walk(originals);
console.log(`uploading ${files.length} originals`);
let cursor = 0;
let done = 0;
let failed = 0;
const started = Date.now();

async function worker() {
  while (cursor < files.length) {
    const index = cursor;
    cursor += 1;
    const file = files[index];
    let result = "fail";
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        result = await uploadOne(file);
        break;
      } catch (err) {
        result = "fail";
        if (attempt === 3) {
          failed += 1;
          console.error("FAIL", path.relative(originals, file), err instanceof Error ? err.message : err);
        }
      }
    }
    done += 1;
    if (done % 20 === 0 || done === files.length) {
      const mins = Math.round((Date.now() - started) / 1000);
      console.log(`${done}/${files.length} ${result} failed=${failed} ${mins}s`);
    }
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));
console.log(failed ? `finished with ${failed} failures` : "finished");
process.exit(failed ? 1 : 0);
