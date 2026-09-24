export const SHOOT_PRICE_CENTS = 1500;
export const SHOOT_PRICE_LABEL = "$15";
export const SHOOT_ADMIN_EMAIL = "admin@snapcollectibles.com";

export type ShootPhoto = { src: string; caption: string };

export type ShootFolder = {
  code: string;
  title: string;
  subject: string;
  when: string;
  listed: boolean;
  cover: string;
  photos: ShootPhoto[];
};

export const shootFolders: ShootFolder[] = [
  {
    code: "0828-sideline",
    title: "Sideline portrait",
    subject: "Varsity sideline",
    when: "Fri, Aug 28",
    listed: true,
    cover: "/gallery/football-still.jpg",
    photos: [
      { src: "/gallery/football-still.jpg", caption: "Ball on the 40 before kickoff." },
      { src: "/gallery/huddle-actual.jpg", caption: "The huddle." },
      { src: "/gallery/practice.jpg", caption: "Early work on the field." },
      { src: "/gallery/take-the-field.jpg", caption: "Taking the field." },
      { src: "/gallery/defense.jpg", caption: "Stop on the goal line." },
      { src: "/gallery/oline.jpg", caption: "Line set." },
    ],
  },
  {
    code: "0911-tunnel",
    title: "Tunnel and sideline",
    subject: "Home Friday",
    when: "Fri, Sep 11",
    listed: true,
    cover: "/gallery/tunnel-longhorn.jpg",
    photos: [
      { src: "/gallery/tunnel-longhorn.jpg", caption: "Out of the chute." },
      { src: "/gallery/kickoff.jpg", caption: "Kickoff." },
      { src: "/gallery/endzone-catch.jpg", caption: "Reach in the end zone." },
      { src: "/gallery/postgame.jpg", caption: "Walking off." },
      { src: "/gallery/cheer.jpg", caption: "Cheer line." },
      { src: "/gallery/varsity-at-highlands/_DSC0004.jpg", caption: "Friday night frame." },
    ],
  },
];

export function shootByCode(code: string) {
  return shootFolders.find((folder) => folder.code === code);
}

export function listedShoots() {
  return shootFolders.filter((folder) => folder.listed);
}
