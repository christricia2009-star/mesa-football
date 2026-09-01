import type { Photo } from "./types";

export const LEAD_PHOTO_ID = "seed-lead-tunnel";

export const seedPhotos: Photo[] = [
  {
    id: "seed-lead-tunnel",
    src: "/gallery/tunnel-longhorn.jpg",
    filename: "tunnel-longhorn.jpg",
    originalName: "mesa-verde-tunnel.jpg",
    caption: "The tunnel. Smoke. The longhorn.",
    game: "green-orange-scrimmage",
    area: "tunnel",
    players: [],
    featured: true,
    uploadedAt: "2026-08-15T12:58:00",
    seed: true,
  },
  {
    id: "seed-burst",
    src: "/gallery/tunnel-burst.jpg",
    filename: "tunnel-burst.jpg",
    originalName: "tunnel-burst.jpg",
    caption: "Burst. #77, #50, #9 coming out of the smoke.",
    game: "green-orange-scrimmage",
    area: "tunnel",
    players: [77, 50, 9, 2, 3],
    featured: true,
    uploadedAt: "2026-08-15T13:01:00",
    seed: true,
  },
  {
    id: "seed-thirteen",
    src: "/gallery/thirteen.jpg",
    filename: "thirteen.jpg",
    originalName: "thirteen.jpg",
    caption: "#13 on the hash. Mesa Verde Sports in the background.",
    game: "green-orange-scrimmage",
    area: "sideline",
    players: [13, 23, 2],
    featured: true,
    uploadedAt: "2026-08-15T13:18:00",
    seed: true,
  },
  {
    id: "seed-take-field",
    src: "/gallery/take-the-field.jpg",
    filename: "take-the-field.jpg",
    originalName: "take-the-field.jpg",
    caption: "Take the field. Orange jerseys, green bleachers, home turf.",
    game: "green-orange-scrimmage",
    area: "field",
    players: [5, 1, 24, 55, 23, 75, 9, 17],
    featured: true,
    uploadedAt: "2026-08-15T13:04:00",
    seed: true,
  },
  {
    id: "seed-huddle-actual",
    src: "/gallery/huddle-actual.jpg",
    filename: "huddle-actual.jpg",
    originalName: "huddle.jpg",
    caption: "The huddle. #75 in the middle of the orange paint.",
    game: "green-orange-scrimmage",
    area: "field",
    players: [75, 23, 55, 28],
    featured: true,
    uploadedAt: "2026-08-15T13:12:00",
    seed: true,
  },
];

export function searchPhotos(photos: Photo[], q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return photos;
  const num = Number(query.replace(/^#/, ""));
  return photos.filter((p) => {
    if (p.caption.toLowerCase().includes(query)) return true;
    if (p.area.replace("-", " ").includes(query)) return true;
    if (p.game.replace(/-/g, " ").includes(query)) return true;
    if (p.filename.toLowerCase().includes(query)) return true;
    if (!Number.isNaN(num) && p.players.includes(num)) return true;
    if (p.players.some((n) => String(n) === query.replace(/^#/, ""))) return true;
    return false;
  });
}
