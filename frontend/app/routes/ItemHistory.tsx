import { useQuery } from "@tanstack/react-query";
import { diffWords } from "diff";
import React, { useState } from "react";
import { useSearchParams } from "react-router";
import { z } from "zod/v4";
import type { ItemDiffBoxProps } from "~/itemInfoBox/ItemDiffBox";
import { ItemDiffBox } from "~/itemInfoBox/ItemDiffBox";
import useFavicon from "~/useFavicon";
import type { ItemInfoBoxProps } from "../itemInfoBox/ItemInfoBox";
import { ItemInfoBox } from "../itemInfoBox/ItemInfoBox";
import type { DiffLeagueItem, LeagueItem } from "../leagueItem";
import { LeagueItemCompareKeys, LeagueItemSchema } from "../leagueItem";
import { fetchData } from "../queryClient";

export default function ItemHistory() {
  useFavicon("/item_favicon.ico");
  const [searchParams] = useSearchParams();
  const item_id = searchParams.get("item_id");
  const result = useQuery({
    queryKey: ["patch", item_id],
    queryFn: async () => fetchData(`/items/?item_id=${item_id}`),
  });

  if (result.isPending) {
    return "Loading...";
  }
  let itemList: LeagueItem[];
  try {
    itemList = z.array(LeagueItemSchema).parse(result.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return "Item doesn't exist!";
    }
    throw error;
  }
  const name = itemList[0].item_name; // Maybe change the backend so it gives me the item name directly and only once...

  const InfoBoxJSXList: React.JSX.Element[] = [];

  // list store the patch versions where the current iteration of has existed unchanged
  const patchesUnchanged: string[] = [];

  // logic here is: compare item with last item. If different, group everything up to the last item then push into JSXList.
  // note itemList comes in reverse chronological order, so lastItem.patch_version > item.patch_version
  let lastItem: LeagueItem | null = null;
  for (const item of itemList) {
    if (compareItem(lastItem, item) && lastItem !== null) {
      InfoBoxJSXList.push(
        <React.Fragment key={lastItem.patch_version}>
          <ExpandablePatchList patchList={[...patchesUnchanged]} />
          <InfoBoxSwitcher
            infoBox={ItemInfoBox}
            diffBox={ItemDiffBox}
            infoItem={lastItem}
            diffItem={createDiffItem(lastItem, item)}
          />
        </React.Fragment>
      );

      if (lastItem.item_name !== item.item_name) {
        InfoBoxJSXList.push(
          <div
            key={lastItem.patch_version + "name"}
            className={"text-3xl text-center font-medium bg-blue-950"}>
            {item.item_name}
          </div>
        );
      }

      patchesUnchanged.length = 0;
    }
    patchesUnchanged.push(item.patch_version);
    lastItem = item;
  }

  if (lastItem !== null) {
    InfoBoxJSXList.push(
      <React.Fragment key={lastItem.patch_version}>
        <ExpandablePatchList patchList={[...patchesUnchanged]} />
        <ItemInfoBox item={lastItem} />
      </React.Fragment>
    );
  }
  // TODO: display all versions of icon next to title, not just latest
  return (
    <>
      <div className="flex flex-row justify-center items-center pt-10 gap-5">
        <h1 className="text-5xl font-medium leading-none">{name}</h1>
      </div>

      <div className="flex flex-row flex-grow flex-nowrap pt-16">
        <title>{`History: ${name}`}</title>
        <div className="hidden sm:block lg:flex-1/3"></div>
        <div className="flex-auto mx-auto sm:flex-2/3 min-w-64 max-w-128">{InfoBoxJSXList}</div>

        <div className="hidden sm:block sm:flex-1/3 lg:flex-1/3"></div>
      </div>
    </>
  );
}

// generates a clickable, expandable heading of the patches in the patchList
function ExpandablePatchList({ patchList }: { patchList: string[] }) {
  const [expand, setExpand] = useState(false);
  const anchorJSXList: React.JSX.Element[] = [];
  for (let i = 0; i < patchList.length; i++) {
    const text = i === patchList.length - 1 ? patchList[i] : `${patchList[i]}`;
    anchorJSXList.push(
      <a
        className="hover:text-blue-200 hover:underline transition"
        href={`/patch/?patch_version=${patchList[i]}`}>
        {text}
      </a>
    );
  }
  anchorJSXList.reverse();
  const first = anchorJSXList[0];
  const last = anchorJSXList[anchorJSXList.length - 1];
  return (
    <span className="font-medium text-blue-300">
      {!expand ? (
        <div className="flex flex-row items-end">
          <span className="text-2xl flex-grow">
            {first}
            {anchorJSXList.length >= 2 && " – "}
            {anchorJSXList.length >= 2 && last}
          </span>
          {anchorJSXList.length >= 3 && (
            <span
              onClick={() => setExpand(true)}
              className="text-md hover:text-blue-200 hover:underline transition">
              {" expand all..."}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-row items-end">
          <span className="flex-grow text-lg">
            {anchorJSXList.map((link, i) => (
              <span key={i}>{link}; </span>
            ))}
          </span>

          {
            <span
              onClick={() => setExpand(false)}
              className="text-md hover:text-blue-200 hover:underline transition">
              {" collapse..."}
            </span>
          }
        </div>
      )}
    </span>
  );
}

type InfoBoxSwitcherProps = {
  infoBox: ({ item, className }: ItemInfoBoxProps) => React.JSX.Element;
  diffBox: ({ item, className }: ItemDiffBoxProps) => React.JSX.Element;
  infoItem: LeagueItem;
  diffItem: DiffLeagueItem;
};

function InfoBoxSwitcher({ infoBox, diffBox, infoItem, diffItem }: InfoBoxSwitcherProps) {
  const [showDiff, setShowDiff] = useState(false);
  return (
    <div onClick={() => setShowDiff((x) => !x)} className="relative hover:bg-gray-800 transition">
      {infoBox({ item: infoItem, className: showDiff ? "blur-sm brightness-50" : "" })}
      {showDiff &&
        diffBox({ item: diffItem, className: "absolute w-full top-0 bg-gray-900 z-999" })}
    </div>
  );
}

/*
note the naming is confusing, because itemList is in reverse chronological order
so, 'olderItem' is the previous version, aka the 'new' object we are comparing against the known 'newerItem'
if different -> return true, at which point the caller should emit items up to newerItem,
then set olderItem as the new cached item to consider
*/
function compareItem(newerItem: LeagueItem | null, olderItem: LeagueItem) {
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

function createDiffItem(newerItem: LeagueItem, olderItem: LeagueItem): DiffLeagueItem {
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
