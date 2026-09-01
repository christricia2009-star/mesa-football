import GamesBoard from "./ui";

export const metadata = { title: "Game Albums" };

export default function GamesPage() {
  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Albums</div>
          <h1 className="display lg">
            GAME <span className="orange">NIGHTS</span>
          </h1>
          <hr className="rule" />
          <p>
            Varsity and JV albums are split. Home games are photo nights. Away
            games stay on the board so the season reads as a single story.
          </p>
        </div>
      </div>
      <GamesBoard />
    </main>
  );
}
