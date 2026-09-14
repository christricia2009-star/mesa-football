import type {
  Area,
  Fundraiser,
  Game,
  Player,
  SocialLink,
  StaffMember,
  TeamLevel,
} from "./types";

export const school = {
  name: "Mesa Verde High School",
  team: "Mavericks",
  city: "Citrus Heights, California",
  address: "7501 Carriage Drive, Citrus Heights, CA 95621",
  phone: "(916) 971-5288",
  colors: "Forest Green & Orange",
  motto: "Once a Maverick, Always a Maverick",
  hashtag: "#DontFlinch",
  league: "Sierra Delta League",
  section: "CIF Sac-Joaquin Section · Division VI",
  stadium: "Maverick Stadium",
  stadiumNote:
    "The home field opened in October 2023 — the first stadium in school history after 48 years of borrowed Friday nights.",
  principal: "Jennifer Petersen",
  athleticDirector: "Travis Miller",
  athleticDirectorEmail: "travis.miller@sanjuan.edu",
  schoolUrl: "https://mesaverde.sanjuan.edu/",
  ticketsUrl: "https://gofan.co/school/CA7982",
  maxPrepsUrl:
    "https://www.maxpreps.com/ca/citrus-heights/mesa-verde-mavericks/football/",
  jvMaxPrepsUrl:
    "https://www.maxpreps.com/ca/citrus-heights/mesa-verde-mavericks/football/jv/",
  juniorMavsUrl: "https://www.juniormavs.org/",
  season: "2026",
};

export const staff: StaffMember[] = [
  { name: "Brett Tujague", role: "Head Coach · VP of Athletics", level: "varsity" },
  { name: "Jeff Moenning", role: "Assistant Coach", level: "varsity" },
  { name: "Jose Garcia", role: "Assistant Coach", level: "varsity" },
  { name: "Jason Smith", role: "Assistant Coach", level: "varsity" },
  { name: "Frank Negri", role: "Assistant Coach", level: "varsity" },
  { name: "James Finch", role: "Assistant Coach", level: "varsity" },
  { name: "James Taylor", role: "Assistant Coach", level: "varsity" },
  { name: "Kyler Powell", role: "Assistant Coach", level: "varsity" },
  { name: "Fernando Rodriquez", role: "JV Head Coach", level: "jv" },
];

