/**
 * Burn a full-frame watermark into every public gallery JPEG and keep the
 * clean file under storage/originals (gitignored). Previews are what the
 * site and any direct image URL can serve. Paid downloads read the clean file.
 *
 * Usage: node scripts/watermark-gallery.mjs [--limit N] [--match substr]
 */
import { createHash } from "node:crypto";
import { mkdir, link, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gallery = path.join(root, "public", "gallery");
const originals = path.join(root, "storage", "originals");
const stampsDir = path.join(root, "storage", "stamps");

const PREVIEW_EDGE = 1600;
const HERO_EDGE = 2200;
const THUMB_WIDTH = 800;
const PREVIEW_QUALITY = 72;
const THUMB_QUALITY = 68;

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? "" : process.argv[i + 1] || "";
}

const limit = Number(argValue("--limit")) || Infinity;
const match = argValue("--match");

function hash32(text) {
  const buf = createHash("sha1").update(text).digest();
  return buf.readUInt32BE(0);
}

const TILE = 1200;

function gridSvg(size) {
  const font = Math.max(15, Math.round(size / 42));
  const stepX = Math.round(font * 10.2);
  const stepY = Math.round(font * 2.7);
  const span = size * 2;
  const texts = [];
  const pushGrid = (angle, label, textSize) => {
    const lines = [];
    for (let y = -span; y < size + span; y += stepY) {
      for (let x = -span; x < size + span; x += stepX) {
        lines.push(`<text x="${x}" y="${y}" font-size="${textSize}">${label}</text>`);
      }
    }
    texts.push(
      `<g transform="rotate(${angle} ${Math.round(size / 2)} ${Math.round(size / 2)})">${lines.join("")}</g>`
    );
  };
  pushGrid(-28, "MESAVERDEFOOTBALL.COM", font);
  pushGrid(24, "@TRUEFAMILYPHOTOGRAPHY", Math.max(13, Math.round(font * 0.72)));
  const stroke = Math.max(2, Math.round(font / 11));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text {
      font-family: Impact, "Arial Black", Arial, sans-serif;
      font-weight: 700;
      fill: #ffffff;
      fill-opacity: 0.96;
      stroke: #04140e;
      stroke-width: ${stroke};
      stroke-opacity: 0.92;
      paint-order: stroke fill;
    }
  </style>
  <g opacity="0.58">${texts.join("")}</g>
</svg>`;
}

function bandSvg(width, height) {
  const band = Math.max(28, Math.round(Math.min(width, height) / 16));
  const stroke = Math.max(3, Math.round(band / 14));
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="54%" text-anchor="middle"
    font-family="Impact, Arial Black, Arial, sans-serif" font-weight="700"
    font-size="${band}" letter-spacing="1"
    fill="#ffffff" fill-opacity="0.96" stroke="#04140e" stroke-width="${stroke}" stroke-opacity="0.94"
    paint-order="stroke fill" opacity="0.72">MESAVERDEFOOTBALL.COM</text>
</svg>`);
}

let masterPng;

async function loadMaster() {
  if (masterPng) return masterPng;
  masterPng = await sharp(Buffer.from(gridSvg(TILE))).png().toBuffer();
  return masterPng;
}

async function phasedTile(seed) {
  const master = await loadMaster();
  const dx = seed % TILE;
  const dy = (seed >>> 8) % TILE;
  return sharp({
    create: {
      width: TILE,
      height: TILE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: master, left: -dx, top: -dy },
      { input: master, left: TILE - dx, top: -dy },
      { input: master, left: -dx, top: TILE - dy },
      { input: master, left: TILE - dx, top: TILE - dy },
    ])
    .png()
    .toBuffer();
}

async function renderMarked(source, dest, { longEdge, width, quality, seedKey }) {
  const pipeline = sharp(source, { failOn: "none" }).rotate();
  const resized = longEdge
    ? pipeline.resize({
        width: longEdge,
        height: longEdge,
        fit: "inside",
        withoutEnlargement: true,
      })
    : pipeline.resize({ width, withoutEnlargement: true });
  const { data, info } = await resized.toBuffer({ resolveWithObject: true });
  let tile = await phasedTile(hash32(seedKey));
  const edge = Math.min(TILE, info.width, info.height);
  if (edge < TILE) {
    tile = await sharp(tile).resize(edge, edge).png().toBuffer();
  }
  await sharp(data)
    .composite([
      { input: tile, tile: true, blend: "over" },
      { input: bandSvg(info.width, info.height), top: 0, left: 0 },
    ])
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toFile(dest);
}

async function ensureOriginal(publicPath, storagePath) {
  try {
    await stat(storagePath);
    return;
  } catch {
    /* first run keeps the clean file beside the preview */
  }
  await mkdir(path.dirname(storagePath), { recursive: true });
  try {
    await link(publicPath, storagePath);
  } catch (err) {
    if (err && err.code === "EEXIST") return;
    const { copyFile } = await import("node:fs/promises");
    await copyFile(publicPath, storagePath);
  }
}

async function stampOf(rel) {
  return path.join(stampsDir, `${rel}.ok`);
}

async function walk(dir, out = []) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "thumbs") continue;
      await walk(abs, out);
    } else if (/\.jpe?g$/i.test(entry.name) && !entry.name.includes(".wm.tmp")) {
      out.push(abs);
    }
  }
  return out;
}

async function processOne(publicPath) {
  const rel = path.relative(gallery, publicPath);
  const storagePath = path.join(originals, "gallery", rel);
  const stamp = await stampOf(path.join("gallery", rel));
  try {
    await stat(stamp);
    return "skip";
  } catch {
    /* not done */
  }
  await ensureOriginal(publicPath, storagePath);
  const previewTmp = `${publicPath}.wm.tmp`;
  const longEdge = rel === "tunnel-longhorn-hero.jpg" ? HERO_EDGE : PREVIEW_EDGE;
  await renderMarked(storagePath, previewTmp, {
    longEdge,
    quality: PREVIEW_QUALITY,
    seedKey: rel,
  });
  await rename(previewTmp, publicPath);

  const thumbPath = path.join(gallery, "thumbs", rel);
  const thumbTmp = `${thumbPath}.wm.tmp`;
  await mkdir(path.dirname(thumbPath), { recursive: true });
  await renderMarked(storagePath, thumbTmp, {
    width: THUMB_WIDTH,
    quality: THUMB_QUALITY,
    seedKey: rel,
  });
  await rename(thumbTmp, thumbPath);

  await mkdir(path.dirname(stamp), { recursive: true });
  await writeFile(stamp, new Date().toISOString());
  return "ok";
}

async function pool(items, size, worker) {
  let cursor = 0;
  let done = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      const result = await worker(items[index], index);
      done += 1;
      if (done % 25 === 0 || done === items.length) {
        console.log(`${done}/${items.length} ${result} ${path.relative(gallery, items[index])}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, () => run()));
}

const files = (await walk(gallery)).filter((file) => !match || file.includes(match)).slice(0, limit);
console.log(`watermarking ${files.length} originals`);
const started = Date.now();
await pool(files, 3, async (file) => {
  try {
    return await processOne(file);
  } catch (err) {
    console.error("FAIL", file, err);
    return "fail";
  }
});
console.log(`finished in ${Math.round((Date.now() - started) / 1000)}s`);
