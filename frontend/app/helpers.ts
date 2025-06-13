import type { LeagueItem } from "./types";

export function getItemIcon(item: LeagueItem) {
  return `/icons/${item.item_id}.png`;
}