const varsityRoster: Omit<Player, "level">[] = [
  {
    number: 1,
    first: "Jalen",
    last: "Carey",
    grade: "So.",
    positions: ["CB", "WR"],
    height: "6'2\"",
    weight: "175 lbs",
    blurb:
      "Long, rangy cover corner who can also split out wide. A sophomore already taking varsity snaps on both sides of the ball.",
  },
  {
    number: 2,
    first: "Triton",
    last: "Robinson",
    grade: "Jr.",
    positions: ["QB", "S"],
    height: "6'2\"",
    weight: "185 lbs",
    blurb:
      "Junior signal-caller who also patrols the secondary. Dual-threat presence in Coach Tujague’s new era.",
  },
  {
    number: 3,
    first: "Rashad",
    last: "Abdullah",
    grade: "So.",
    positions: ["WR", "DB"],
    height: "6'1\"",
    weight: "180 lbs",
    blurb:
      "Athletic sophomore who can win on the outside and turn around to defend the same space. Look for him on jump balls.",
  },
  {
    number: 4,
    first: "Carter",
    last: "Murray",
    grade: "Jr.",
    positions: ["RB"],
    height: "—",
    weight: "—",
    blurb:
      "Junior running back. Between-the-tackles toughness with enough burst to hit the edge when the hole closes.",
  },
  {
    number: 5,
    first: "David",
    last: "Gavryush",
    grade: "Sr.",
    positions: ["DE", "OLB"],
    height: "5'9\"",
    weight: "180 lbs",
    blurb:
      "Senior edge rusher. Compact, violent first step and a leader on a defense that wants to set the tone on Friday nights.",
  },
  {
    number: 6,
    first: "Jayden",
    last: "Chavez",
    grade: "Jr.",
    positions: ["ILB", "QB"],
    height: "5'10\"",
    weight: "175 lbs",
    blurb:
      "Junior linebacker with quarterback experience. Reads the mesh, fills downhill, and can take a snap if the call comes.",
  },
  {
    number: 8,
    first: "Ziggy",
    last: "Kaufusi",
    grade: "Jr.",
    positions: ["WR", "CB"],
    height: "6'1\"",
    weight: "170 lbs",
    blurb:
      "Junior skill player who lives on the boundary — catching it or covering it. Length and speed in a Maverick uniform.",
  },
  {
    number: 9,
    first: "Mateo",
    last: "Washington",
    grade: "Jr.",
    positions: ["OLB", "WR"],
    height: "6'3\"",
    weight: "205 lbs",
    blurb:
      "Big-bodied junior who can rush from the edge or mismatch a linebacker in the passing game. 6'3\" frame you notice from the bleachers.",
  },
  {
    number: 10,
    first: "Elijah",
    last: "Colon",
    grade: "Sr.",
    positions: ["RB", "S"],
    height: "5'11\"",
    weight: "180 lbs",
    blurb:
      "Senior workhorse. Runs with a low pad level and turns around to play safety. Fourth-year Maverick energy.",
  },
  {
    number: 11,
    first: "Noah",
    last: "Melton",
    grade: "So.",
    positions: ["OLB", "RB"],
    height: "5'8\"",
    weight: "165 lbs",
    blurb:
      "Sophomore who plays bigger than the listed size. Physical at linebacker and a change-of-pace option in the backfield.",
  },
  {
    number: 13,
    first: "Draven",
    last: "Weldy",
    grade: "Jr.",
    positions: ["LB", "DB"],
    height: "5'8\"",
    weight: "150 lbs",
    blurb:
      "Junior defender who can line up at linebacker or in the secondary. High-motor, sideline-to-sideline closer.",
  },
  {
    number: 15,
    first: "Jeremiah",
    last: "Rodriguez",
    grade: "Jr.",
    positions: ["ILB"],
    height: "5'10\"",
    weight: "180 lbs",
    blurb:
      "Junior inside linebacker. The middle-of-the-defense communicator — fills gaps, takes on blocks, and points the front.",
  },
  {
    number: 17,
    first: "Mason",
    last: "Lewings",
    grade: "Fr.",
    positions: ["CB", "WR"],
    height: "5'11\"",
    weight: "150 lbs",
    blurb:
      "True freshman already on the varsity board. Cover corner with receiver instincts — a 2029 class name to remember.",
  },
  {
    number: 22,
    first: "Zach",
    last: "Eads",
    grade: "Jr.",
    positions: ["RB", "SS"],
    height: "5'10\"",
    weight: "175 lbs",
    blurb:
      "Junior who can take handoffs and then turn around to play strong safety. Physical runner, sure tackler.",
  },
  {
    number: 23,
    first: "Caleb",
    last: "Weddle",
    grade: "Jr.",
    positions: ["LB", "DB", "ATH"],
    height: "5'11\"",
    weight: "180 lbs",
    blurb:
      "Listed ATH for a reason. Junior who moves around the defense and can be the chess piece on Friday night.",
  },
  {
    number: 24,
    first: "Bud",
    last: "Thompson",
    grade: "So.",
    positions: ["RB", "OLB"],
    height: "5'8\"",
    weight: "150 lbs",
    blurb:
      "Sophomore back with linebacker toughness. Short-yardage mentality and a nose for contact.",
  },
  {
    number: 28,
    first: "Christian",
    last: "Cruz",
    grade: "Jr.",
    positions: ["OLB", "RB"],
    height: "5'8\"",
    weight: "150 lbs",
    blurb:
      "Junior who plays on the edge and in the backfield. Relentless pursuit, first guy downfield on kickoff nights.",
  },
  {
    number: 32,
    first: "Isaac",
    last: "Green",
    grade: "Fr.",
    positions: ["RB", "OLB"],
    height: "5'7\"",
    weight: "180 lbs",
    blurb:
      "Freshman built like a bowling ball. Compact runner who also drops into the second level on defense.",
  },
  {
    number: 50,
    first: "Sebastian",
    last: "Sierra",
    grade: "Jr.",
    positions: ["C", "DL"],
    height: "6'0\"",
    weight: "250 lbs",
    blurb:
      "Junior center who also kicks inside on the defensive line. The snap, the call, the point of attack — it starts here.",
  },
  {
    number: 51,
    first: "Christian",
    last: "Mauga",
    grade: "Jr.",
    positions: ["OT", "DT"],
    height: "6'2\"",
    weight: "270 lbs",
    blurb:
      "Junior tackle with defensive-line size. 270 pounds of Maverick green anchoring the edge of the offensive line.",
  },
  {
    number: 53,
    first: "Nam",
    last: "Nyugen",
    grade: "Jr.",
    positions: ["DL", "OL"],
    height: "5'10\"",
    weight: "215 lbs",
    blurb:
      "Junior who can play either side of the line of scrimmage. Low pad level, heavy hands, two-way trench guy.",
  },
  {
    number: 55,
    first: "Shane",
    last: "Thomas",
    grade: "Sr.",
    positions: ["OL", "DE"],
    height: "6'1\"",
    weight: "210 lbs",
    blurb:
      "Senior lineman who can also rush from the edge. Fourth-year veteran of the green table.",
  },
  {
    number: 63,
    first: "Brandon",
    last: "Salcido",
    grade: "Sr.",
    positions: ["OG", "DE"],
    height: "6'3\"",
    weight: "240 lbs",
    blurb:
      "Senior guard with pass-rush experience. 6'3\", 240, and a name that showed up in last season’s recaps. Leadership in the trenches.",
  },
  {
    number: 68,
    first: "Riley",
    last: "Meyer",
    grade: "Sr.",
    positions: ["OG", "DL"],
    height: "5'10\"",
    weight: "260 lbs",
    blurb:
      "Senior interior lineman. 260 pounds of leverage. The kind of player who makes the highlight reels possible.",
  },
  {
    number: 72,
    first: "Josiah",
    last: "Cummings",
    grade: "So.",
    positions: ["DL", "OL"],
    height: "5'10\"",
    weight: "240 lbs",
    blurb:
      "Sophomore two-way lineman. Already a 240-pound body in the middle of the defense with room to grow.",
  },
  {
    number: 73,
    first: "Eric",
    last: "Alvarez",
    grade: "Jr.",
    positions: ["OL", "DL"],
    height: "5'6\"",
    weight: "180 lbs",
    blurb:
      "Junior who wins with leverage. Shorter than the tackle next to him and meaner at the point of attack.",
  },
  {
    number: 75,
    first: "Reggie",
    last: "Thigpen",
    grade: "So.",
    positions: ["OT", "DE"],
    height: "6'6\"",
    weight: "250 lbs",
    blurb:
      "Sophomore tackle with a 6'6\" frame you can see from the student section. Future of the Maverick offensive line.",
  },
  {
    number: 77,
    first: "Johann",
    last: "Moreno",
    grade: "Sr.",
    positions: ["OG", "DT"],
    height: "5'10\"",
    weight: "230 lbs",
    blurb:
      "Senior interior piece. Played a two-way role last fall and still has the extra-point leg when the call comes.",
  },
  {
    number: 97,
    first: "Yuri",
    last: "Babikov",
    grade: "Jr.",
    positions: ["DL", "OT"],
    height: "6'4\"",
    weight: "250 lbs",
    blurb:
      "Junior defensive lineman with tackle length. 6'4\", 250 — a problem for opposing backfields and a body that can swing to the offensive tackle spot.",
  },
];

