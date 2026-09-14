"use client";

import { useEffect, useState } from "react";
import type { TeamLevel } from "@/lib/types";

export default function PotwMark({
  level,
  number,
}: {
  level: TeamLevel;
  number: number;
}) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/poll", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const board = (data.boards || []).find((b: { level: TeamLevel }) => b.level === level);
        if (!board) return;
        const won = (board.winners || []).some(
          (w: { level: TeamLevel; number: number }) => w.level === level && w.number === number
        );
        if (won) setLabel(`${level === "jv" ? "JV" : "Varsity"} Player of the Week`);
      })
      .catch(() => {});
  }, [level, number]);
  if (!label) return null;
  return <div className="potw-badge">{label}</div>;
}
