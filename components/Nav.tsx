"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { facebookPage } from "@/lib/data";
import { useCart } from "./CartProvider";

const links = [
  { href: "/photos", label: "Photos" },
  { href: "/shoots", label: "Shoots" },
  { href: "/games", label: "Albums" },
  { href: "/players", label: "Roster" },
  { href: "/poll", label: "Vote" },
  { href: "/schedule", label: "Schedule" },
  { href: "/fundraisers", label: "Boost" },
];

export default function Nav({ onSearch }: { onSearch: () => void }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className={open ? "nav open" : "nav"}>
      <Link href="/" className="nav-brand" onClick={() => setOpen(false)}>
        <img src="/brand/maverick-crest.jpg" alt="Mesa Verde Mavericks crest" />
        <span className="nav-brand-text">
          <strong>MESA VERDE</strong>
          <span>Mavericks Football</span>
        </span>
      </Link>
      <nav className="nav-links">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={path.startsWith(l.href) ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="nav-actions">
        <Link href="/cart" className={path.startsWith("/cart") ? "pill nav-cart on" : "pill nav-cart"}>
          Cart{count ? ` ${count}` : ""}
        </Link>
        <a
          className="pill nav-follow"
          href={facebookPage.href}
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
        <button className="pill nav-search" onClick={onSearch} aria-label="Search" title="Search (⌘K)">
          Search
        </button>
        <button
          className="icon-btn nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
