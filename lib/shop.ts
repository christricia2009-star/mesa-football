import { formatGameDate, games, levelLabel } from "./data";
import type { TeamLevel } from "./types";

export const PHOTO_PRICE_CENTS = 100;
export const GAME_PRICE_CENTS = 1000;
export const NIGHT_PRICE_CENTS = 2000;
export const PHOTO_PRICE_LABEL = "$1";
export const GAME_PRICE_LABEL = "$10";
export const NIGHT_PRICE_LABEL = "$20";

export type Purchase = { ids: string[]; games: string[]; nights: string[] };

export type CartLine =
  | { kind: "night"; date: string; label: string; cents: number; count: number }
  | { kind: "game"; slug: string; label: string; cents: number; count: number }
  | { kind: "photo"; id: string; cents: number };

type Shot = { id: string; game: string };

export function gameLabel(game: { level: TeamLevel; location: "home" | "away"; opponent: string }) {
  return `${levelLabel(game.level)} ${game.location === "home" ? "vs" : "@"} ${game.opponent}`;
}

function shortDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function countsByGame(photos: Shot[]) {
  const counts = new Map<string, string[]>();
  photos.forEach((photo) => {
    const list = counts.get(photo.game) || [];
    list.push(photo.id);
    counts.set(photo.game, list);
  });
  return counts;
}

export function nightPack(date: string, photos: Shot[]) {
  const day = games.filter((game) => game.date === date);
  const counts = countsByGame(photos);
  const stocked = day.filter((game) => (counts.get(game.slug) || []).length > 0);
  const levels = new Set(stocked.map((game) => game.level));
  if (!levels.has("jv") || !levels.has("varsity")) return null;
  const ids: string[] = [];
  stocked.forEach((game) => {
    (counts.get(game.slug) || []).forEach((id) => ids.push(id));
  });
  const names = Array.from(new Set(stocked.map((game) => game.opponent)));
  return {
    date,
    label: `Whole night · ${shortDate(date)} · ${names.join(" + ")}`,
    detail: `${formatGameDate(date)} · JV and varsity`,
    count: ids.length,
    ids,
    slugs: stocked.map((game) => game.slug),
  };
}

export function listDeals(photos: Shot[]) {
  const counts = countsByGame(photos);
  const dates: string[] = [];
  games.forEach((game) => {
    if (!dates.includes(game.date) && (counts.get(game.slug) || []).length > 0) dates.push(game.date);
  });
  dates.sort((a, b) => (a < b ? 1 : -1));
  const deals: Array<
    | { kind: "game"; slug: string; date: string; label: string; count: number }
    | { kind: "night"; date: string; label: string; count: number }
  > = [];
  dates.forEach((date) => {
    const day = games.filter((game) => game.date === date && (counts.get(game.slug) || []).length > 0);
    day
      .slice()
      .sort((a, b) => (a.level === b.level ? 0 : a.level === "jv" ? -1 : 1))
      .forEach((game) => {
        deals.push({
          kind: "game",
          slug: game.slug,
          date: game.date,
          label: gameLabel(game),
          count: (counts.get(game.slug) || []).length,
        });
      });
    const night = nightPack(date, photos);
    if (night) deals.push({ kind: "night", date, label: night.label, count: night.count });
  });
  return deals;
}

export function quoteCart(photoIds: string[], gameSlugs: string[], nightDates: string[], photos: Shot[]) {
  const known = new Set<string>();
  photos.forEach((photo) => known.add(photo.id));
  const counts = countsByGame(photos);
  const covered = new Set<string>();
  const lines: CartLine[] = [];

  const nights: string[] = [];
  nightDates.forEach((date) => {
    if (nights.includes(date)) return;
    const night = nightPack(date, photos);
    if (!night) return;
    nights.push(date);
    lines.push({
      kind: "night",
      date,
      label: night.label,
      cents: NIGHT_PRICE_CENTS,
      count: night.count,
    });
    night.ids.forEach((id) => covered.add(id));
  });

  const packedGames: string[] = [];
  gameSlugs.forEach((slug) => {
    if (packedGames.includes(slug)) return;
    const game = games.find((item) => item.slug === slug);
    if (!game) return;
    if (nights.includes(game.date)) return;
    const ids = counts.get(slug) || [];
    if (!ids.length) return;
    packedGames.push(slug);
    lines.push({
      kind: "game",
      slug,
      label: gameLabel(game),
      cents: GAME_PRICE_CENTS,
      count: ids.length,
    });
    ids.forEach((id) => covered.add(id));
  });

  const singles: string[] = [];
  photoIds.forEach((id) => {
    if (singles.includes(id) || covered.has(id) || !known.has(id)) return;
    singles.push(id);
    lines.push({ kind: "photo", id, cents: PHOTO_PRICE_CENTS });
    covered.add(id);
  });

  const accessIds: string[] = [];
  covered.forEach((id) => accessIds.push(id));
  const total = lines.reduce((sum, line) => sum + line.cents, 0);
  return { lines, total, accessIds, games: packedGames, nights, ids: singles };
}

export function expandPurchase(purchase: Purchase, photos: Shot[]) {
  return quoteCart(purchase.ids, purchase.games, purchase.nights, photos).accessIds;
}

const META_VALUE = 450;

export function packIds(ids: string[]): Record<string, string> {
  const meta: Record<string, string> = { count: String(ids.length) };
  let part = 0;
  let buf = "";
  const flush = () => {
    if (!buf) return;
    meta[`p${part}`] = buf;
    part += 1;
    buf = "";
  };
  for (const id of ids) {
    if (!/^[a-z0-9-]+$/i.test(id)) continue;
    const next = buf ? `${buf},${id}` : id;
    if (next.length > META_VALUE) {
      flush();
      buf = id;
    } else {
      buf = next;
    }
  }
  flush();
  return meta;
}

export function packPurchase(purchase: Purchase): Record<string, string> {
  const meta = packIds(purchase.ids);
  if (purchase.games.length) meta.games = purchase.games.join(",");
  if (purchase.nights.length) meta.nights = purchase.nights.join(",");
  return meta;
}

export function unpackPurchase(meta: Record<string, string> | null | undefined): Purchase {
  const games = (meta?.games || "")
    .split(",")
    .filter((slug) => /^[a-z0-9-]+$/i.test(slug));
  const nights = (meta?.nights || "").split(",").filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date));
  return { ids: unpackIds(meta), games, nights };
}

export function unpackIds(meta: Record<string, string> | null | undefined): string[] {
  if (!meta) return [];
  const keys: string[] = [];
  Object.keys(meta).forEach((key) => {
    if (/^p\d+$/.test(key)) keys.push(key);
  });
  keys.sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  const ids: string[] = [];
  keys.forEach((key) => {
    const value = meta[key];
    if (!value) return;
    value.split(",").forEach((id) => {
      if (id) ids.push(id);
    });
  });
  return ids;
}

export function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
