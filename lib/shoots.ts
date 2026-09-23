export const SHOOT_PRICE_CENTS = 1500;
export const SHOOT_PRICE_LABEL = "$15";
export const SHOOT_ADMIN_EMAIL = "admin@snapcollectibles.com";

export type ShootPhoto = { src: string; caption: string };

export type ShootFolder = {
  code: string;
  title: string;
  subject: string;
  when: string;
  sample: boolean;
  listed: boolean;
  cover: string;
  photos: ShootPhoto[];
};

export const shootFolders: ShootFolder[] = [
  {
    code: "sample-maverick",
    title: "Maverick portrait",
    subject: "Sample folder",
    when: "Sample",
    sample: true,
    listed: true,
    cover: "/gallery/football-still.jpg",
    photos: [
      { src: "/gallery/football-still.jpg", caption: "Sample portrait" },
      { src: "/gallery/huddle-actual.jpg", caption: "Sample frame" },
      { src: "/gallery/practice.jpg", caption: "Sample frame" },
      { src: "/gallery/take-the-field.jpg", caption: "Sample frame" },
      { src: "/gallery/defense.jpg", caption: "Sample frame" },
      { src: "/gallery/oline.jpg", caption: "Sample frame" },
    ],
  },
  {
    code: "sample-chute",
    title: "Tunnel and sideline",
    subject: "Sample folder",
    when: "Sample",
    sample: true,
    listed: true,
    cover: "/gallery/tunnel-longhorn.jpg",
    photos: [
      { src: "/gallery/tunnel-longhorn.jpg", caption: "Sample frame" },
      { src: "/gallery/kickoff.jpg", caption: "Sample frame" },
      { src: "/gallery/endzone-catch.jpg", caption: "Sample frame" },
      { src: "/gallery/postgame.jpg", caption: "Sample frame" },
      { src: "/gallery/cheer.jpg", caption: "Sample frame" },
      { src: "/gallery/varsity-at-highlands/_DSC0004.jpg", caption: "Sample frame" },
    ],
  },
];

export function shootByCode(code: string) {
  return shootFolders.find((folder) => folder.code === code);
}

export function listedShoots() {
  return shootFolders.filter((folder) => folder.listed);
}
