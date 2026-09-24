import {
  areas,
  gameBySlug,
  games,
  levelLabel,
  players,
} from "./data";
import type { Area, Game, Photo, Player, TeamLevel } from "./types";

const STOP = new Set([
  "a",
  "and",
  "at",
  "frame",
  "frames",
  "game",
  "games",
  "of",
  "photo",
  "photos",
  "the",
  "vs",
]);

const MONTH: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

export type PhotoSearchGroup = {
  key: string;
  label: string;
  photos: Photo[];
};

type Parsed = {
  reject: boolean;
  level: TeamLevel | null;
  players: Player[];
  games: Game[];
  areas: Area[];
  filename: string | null;
  jerseys: number[];
};

/** Bare jersey search like `5` or `#5` — not a substring of 15 / 25 / 35. */
export function jerseyQuery(q: string): number | null {
  const raw = q.trim().replace(/^#/, "");
  if (!/^\d{1,2}$/.test(raw)) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 99) return null;
  return n;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’.]/g, "")
    .replace(/_/g, "")
    .replace(/[-/]+/g, " ")
    .replace(/[^a-z0-9#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensOf(s: string): string[] {
  return norm(s).split(" ").filter(Boolean);
}

function personWords(): Set<string> {
  const set = new Set<string>();
  for (const p of players) {
    for (const w of tokensOf(p.first)) if (w.length > 1) set.add(w);
    for (const w of tokensOf(p.last)) if (w.length > 1) set.add(w);
  }
  return set;
}

function lastHit(player: Player, toks: string[]): boolean {
  const last = tokensOf(player.last).filter((w) => w.length > 1);
  if (!last.length) return false;
  if (last.every((w) => toks.includes(w))) return true;
  return last.length > 1 && last.some((w) => w.length >= 4 && toks.includes(w));
}

function firstHit(player: Player, toks: string[]): boolean {
  const first = tokensOf(player.first).filter((w) => w.length > 1);
  return first.length > 0 && first.every((w) => toks.includes(w));
}

function captionHasJersey(caption: string, n: number): boolean {
  return new RegExp(`(^|[^\\d])#${n}(?!\\d)`).test(caption);
}

function playerInPhoto(photo: Photo, player: Player): boolean {
  if (photo.level !== player.level) return false;
  if (photo.players.includes(player.number)) return true;
  if (captionHasJersey(photo.caption, player.number)) return true;
  const cap = new Set(tokensOf(photo.caption));
  const firstOk = tokensOf(player.first).every((w) => cap.has(w));
  const lastWords = tokensOf(player.last).filter((w) => w.length > 1);
  const lastOk = lastWords.length > 0 && lastWords.every((w) => cap.has(w));
  if (firstOk && lastOk) return true;
  const opp = new Set(tokensOf(gameBySlug(photo.game)?.opponent || ""));
  const lastIsOpponent = lastWords.some((w) => opp.has(w));
  return lastOk && !lastIsOpponent;
}

function subjectScore(photo: Photo, player: Player): number {
  let score = 0;
  if (photo.players.length === 1 && photo.players[0] === player.number) score += 100;
  else if (photo.players[0] === player.number) score += 40;
  else if (photo.players.includes(player.number)) score += 10;
  const cap = tokensOf(photo.caption);
  if (
    tokensOf(player.first).every((w) => cap.includes(w)) &&
    tokensOf(player.last).every((w) => cap.includes(w))
  ) {
    score += 30;
  }
  if (photo.featured) score += 5;
  return score;
}

function byNewest(a: Photo, b: Photo): number {
  return b.uploadedAt.localeCompare(a.uploadedAt);
}

function gameLabel(g: Game): string {
  if (norm(g.opponent) === "intra squad") return `${levelLabel(g.level)} intra-squad`;
  const where = g.location === "home" ? "vs" : "@";
  return `${levelLabel(g.level)} ${where} ${g.opponent}`;
}

function groupsByGame(
  hits: Photo[],
  singleLabel: string,
  areaName: string | null
): PhotoSearchGroup[] {
  const order = new Map(games.map((g, i) => [g.slug, i]));
  const slugs: string[] = [];
  const seen = new Set<string>();
  for (const photo of hits) {
    if (seen.has(photo.game)) continue;
    seen.add(photo.game);
    slugs.push(photo.game);
  }
  slugs.sort((a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999));
  if (slugs.length <= 1) {
    return [{ key: slugs[0] || "hits", label: singleLabel, photos: hits }];
  }
  return slugs.map((slug) => {
    const game = gameBySlug(slug);
    const name = game ? gameLabel(game) : slug;
    return {
      key: slug,
      label: areaName ? `${areaName} · ${name}` : name,
      photos: hits.filter((p) => p.game === slug),
    };
  });
}

function playerLabel(p: Player): string {
  return `${levelLabel(p.level)} #${p.number} ${p.first} ${p.last}`;
}

/**
 * "Sierra" is both a last name and part of Golden Sierra. A school match
 * needs the opponent name (or a word that is not a player's name), so a
 * last name does not return the whole album. Shared jersey numbers stay
 * with the player who wears them at that level.
 */
export function parsePhotoQuery(q: string): Parsed {
  const toks = tokensOf(q);
  const empty: Parsed = {
    reject: true,
    level: null,
    players: [],
    games: [],
    areas: [],
    filename: null,
    jerseys: [],
  };
  if (!toks.length) return { ...empty, reject: false };

  let level: TeamLevel | null = null;
  const jerseys: number[] = [];
  let month: number | null = null;
  let day: number | null = null;
  const explained = new Set<number>();

  toks.forEach((t, i) => {
    if (t === "jv") {
      level = "jv";
      explained.add(i);
    } else if (t === "varsity" || t === "var") {
      level = "varsity";
      explained.add(i);
    } else if (MONTH[t]) {
      month = MONTH[t];
      explained.add(i);
    } else if (STOP.has(t)) {
      explained.add(i);
    }
  });

  toks.forEach((t, i) => {
    if (!/^#\d{1,2}$/.test(t)) return;
    const n = Number(t.slice(1));
    if (n <= 99) {
      jerseys.push(n);
      explained.add(i);
    }
  });

  if (month) {
    const dayIdx = toks.findIndex((t, i) => !explained.has(i) && /^\d{1,2}$/.test(t));
    if (dayIdx >= 0) {
      const n = Number(toks[dayIdx]);
      if (n >= 1 && n <= 31) {
        day = n;
        explained.add(dayIdx);
      }
    }
  }

  toks.forEach((t, i) => {
    if (explained.has(i) || !/^\d{1,2}$/.test(t)) return;
    const n = Number(t);
    if (n <= 99) {
      jerseys.push(n);
      explained.add(i);
    }
  });

  const fileIdx = toks.findIndex((t, i) => !explained.has(i) && /^(dsc|img)\d+$/.test(t));
  const filename = fileIdx >= 0 ? toks[fileIdx] : null;
  if (fileIdx >= 0) explained.add(fileIdx);

  const people = personWords();
  const slugMatches = games.filter((g) => tokensOf(g.slug).every((w) => toks.includes(w)));
  const opponentMatches = games.filter((g) => {
    const opp = norm(g.opponent);
    const oppWords = tokensOf(g.opponent).filter((w) => w.length > 2);
    if (opp && norm(q).includes(opp)) return true;
    if (oppWords.length > 1 && oppWords.every((w) => toks.includes(w))) return true;
    if (oppWords.length === 1 && toks.includes(oppWords[0]) && !people.has(oppWords[0])) {
      return true;
    }
    const sameOpponent = games.filter((other) => norm(other.opponent) === opp);
    const shorthand = oppWords.filter(
      (w) =>
        w.length >= 4 &&
        toks.includes(w) &&
        !people.has(w) &&
        games.filter((other) => tokensOf(other.opponent).includes(w)).length === sameOpponent.length
    );
    if (shorthand.length) return true;
    const mascot = tokensOf(g.mascot).filter(
      (w) => w.length >= 4 && w !== "open" && !people.has(w)
    );
    return mascot.some((w) => toks.includes(w));
  });

  let matchedGames: Game[] = [];
  if (slugMatches.length) matchedGames = slugMatches;
  else if (opponentMatches.length) matchedGames = opponentMatches;
  else if (month || day) matchedGames = [...games];

  if (matchedGames.length && level && (slugMatches.length || opponentMatches.length || month || day)) {
    matchedGames = matchedGames.filter((g) => g.level === level);
  }
  if (month || day) {
    matchedGames = matchedGames.filter((g) => {
      const [, m, d] = g.date.split("-").map(Number);
      if (month && m !== month) return false;
      if (day && d !== day) return false;
      return true;
    });
  }

  const gameTokens = new Set<string>();
  for (const g of matchedGames) {
    for (const w of tokensOf(g.opponent)) gameTokens.add(w);
    for (const w of tokensOf(g.mascot)) gameTokens.add(w);
    for (const w of tokensOf(g.slug)) gameTokens.add(w);
  }
  toks.forEach((t, i) => {
    if (gameTokens.has(t)) explained.add(i);
  });

  const nameTokens = toks.filter((_, i) => !explained.has(i));
  type Kind = "both" | "last" | "first";
  let named: { player: Player; kind: Kind }[] = [];
  for (const player of players) {
    const firstOk = firstHit(player, nameTokens);
    const lastOk = lastHit(player, nameTokens);
    const kind: Kind | null =
      firstOk && lastOk ? "both" : lastOk ? "last" : firstOk ? "first" : null;
    if (kind) named.push({ player, kind });
  }
  if (named.some((h) => h.kind === "both")) named = named.filter((h) => h.kind === "both");
  else if (named.some((h) => h.kind === "last")) named = named.filter((h) => h.kind === "last");

  for (const hit of named) {
    for (const w of tokensOf(hit.player.first)) {
      const i = toks.indexOf(w);
      if (i >= 0 && nameTokens.includes(w)) explained.add(i);
    }
    for (const w of tokensOf(hit.player.last)) {
      const i = toks.indexOf(w);
      if (i >= 0 && nameTokens.includes(w)) explained.add(i);
    }
  }

  const namedSomeone = named.length > 0;
  let roster = named.map((h) => h.player);
  if (jerseys.length) {
    const pool = roster.length ? roster : players;
    roster = pool.filter((p) => jerseys.includes(p.number));
  }
  if (level) roster = roster.filter((p) => p.level === level);
  if (namedSomeone && !roster.length) return empty;
  roster.sort((a, b) => {
    if (a.level !== b.level) return a.level === "varsity" ? -1 : 1;
    return a.number - b.number;
  });

  const areaHits = areas.filter((area) => {
    const words = tokensOf(area.name).filter((w) => w.length > 2);
    if (!words.length) return false;
    if (words.every((w) => toks.includes(w))) return true;
    return words.some((w) => w.length >= 4 && toks.includes(w) && !personWords().has(w));
  });
  for (const area of areaHits) {
    for (const w of tokensOf(area.name)) {
      const i = toks.indexOf(w);
      if (i >= 0) explained.add(i);
    }
  }

  const unexplained = toks.some((t, i) => !explained.has(i) && !STOP.has(t));
  const constrained = Boolean(
    level ||
      roster.length ||
      matchedGames.length ||
      areaHits.length ||
      filename ||
      jerseys.length
  );
  if (unexplained || !constrained || ((month || day) && !matchedGames.length)) {
    return empty;
  }

  return {
    reject: false,
    level,
    players: roster,
    games: matchedGames,
    areas: areaHits,
    filename,
    jerseys,
  };
}

function matches(photo: Photo, parsed: Parsed): boolean {
  if (parsed.level && photo.level !== parsed.level) return false;
  if (parsed.games.length && !parsed.games.some((g) => g.slug === photo.game)) return false;
  if (parsed.areas.length && !parsed.areas.some((a) => a.slug === photo.area)) return false;
  if (parsed.filename) {
    const fn = norm(photo.filename).replace(/ /g, "");
    if (!fn.includes(parsed.filename)) return false;
  }
  if (parsed.players.length) return parsed.players.some((p) => playerInPhoto(photo, p));
  if (parsed.jerseys.length) {
    return parsed.jerseys.some(
      (n) => photo.players.includes(n) || captionHasJersey(photo.caption, n)
    );
  }
  return true;
}

export function searchPhotoGroups(photos: Photo[], q: string): PhotoSearchGroup[] {
  if (!norm(q)) return [{ key: "all", label: "", photos }];
  const parsed = parsePhotoQuery(q);
  if (parsed.reject) return [];

  const hits = photos.filter((p) => matches(p, parsed));
  if (!hits.length) return [];
  if (parsed.players.length > 1) {
    return parsed.players
      .map((player) => ({
        key: `${player.level}-${player.number}`,
        label: playerLabel(player),
        photos: hits
          .filter((p) => playerInPhoto(p, player))
          .slice()
          .sort((a, b) => subjectScore(b, player) - subjectScore(a, player) || byNewest(a, b)),
      }))
      .filter((g) => g.photos.length);
  }
  if (parsed.players.length === 1) {
    const player = parsed.players[0];
    return [
      {
        key: `${player.level}-${player.number}`,
        label: playerLabel(player),
        photos: hits
          .slice()
          .sort((a, b) => subjectScore(b, player) - subjectScore(a, player) || byNewest(a, b)),
      },
    ];
  }
  if (parsed.games.length > 1) {
    return parsed.games
      .map((g) => ({
        key: g.slug,
        label: gameLabel(g),
        photos: hits.filter((p) => p.game === g.slug),
      }))
      .filter((g) => g.photos.length);
  }
  if (parsed.games.length === 1) {
    return [{ key: parsed.games[0].slug, label: gameLabel(parsed.games[0]), photos: hits }];
  }
  const areaName = parsed.areas.length === 1 ? parsed.areas[0].name : null;
  const singleLabel = parsed.filename
    ? parsed.filename.toUpperCase()
    : areaName
      ? areaName
      : parsed.level
        ? levelLabel(parsed.level)
        : "";
  return groupsByGame(hits, singleLabel, areaName);
}

export function searchPhotos(photos: Photo[], q: string): Photo[] {
  return searchPhotoGroups(photos, q).flatMap((g) => g.photos);
}
