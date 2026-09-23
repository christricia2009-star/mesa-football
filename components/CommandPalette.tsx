"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { games, levelLabel, playerHref, players } from "@/lib/data";
import { jerseyQuery } from "@/lib/photos";
import { usePhotos } from "./PhotoProvider";

type Hit = { href: string; title: string; sub: string };

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const router = useRouter();
  const { photos } = usePhotos();

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim().toLowerCase();
    const out: Hit[] = [];
    if (!query) {
      return [
        { href: "/photos", title: "Photos", sub: "All frames" },
        { href: "/cart", title: "Cart", sub: "$1 each · $10 a game · $20 a night" },
        { href: "/poll", title: "Player of the Week", sub: "Vote · one account, one ballot" },
        { href: "/players", title: "Roster", sub: "Get to know the Mavericks" },
        { href: "/schedule", title: "Schedule", sub: "2026 Fridays" },
      ];
    }
    const jersey = jerseyQuery(query);
    if (jersey !== null) {
      players
        .filter((p) => p.number === jersey)
        .forEach((p) => {
          out.push({
            href: playerHref(p),
            title: `${levelLabel(p.level)} #${p.number} ${p.first} ${p.last}`,
            sub: p.positions.join(" / ") || levelLabel(p.level),
          });
        });
      const tagged = photos.filter((p) => p.players.includes(jersey)).length;
      if (tagged) {
        out.push({
          href: `/photos?jersey=${jersey}`,
          title: `${tagged} frame${tagged === 1 ? "" : "s"} tagged #${jersey}`,
          sub: "Photos · exact jersey",
        });
      }
      return out.slice(0, 12);
    }
    players.forEach((p) => {
      const name = `${p.first} ${p.last}`.toLowerCase();
      if (name.includes(query)) {
        out.push({
          href: playerHref(p),
          title: `${levelLabel(p.level)} #${p.number} ${p.first} ${p.last}`,
          sub: p.positions.join(" / ") || levelLabel(p.level),
        });
      }
    });
    games.forEach((g) => {
      if (g.opponent.toLowerCase().includes(query) || g.slug.includes(query)) {
        out.push({
          href: `/games/${g.slug}`,
          title: `${levelLabel(g.level)} ${g.location === "home" ? "vs" : "@"} ${g.opponent}`,
          sub: g.date,
        });
      }
    });
    if (query === "poll" || query === "vote" || query === "potw" || query.includes("player of the week")) {
      out.push({ href: "/poll", title: "Player of the Week", sub: "Vote" });
    }
    photos.forEach((p) => {
      if (p.caption.toLowerCase().includes(query)) {
        out.push({ href: `/photos`, title: p.caption, sub: p.filename });
      }
    });
    return out.slice(0, 12);
  }, [q, photos]);

  useEffect(() => setI(0), [q, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setI((n) => Math.min(n + 1, hits.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setI((n) => Math.max(n - 1, 0));
      }
      if (e.key === "Enter" && hits[i]) {
        router.push(hits[i].href);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hits, i, onClose, router]);

  if (!open) return null;

  return (
    <div className="cmd" onClick={onClose}>
      <div className="cmd-box" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Search jersey, name, game…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="cmd-list">
          {hits.length === 0 && (
            <div className="cmd-item">No hits for “{q}”</div>
          )}
          {hits.map((h, idx) => (
            <button
              key={h.href + h.title}
              className={idx === i ? "cmd-item on" : "cmd-item"}
              onMouseEnter={() => setI(idx)}
              onClick={() => {
                router.push(h.href);
                onClose();
              }}
              style={{ width: "100%", background: "transparent", border: 0, textAlign: "left" }}
            >
              <span>{h.title}</span>
              <span>{h.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function useCommandHotkey(setOpen: (v: boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}

