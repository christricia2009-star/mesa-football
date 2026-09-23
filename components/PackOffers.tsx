"use client";

import { usePhotos } from "./PhotoProvider";
import { useCart } from "./CartProvider";
import { gameBySlug } from "@/lib/data";
import { GAME_PRICE_LABEL, listDeals, NIGHT_PRICE_LABEL } from "@/lib/shop";

export default function PackOffers({
  onlySlug,
  onlyDate,
}: {
  onlySlug?: string;
  onlyDate?: string;
}) {
  const { photos } = usePhotos();
  const { addGame, removeGame, addNight, removeNight, hasGame, hasNight } = useCart();
  const deals = listDeals(photos).filter((deal) => {
    if (!onlySlug && !onlyDate) return true;
    const date = onlyDate || (onlySlug ? gameBySlug(onlySlug)?.date : "");
    if (deal.kind === "night") return deal.date === date;
    if (onlySlug) return deal.slug === onlySlug;
    return deal.date === date;
  });
  if (!deals.length) return null;

  return (
    <div className="pack-offers">
      {!onlySlug && !onlyDate && <div className="kicker pack-kicker">Buy a set</div>}
      {deals.map((deal) => {
        if (deal.kind === "night") {
          const on = hasNight(deal.date);
          return (
            <button
              key={`night-${deal.date}`}
              className={on ? "pill orange" : "pill"}
              onClick={() => (on ? removeNight(deal.date) : addNight(deal.date))}
            >
              {deal.label} · {deal.count} photos · {on ? "Added" : NIGHT_PRICE_LABEL}
            </button>
          );
        }
        const inNight = hasNight(deal.date);
        const on = hasGame(deal.slug) || inNight;
        return (
          <button
            key={deal.slug}
            className={on ? "pill orange" : "pill"}
            onClick={() => {
              if (inNight) return;
              if (hasGame(deal.slug)) removeGame(deal.slug);
              else addGame(deal.slug);
            }}
          >
            {deal.label} · {deal.count} photos · {inNight ? "In the night" : on ? "Added" : GAME_PRICE_LABEL}
          </button>
        );
      })}
    </div>
  );
}
