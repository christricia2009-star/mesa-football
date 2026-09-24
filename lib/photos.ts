import { goldenSierraPhotos } from "./goldenSierraPhotos";
import { highlandsPhotos } from "./highlandsPhotos";
import { jvGoldenSierraPhotos } from "./jvGoldenSierraPhotos";
import { jvHighlandsPhotos } from "./jvHighlandsPhotos";
import { oakmontPhotos } from "./oakmontPhotos";
import { stVincentPhotos } from "./stVincentPhotos";
import type { Photo } from "./types";

export const LEAD_PHOTO_ID = "seed-lead-tunnel";

const varsityPhotos: Photo[] = [
  {
    id: "seed-lead-tunnel",
    src: "/gallery/tunnel-longhorn.jpg",
    filename: "tunnel-longhorn.jpg",
    originalName: "tunnel-longhorn.jpg",
    caption: "The chute. Team tunnel on the turf, bleachers behind it.",
    game: "intra-squad-scrimmage",
    level: "varsity",
    area: "tunnel",
    players: [],
    featured: true,
    uploadedAt: "2026-08-15T12:58:00",
    bytes: 8858075,
    seed: true,
  },
  {
    id: "seed-burst",
    src: "/gallery/tunnel-burst.jpg",
    filename: "tunnel-burst.jpg",
    originalName: "tunnel-burst.jpg",
    caption: "Burst. #77, #50, #9 coming out of the smoke.",
    game: "intra-squad-scrimmage",
    level: "varsity",
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
    caption: "#13 on the hash.",
    game: "intra-squad-scrimmage",
    level: "varsity",
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
    caption: "Take the field. Home turf.",
    game: "intra-squad-scrimmage",
    level: "varsity",
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
    caption: "The huddle. #75 in the middle.",
    game: "intra-squad-scrimmage",
    level: "varsity",
    area: "field",
    players: [75, 23, 55, 28],
    featured: true,
    uploadedAt: "2026-08-15T13:12:00",
    seed: true,
  },
];

export const seedPhotos: Photo[] = [
  ...varsityPhotos,
  ...stVincentPhotos,
  ...oakmontPhotos,
  ...goldenSierraPhotos,
  ...jvGoldenSierraPhotos,
  ...highlandsPhotos,
  ...jvHighlandsPhotos,
];

export { jerseyQuery, searchPhotoGroups, searchPhotos } from "./photo-search";
export type { PhotoSearchGroup } from "./photo-search";
