export type Grade = "Fr." | "So." | "Jr." | "Sr.";

export type AreaSlug =
  | "sideline"
  | "end-zone"
  | "student-section"
  | "cheer"
  | "band"
  | "tunnel"
  | "press-box"
  | "concessions"
  | "field"
  | "postgame";

export interface Player {
  number: number;
  first: string;
  last: string;
  grade: Grade;
  positions: string[];
  height: string;
  weight: string;
  blurb: string;
}

export interface StaffMember {
  name: string;
  role: string;
}

export interface Game {
  slug: string;
  date: string;
  opponent: string;
  mascot: string;
  location: "home" | "away";
  venue: string;
  kickoff: string;
  league: boolean;
  photoNight: boolean;
  confirmed: boolean;
  result?: string;
  note?: string;
  cover: string;
}

export interface Area {
  slug: AreaSlug;
  name: string;
  short: string;
  description: string;
  cover: string;
}

export interface Fundraiser {
  slug: string;
  title: string;
  status: "open" | "coming" | "season";
  when: string;
  summary: string;
  how: string;
  contact: string;
}

export interface Photo {
  id: string;
  src: string;
  filename: string;
  caption: string;
  game: string;
  area: AreaSlug;
  players: number[];
  featured?: boolean;
  width?: number;
  height?: number;
  uploadedAt: string;
  originalName: string;
  bytes?: number;
  seed?: boolean;
}

export interface SocialLink {
  name: string;
  handle: string;
  href: string;
  note: string;
}
