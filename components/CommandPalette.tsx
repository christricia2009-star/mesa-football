"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { levelLabel, playerHref } from "@/lib/data";
import { parsePhotoQuery, searchPhotos } from "@/lib/photo-search";
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
        { href: "/shoots", title: "1-1 Shoots", sub: "$15 to book · folder by QR" },
        { href: "/cart", title: "Cart", sub: "$1 each · $10 a game · $20 a night" },
        { href: "/poll", title: "Player of the Week", sub: "Vote · one account, one ballot" },
        { href: "/players", title: "Roster", sub: "The players" },
        { href: "/schedule", title: "Schedule", sub: "2026 Fridays" },
      ];
    }
    const parsed = parsePhotoQuery(query);
    if (!parsed.reject) {
      for (const p of parsed.players) {
        out.push({
          href: playerHref(p),
          title: `${levelLabel(p.level)} #${p.number} ${p.first} ${p.last}`,
          sub: p.positions.join(" / ") || "Roster",
        });
        const frames = searchPhotos(photos, `${p.level} #${p.number}`).length;
        if (frames) {
          out.push({
            href: `/photos?q=${encodeURIComponent(`${p.level} #${p.number}`)}`,
            title: `${frames} frame${frames === 1 ? "" : "s"}`,
            sub: `Photos · ${levelLabel(p.level)} #${p.number} ${p.first} ${p.last}`,
          });
        }
      }
      for (const g of parsed.games) {
        const where = g.location === "home" ? "vs" : "@";
        out.push({
          href: `/games/${g.slug}`,
          title: `${levelLabel(g.level)} ${where} ${g.opponent}`,
          sub: g.date,
        });
        const qGame = g.slug.replace(/-/g, " ");
        const frames = searchPhotos(photos, qGame).length;
        if (frames) {
          out.push({
            href: `/photos?q=${encodeURIComponent(qGame)}`,
            title: `${frames} frame${frames === 1 ? "" : "s"}`,
            sub: `Photos · ${levelLabel(g.level)} ${where} ${g.opponent}`,
          });
        }
      }
      if (!parsed.players.length && !parsed.games.length) {
        const frames = searchPhotos(photos, query).length;
        if (frames) {
          const who =
            parsed.level ? levelLabel(parsed.level) : parsed.areas[0]?.name || parsed.filename || "Photos";
          out.push({
            href: `/photos?q=${encodeURIComponent(query)}`,
            title: `${frames} frame${frames === 1 ? "" : "s"}`,
            sub: `Photos · ${who}`,
          });
        }
      }
    }
    const words = new Set(query.split(/[^a-z0-9]+/).filter(Boolean));
    const nav: Hit[] = [
      { href: "/photos", title: "Photos", sub: "All frames", keys: ["photo", "photos", "gallery"] },
      { href: "/shoots", title: "1-1 Shoots", sub: "$15 to book · folder by QR", keys: ["shoot", "shoots"] },
      { href: "/cart", title: "Cart", sub: "$1 each · $10 a game · $20 a night", keys: ["cart", "checkout"] },
      { href: "/poll", title: "Player of the Week", sub: "Vote", keys: ["poll", "vote", "potw"] },
      { href: "/players", title: "Roster", sub: "The players", keys: ["roster", "players"] },
      { href: "/schedule", title: "Schedule", sub: "2026 Fridays", keys: ["schedule"] },
      { href: "/games", title: "Albums", sub: "Game nights", keys: ["albums", "album", "games"] },
    ].flatMap(({ keys, ...hit }) => (keys.some((k) => words.has(k)) ? [hit] : []));
    if (query === "1-1" || query === "1 1") {
      nav.unshift({ href: "/shoots", title: "1-1 Shoots", sub: "$15 to book · folder by QR" });
    }
    for (const hit of nav) {
      if (!out.some((h) => h.href === hit.href && h.title === hit.title)) out.push(hit);
    }
    if (query.includes("player of the week") && !out.some((h) => h.href === "/poll")) {
      out.push({ href: "/poll", title: "Player of the Week", sub: "Vote" });
    }
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

