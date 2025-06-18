import { diffWords } from "diff";
import type { DiffLeagueItem, LeagueItem } from "~/leagueItem";
import { LeagueItemCompareKeys } from "~/leagueItem";

/*
note the naming is confusing, because itemList is in reverse chronological order
so, 'olderItem' is the previous version, aka the 'new' object we are comparing against the known 'newerItem'
if different -> return true, at which point the caller should emit items up to newerItem,
then set olderItem as the new cached item to consider
*/
export function compareItem(newerItem: LeagueItem | null, olderItem: LeagueItem) {
  // first of all if it's the first item, or if theres an motd, then we always want to show it
  if (newerItem === null || newerItem.motd !== undefined) {
    return true;
  }

  for (const key of LeagueItemCompareKeys) {
    if (newerItem[key] !== olderItem[key]) {
      return true;
    }
  }
  return false;
}

export function createDiffItem(newerItem: LeagueItem, olderItem: LeagueItem): DiffLeagueItem {
  const oldKeys = Object.keys(olderItem) as (keyof LeagueItem)[];
  const newKeys = Object.keys(newerItem) as (keyof LeagueItem)[];
  const allExistingKeys = Array.from(new Set([...oldKeys, ...newKeys]));

  const diffItem: DiffLeagueItem = {};
  // item_id -> always directly use
  // motd -> directly use if being added, but do not include if being deleted
  // everything else -> change object
  for (const key of allExistingKeys) {
    if (key === "item_id") {
      diffItem[key] = newerItem[key];
    } else if (key !== "motd" && key !== "patch_version") {
      const oldStr = oldKeys.includes(key) ? olderItem[key]!.toString() : "";
      const newStr = newKeys.includes(key) ? newerItem[key]!.toString() : "";
      diffItem[key] = oldStr === newStr ? oldStr : diffWords(oldStr, newStr);
    } else if (key === "motd" && newKeys.includes("motd")) {
      diffItem[key] = newerItem[key];
    }
  }

  return diffItem;
}
