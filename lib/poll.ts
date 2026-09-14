import { playerByNumber } from "./data";
import type { TeamLevel } from "./types";

export type PollCandidate = {
  level: TeamLevel;
  number: number;
  photo: string;
  blurb: string;
};

export type PollWeek = {
  id: string;
  level: TeamLevel;
  title: string;
  weekLabel: string;
  game: string;
  opensAt: string;
  closesAt: string;
  candidates: PollCandidate[];
};

const opensAt = "2026-09-12T08:00:00-07:00";
const closesAt = "2026-09-15T12:00:00-07:00";
const weekLabel = "After Golden Sierra · Sep 11";

/** Edit these each Monday. Four names from last Friday’s frames, per board. */
export const currentPolls: Record<TeamLevel, PollWeek> = {
  varsity: {
    id: "2026-09-11-varsity",
    level: "varsity",
    title: "Varsity Player of the Week",
    weekLabel,
    game: "vs-golden-sierra",
    opensAt,
    closesAt,
    candidates: [
      {
        level: "varsity",
        number: 2,
        photo: "/gallery/varsity-golden-sierra/_DSC9321.jpg",
        blurb: "Tunnel flag. Gun. The Friday night quarterback.",
      },
      {
        level: "varsity",
        number: 3,
        photo: "/gallery/varsity-golden-sierra/_DSC9539.jpg",
        blurb: "Sideline to sideline. The hash belongs to him.",
      },
      {
        level: "varsity",
        number: 9,
        photo: "/gallery/varsity-golden-sierra/_DSC9341.jpg",
        blurb: "Scoreboard over the shoulder. 6'3\" on the edge.",
      },
      {
        level: "varsity",
        number: 77,
        photo: "/gallery/varsity-golden-sierra/_DSC9514.jpg",
        blurb: "Captain sticker. The point of attack starts here.",
      },
    ],
  },
  jv: {
    id: "2026-09-11-jv",
    level: "jv",
    title: "JV Player of the Week",
    weekLabel,
    game: "jv-vs-golden-sierra",
    opensAt,
    closesAt,
    candidates: [
      {
        level: "jv",
        number: 3,
        photo: "/gallery/jv-golden-sierra/_DSC9106.jpg",
        blurb: "In the gun. JV #3 putting it on the hash.",
      },
      {
        level: "jv",
        number: 4,
        photo: "/gallery/jv-golden-sierra/_DSC8962.jpg",
        blurb: "At the LOS. London Colon on the orange paint.",
      },
      {
        level: "jv",
        number: 5,
        photo: "/gallery/jv-golden-sierra/_DSC9170.jpg",
        blurb: "Helmet off. Greyson Sellers after the lights.",
      },
      {
        level: "jv",
        number: 6,
        photo: "/gallery/jv-golden-sierra/_DSC8924.jpg",
        blurb: "With the coach. Jayden Wilhelm on Friday afternoon.",
      },
    ],
  },
};

export const pollBoards: TeamLevel[] = ["varsity", "jv"];

export function pollByLevel(level: TeamLevel) {
  return currentPolls[level];
}

export function pollIsOpen(week: PollWeek, at = new Date()) {
  return at >= new Date(week.opensAt) && at < new Date(week.closesAt);
}

export function resolveCandidate(c: PollCandidate) {
  const player = playerByNumber(c.number, c.level);
  return { ...c, player };
}
