"use client";

import { useState } from "react";
import Nav from "./Nav";
import CommandPalette, { useCommandHotkey } from "./CommandPalette";
import { PhotoProvider } from "./PhotoProvider";

export default function Shell({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState(false);
  useCommandHotkey(setSearch);

  return (
    <PhotoProvider>
      <div className="grain" aria-hidden />
      <Nav onSearch={() => setSearch(true)} />
      {children}
      <CommandPalette open={search} onClose={() => setSearch(false)} />
    </PhotoProvider>
  );
}
