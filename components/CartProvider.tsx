"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { gameBySlug } from "@/lib/data";
import type { Purchase } from "@/lib/shop";
import { usePhotos } from "./PhotoProvider";

const CART_KEY = "mavs-cart";
const ORDER_KEY = "mavs-orders";

export type PaidOrder = Purchase & { sessionId: string };

type Shot = { id: string; game: string };

type Ctx = {
  ids: string[];
  games: string[];
  nights: string[];
  count: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  addGame: (slug: string) => void;
  removeGame: (slug: string) => void;
  addNight: (date: string) => void;
  removeNight: (date: string) => void;
  clear: () => void;
  dropPurchase: (purchase: Purchase) => void;
  has: (id: string) => boolean;
  hasGame: (slug: string) => boolean;
  hasNight: (date: string) => boolean;
  covers: (photo: Shot) => boolean;
  orders: PaidOrder[];
  rememberOrder: (order: PaidOrder) => void;
  orderFor: (photo: Shot) => PaidOrder | undefined;
};

const CartCtx = createContext<Ctx | null>(null);

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { ids: [], games: [], nights: [] };
    const data = JSON.parse(raw) as unknown;
    if (Array.isArray(data)) return { ids: strings(data), games: [], nights: [] };
    if (data && typeof data === "object") {
      const rec = data as { ids?: unknown; games?: unknown; nights?: unknown };
      return { ids: strings(rec.ids), games: strings(rec.games), nights: strings(rec.nights) };
    }
  } catch {
    /* empty cart */
  }
  return { ids: [], games: [], nights: [] };
}

function readOrders(): PaidOrder[] {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const order = item as Partial<PaidOrder>;
        return {
          sessionId: typeof order.sessionId === "string" ? order.sessionId : "",
          ids: strings(order.ids),
          games: strings(order.games),
          nights: strings(order.nights),
        };
      })
      .filter((order) => order.sessionId);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { photos } = usePhotos();
  const [ids, setIds] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [nights, setNights] = useState<string[]>([]);
  const [orders, setOrders] = useState<PaidOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cart = readCart();
    setIds(cart.ids);
    setGames(cart.games);
    setNights(cart.nights);
    setOrders(readOrders());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify({ ids, games, nights }));
  }, [ids, games, nights, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  }, [orders, ready]);

  const gameOf = useCallback(
    (id: string) => photos.find((photo) => photo.id === id)?.game,
    [photos]
  );

  const add = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);
  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((item) => item !== id));
  }, []);
  const addGame = useCallback(
    (slug: string) => {
      const date = gameBySlug(slug)?.date;
      if (date && nights.includes(date)) return;
      setGames((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
      setIds((prev) => prev.filter((id) => gameOf(id) !== slug));
    },
    [gameOf, nights]
  );
  const removeGame = useCallback((slug: string) => {
    setGames((prev) => prev.filter((item) => item !== slug));
  }, []);
  const addNight = useCallback(
    (date: string) => {
      const slugs = new Set(
        photos.filter((photo) => gameBySlug(photo.game)?.date === date).map((photo) => photo.game)
      );
      setNights((prev) => (prev.includes(date) ? prev : [...prev, date]));
      setGames((prev) => prev.filter((slug) => gameBySlug(slug)?.date !== date));
      setIds((prev) => prev.filter((id) => !slugs.has(gameOf(id) || "")));
    },
    [gameOf, photos]
  );
  const removeNight = useCallback((date: string) => {
    setNights((prev) => prev.filter((item) => item !== date));
  }, []);
  const clear = useCallback(() => {
    setIds([]);
    setGames([]);
    setNights([]);
  }, []);
  const dropPurchase = useCallback(
    (purchase: Purchase) => {
      const paidIds = new Set(purchase.ids);
      const paidGames = new Set(purchase.games);
      const paidNights = new Set(purchase.nights);
      setGames((prev) => prev.filter((slug) => !paidGames.has(slug) && !paidNights.has(gameBySlug(slug)?.date || "")));
      setNights((prev) => prev.filter((date) => !paidNights.has(date)));
      setIds((prev) =>
        prev.filter((id) => {
          if (paidIds.has(id)) return false;
          const slug = gameOf(id);
          if (slug && paidGames.has(slug)) return false;
          const date = slug ? gameBySlug(slug)?.date : "";
          if (date && paidNights.has(date)) return false;
          return true;
        })
      );
    },
    [gameOf]
  );
  const rememberOrder = useCallback((order: PaidOrder) => {
    setOrders((prev) => {
      const rest = prev.filter((item) => item.sessionId !== order.sessionId);
      return [order, ...rest].slice(0, 20);
    });
  }, []);

  const value = useMemo<Ctx>(() => {
    const covered = (photo: Shot, gameList: string[], nightList: string[]) => {
      if (gameList.includes(photo.game)) return true;
      const date = gameBySlug(photo.game)?.date;
      return Boolean(date && nightList.includes(date));
    };
    return {
      ids,
      games,
      nights,
      count: ids.length + games.length + nights.length,
      add,
      remove,
      addGame,
      removeGame,
      addNight,
      removeNight,
      clear,
      dropPurchase,
      has: (id) => ids.includes(id),
      hasGame: (slug) => games.includes(slug),
      hasNight: (date) => nights.includes(date),
      covers: (photo) => ids.includes(photo.id) || covered(photo, games, nights),
      orders,
      rememberOrder,
      orderFor: (photo) =>
        orders.find(
          (order) =>
            order.ids.includes(photo.id) || covered(photo, order.games || [], order.nights || [])
        ),
    };
  }, [
    ids,
    games,
    nights,
    orders,
    add,
    remove,
    addGame,
    removeGame,
    addNight,
    removeNight,
    clear,
    dropPurchase,
    rememberOrder,
  ]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