const jvRoster: Omit<Player, "level">[] = [
  { number: 1, first: "Deangelo", last: "Martinez", grade: "So.", positions: [], height: "—", weight: "—", blurb: "Sophomore on the JV board." },
  { number: 3, first: "Kamden", last: "Martens", grade: "So.", positions: [], height: "—", weight: "—", blurb: "Sophomore on the JV board." },
  { number: 4, first: "London", last: "Colon", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 5, first: "Greyson", last: "Sellers", grade: "So.", positions: [], height: "—", weight: "—", blurb: "Sophomore on the JV board." },
  { number: 6, first: "Jayden", last: "Wilhelm", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 9, first: "Daniel", last: "Munoz", grade: "So.", positions: [], height: "—", weight: "—", blurb: "Sophomore on the JV board." },
  { number: 12, first: "Nathan", last: "Prado", grade: "So.", positions: [], height: "—", weight: "—", blurb: "Sophomore on the JV board." },
  { number: 13, first: "Connor", last: "Jacobs", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 15, first: "Colton", last: "Worsham", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 17, first: "Cameron", last: "Cason", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 19, first: "Adrian", last: "Aguilar", grade: "So.", positions: [], height: "—", weight: "—", blurb: "Sophomore on the JV board." },
  { number: 22, first: "Mason", last: "VanDyke", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 23, first: "Adrian", last: "Singh", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 24, first: "Connor", last: "Gay", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 33, first: "Eli", last: "Flanagan", grade: "So.", positions: [], height: "—", weight: "—", blurb: "Sophomore on the JV board. #33 vs Oakmont." },
  { number: 34, first: "Turras", last: "Buggs", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 36, first: "Royce", last: "Cattaneo", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 55, first: "Adrian", last: "Romero", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 59, first: "Joel", last: "Pennucci", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 60, first: "Villiam", last: "Gudyma", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 62, first: "Juan", last: "Guzman", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 68, first: "Loyal", last: "Toetu Melei-Ma'Ae", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 70, first: "Giovanni", last: "Montoya", grade: "So.", positions: [], height: "—", weight: "—", blurb: "Sophomore on the JV board." },
  { number: 72, first: "Justin", last: "Whitehurst", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 73, first: "Jude", last: "McGuire", grade: "Jr.", positions: [], height: "—", weight: "—", blurb: "Junior on the JV board." },
  { number: 75, first: "Joseph", last: "Ambagis", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 77, first: "Jose", last: "Prieto", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 81, first: "JayDeauin", last: "Williamson", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 98, first: "Joseph", last: "Tollestrop", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
  { number: 99, first: "Matthew", last: "Peterson", grade: "Fr.", positions: [], height: "—", weight: "—", blurb: "Freshman on the JV board." },
];

export const players: Player[] = [
  ...varsityRoster.map((p) => ({ ...p, level: "varsity" as const })),
  ...jvRoster.map((p) => ({ ...p, level: "jv" as const })),
];

export const games: Game[] = [
  {
    slug: "green-orange-scrimmage",
    level: "varsity",
    date: "2026-08-15",
    opponent: "Green vs Orange",
    mascot: "Scrimmage",
    location: "home",
    venue: "Maverick Stadium",
    kickoff: "1:00 PM",
    league: false,
    photoNight: true,
    confirmed: true,
    note: "Annual intra-squad scrimmage — new era of Maverick football.",
    cover: "/gallery/tunnel-burst.jpg",
  },
  {
    slug: "jv-vs-oakmont",
    level: "jv",
    date: "2026-08-28",
    opponent: "Oakmont",
    mascot: "Vikings",
    location: "home",
    venue: "Maverick Stadium",
    kickoff: "5:00 PM",
    league: false,
    photoNight: true,
    confirmed: true,
    result: "L 6–35",
    note: "JV home opener. Oakmont 35–6 (MaxPreps).",
    cover: "/gallery/jv-oakmont/IMG_6839.jpg",
  },
  {
    slug: "vs-st-vincent",
    level: "varsity",
    date: "2026-08-28",
    opponent: "St. Vincent",
    mascot: "Mustangs",
    location: "home",
    venue: "Maverick Stadium",
    kickoff: "7:00 PM",
    league: false,
    photoNight: true,
    confirmed: true,
    result: "L 0–40",
    note: "Varsity home opener. St. Vincent (Petaluma) 40–0.",
    cover: "/gallery/varsity-st-vincent/IMG_6746.jpg",
  },
  {
    slug: "at-armijo",
    level: "varsity",
    date: "2026-09-04",
    opponent: "Armijo",
    mascot: "Thunderbirds",
    location: "away",
    venue: "Armijo High School, Fairfield",
    kickoff: "7:00 PM",
    league: false,
    photoNight: false,
    confirmed: true,
    cover: "/gallery/take-the-field.jpg",
  },
  {
    slug: "jv-vs-golden-sierra",
    level: "jv",
    date: "2026-09-11",
    opponent: "Golden Sierra",
    mascot: "Grizzlies",
    location: "home",
    venue: "Maverick Stadium",
    kickoff: "5:00 PM",
    league: true,
    photoNight: true,
    confirmed: true,
    result: "L 0–14",
    note: "JV league opener. Golden Sierra 14–0 (MaxPreps).",
    cover: "/gallery/jv-golden-sierra/_DSC9106.jpg",
  },
  {
    slug: "vs-golden-sierra",
    level: "varsity",
    date: "2026-09-11",
    opponent: "Golden Sierra",
    mascot: "Grizzlies",
    location: "home",
    venue: "Maverick Stadium",
    kickoff: "7:15 PM",
    league: true,
    photoNight: true,
    confirmed: true,
    result: "L 7–28",
    note: "League opener. Golden Sierra (Garden Valley) 28–7 (MaxPreps).",
    cover: "/gallery/varsity-golden-sierra/_DSC9174.jpg",
  },
  {
    slug: "at-highlands",
    level: "varsity",
    date: "2026-09-18",
    opponent: "Highlands",
    mascot: "Scots",
    location: "away",
    venue: "Highlands High School, North Highlands",
    kickoff: "7:00 PM",
    league: true,
    photoNight: false,
    confirmed: true,
    note: "League night on the road (MaxPreps). Next home photo night is still TBA on the later slate.",
    cover: "/gallery/huddle-actual.jpg",
  },
  {
    slug: "at-vacaville-christian",
    level: "varsity",
    date: "2026-09-25",
    opponent: "Vacaville Christian",
    mascot: "Lions",
    location: "away",
    venue: "Vacaville Christian",
    kickoff: "7:00 PM",
    league: true,
    photoNight: false,
    confirmed: false,
    cover: "/gallery/thirteen.jpg",
  },
  {
    slug: "vs-woodland-christian",
    level: "varsity",
    date: "2026-10-02",
    opponent: "Woodland Christian",
    mascot: "Cardinals",
    location: "home",
    venue: "Maverick Stadium",
    kickoff: "7:00 PM",
    league: true,
    photoNight: true,
    confirmed: false,
    cover: "/gallery/huddle-actual.jpg",
  },
  {
    slug: "bye-week",
    level: "varsity",
    date: "2026-10-09",
    opponent: "Bye Week",
    mascot: "Open",
    location: "home",
    venue: "—",
    kickoff: "—",
    league: false,
    photoNight: false,
    confirmed: false,
    note: "Placeholder open date. Use it for a team dinner, lift session, or senior banner photos.",
    cover: "/gallery/thirteen.jpg",
  },
  {
    slug: "at-lindhurst",
    level: "varsity",
    date: "2026-10-16",
    opponent: "Lindhurst",
    mascot: "Blazers",
    location: "away",
    venue: "Lindhurst High School, Olivehurst",
    kickoff: "7:00 PM",
    league: true,
    photoNight: false,
    confirmed: false,
    cover: "/gallery/take-the-field.jpg",
  },
  {
    slug: "vs-highlands",
    level: "varsity",
    date: "2026-10-23",
    opponent: "Highlands",
    mascot: "Scots",
    location: "home",
    venue: "Maverick Stadium",
    kickoff: "7:00 PM",
    league: true,
    photoNight: true,
    confirmed: false,
    cover: "/gallery/thirteen.jpg",
  },
  {
    slug: "at-san-juan",
    level: "varsity",
    date: "2026-10-30",
    opponent: "San Juan",
    mascot: "Spartans",
    location: "away",
    venue: "San Juan High School, Citrus Heights",
    kickoff: "7:00 PM",
    league: true,
    photoNight: false,
    confirmed: false,
    note: "Citrus Heights neighborhood night. Confirm home/away with the league office.",
    cover: "/gallery/tunnel-burst.jpg",
  },
];

export const areas: Area[] = [
  {
    slug: "sideline",
    name: "Sideline",
    short: "The bench",
    description:
      "Headsets, chain gang, orange towels, and the next play. Tight portraits and celebration frames from field level.",
    cover: "/gallery/thirteen.jpg",
  },
  {
    slug: "end-zone",
    name: "End Zone",
    short: "Paydirt",
    description:
      "The orange paint. Jump balls, goal-line stands, and the shot every family wants — a Maverick in the end zone.",
    cover: "/gallery/huddle-actual.jpg",
  },
  {
    slug: "student-section",
    name: "Student Section",
    short: "The roar",
    description:
      "Green and orange in the bleachers. Spirit, signs, and the noise that makes a new stadium feel like it has always been here.",
    cover: "/gallery/take-the-field.jpg",
  },
  {
    slug: "cheer",
    name: "Cheer",
    short: "Sideline energy",
    description:
      "Maverick cheer on the track. Halftime, timeouts, and the tunnel when the team takes the field.",
    cover: "/gallery/tunnel-burst.jpg",
  },
  {
    slug: "band",
    name: "Band",
    short: "World famous",
    description:
      "The PA still calls them world famous. Pregame, halftime, and the fight song after every Maverick score.",
    cover: "/gallery/take-the-field.jpg",
  },
  {
    slug: "tunnel",
    name: "Tunnel",
    short: "Burst",
    description:
      "The inflatable, the smoke, the longhorn. The first frame of every home Friday.",
    cover: "/gallery/tunnel-longhorn.jpg",
  },
  {
    slug: "press-box",
    name: "Press Box",
    short: "High and wide",
    description:
      "From the box: formations, the full field, and the stadium lights hitting the new turf.",
    cover: "/gallery/take-the-field.jpg",
  },
  {
    slug: "concessions",
    name: "Concessions",
    short: "The plaza",
    description:
      "Hot dogs, spirit wear, and the families who keep Friday night running. Community frames, not just football frames.",
    cover: "/gallery/thirteen.jpg",
  },
  {
    slug: "field",
    name: "Field Level",
    short: "Between the hashes",
    description:
      "Hash-mark football. Trenches, handoffs, and the walk-out in orange.",
    cover: "/gallery/take-the-field.jpg",
  },
  {
    slug: "postgame",
    name: "Postgame",
    short: "After the lights",
    description:
      "Helmets off, handshakes, seniors with families, and the walk back to the locker room.",
    cover: "/gallery/thirteen.jpg",
  },
];

export const fundraisers: Fundraiser[] = [
  {
    slug: "booster-club",
    title: "Maverick Football Boosters",
    status: "season",
    when: "All season",
    summary:
      "The parent engine behind Friday nights — film, meals, senior night, and the little things that make a program feel like a family.",
    how: "Join at the next home game table or email the athletic office. Dues go straight back to the program.",
    contact: "travis.miller@sanjuan.edu",
  },
  {
    slug: "spirit-wear",
    title: "Spirit Wear Table",
    status: "open",
    when: "Every home Friday",
    summary:
      "Hunter green hoodies, blaze orange tees, and the gear you actually want to wear to the grocery store on Saturday.",
    how: "Cash, card, and Venmo at the plaza table.",
    contact: "Concessions plaza · Maverick Stadium",
  },
  {
    slug: "concessions",
    title: "Friday Night Concessions",
    status: "open",
    when: "Home games · gates open 5:30 PM",
    summary:
      "The most important drive of the night might be the one to the snack bar. Volunteers needed each photo night.",
    how: "Sign up for a quarter. Families who work a shift eat free that night.",
    contact: "Sign-up clipboard at the gate",
  },
  {
    slug: "program-ads",
    title: "Game Program Ads",
    status: "open",
    when: "Close Friday, Sept 11",
    summary:
      "Local businesses and family shout-outs in the printed home program. A full-page ‘Go Mavs’ is the best $100 you will spend this fall.",
    how: "Send a logo or a senior message. We handle layout. Checks to MVHS Football Boosters.",
    contact: "travis.miller@sanjuan.edu",
  },
  {
    slug: "senior-banners",
    title: "Senior Night Banners",
    status: "coming",
    when: "Orders open in October",
    summary:
      "Fence-line banners for the senior class — name, number, and a photo from this site, printed large enough for grandma to see from the top row.",
    how: "Pick a favorite frame from the photos (true-resolution download), then submit the order form.",
    contact: "travis.miller@sanjuan.edu",
  },
  {
    slug: "fifty-fifty",
    title: "50/50 Raffle",
    status: "open",
    when: "Halftime, every home game",
    summary:
      "Tickets during the first half. Winner announced at the start of the third. Split with the program.",
    how: "Buy tickets from the student section runners in orange.",
    contact: "Student section aisle",
  },
  {
    slug: "team-dinner",
    title: "Thursday Team Dinners",
    status: "season",
    when: "Thursdays · 6:00 PM",
    summary:
      "Pasta, protein, and a film clip. Host families rotate. The team that eats together hits together.",
    how: "Volunteer to host or drop a tray. Sign-up goes out Sunday night.",
    contact: "Team parent text thread",
  },
  {
    slug: "lift-a-thon",
    title: "Hammerhead Lift-a-Thon",
    status: "coming",
    when: "October · weight room",
    summary:
      "Linemen win games. Sponsors pledge per rep. Helmets, sled, and the green table on full display.",
    how: "Sponsor a lineman by jersey number. Watch the live board on this site the day of.",
    contact: "Coach Tujague · btujague@sanjuan.edu",
  },
];

export const social: SocialLink[] = [
  {
    name: "Instagram",
    handle: "@mesaverdeathletics",
    href: "https://www.instagram.com/mesaverdeathletics/",
    note: "Official athletics — we do not manage this account.",
  },
  {
    name: "X / Twitter",
    handle: "@mesaverdesports",
    href: "https://x.com/mesaverdesports",
    note: "School sports feed — we do not manage this account.",
  },
  {
    name: "Instagram (ASB)",
    handle: "@mvhsconnect",
    href: "https://www.instagram.com/mvhsconnect/",
    note: "Student government — we do not manage this account.",
  },
  {
    name: "Facebook",
    handle: "MVHS Athletics",
    href: "https://www.facebook.com/search/top/?q=Mesa%20Verde%20High%20School%20Athletics",
    note: "Search the school athletics page — we do not manage this account.",
  },
  {
    name: "School site",
    handle: "mesaverde.sanjuan.edu",
    href: "https://mesaverde.sanjuan.edu/",
    note: "San Juan Unified official campus site.",
  },
  {
    name: "Tickets",
    handle: "GoFan",
    href: "https://gofan.co/school/CA7982",
    note: "Digital tickets for home (and most away) games.",
  },
  {
    name: "Junior Mavs",
    handle: "juniormavs.org",
    href: "https://www.juniormavs.org/",
    note: "Youth football & cheer feeder program.",
  },
];

export function playerByNumber(n: number, level: TeamLevel = "varsity") {
  return players.find((p) => p.number === n && p.level === level);
}

export function playerName(n: number, level: TeamLevel = "varsity") {
  const p = playerByNumber(n, level);
  return p ? `${p.first} ${p.last}` : `#${n}`;
}

export function playerHref(p: Pick<Player, "level" | "number">) {
  return `/players/${p.level}/${p.number}`;
}

export function levelLabel(level: TeamLevel) {
  return level === "jv" ? "JV" : "Varsity";
}

export function gameBySlug(slug: string) {
  return games.find((g) => g.slug === slug);
}

export function areaBySlug(slug: string) {
  return areas.find((a) => a.slug === slug);
}

export function nextHomeGame(from = new Date()) {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  return games.find((g) => {
    if (g.location !== "home" || !g.photoNight) return false;
    if (g.slug === "bye-week" || g.slug === "green-orange-scrimmage") return false;
    const d = new Date(g.date + "T19:00:00");
    return d >= start && !g.result;
  });
}

export function formatGameDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
