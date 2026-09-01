import type { Player } from "@/lib/types";

export default function Jersey({
  player,
  huge = false,
}: {
  player: Player;
  huge?: boolean;
}) {
  return (
    <div className="jersey-card" style={huge ? { minHeight: 320, padding: 28 } : undefined}>
      <span className="jersey-grade">{player.grade}</span>
      <div
        className="jersey-num"
        style={huge ? { fontSize: 140 } : undefined}
      >
        {player.number}
      </div>
      <div>
        <div className="jersey-name">
          {player.first} {player.last}
        </div>
        <div className="jersey-pos">{player.positions.join(" · ")}</div>
      </div>
    </div>
  );
}
