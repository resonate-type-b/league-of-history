import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSearchParams } from "react-router";
import { z } from "zod/v4";
import { ItemDiffBox } from "~/itemInfoBox/ItemDiffBox";
import type { Patch } from "~/patch";
import useFavicon from "~/useFavicon";
import { ItemInfoBox } from "../../itemInfoBox/ItemInfoBox";
import type { LeagueItem } from "../../leagueItem";
import { LeagueItemSchema } from "../../leagueItem";
import { fetchData } from "../../queryClient";
import { ExpandablePatchList, InfoBoxSwitcher, SubHeader } from "./components";
import { compareItem, createDiffItem } from "./helpers";

export default function ItemHistory() {
  useFavicon("/item_favicon.ico");
  const [searchParams] = useSearchParams();
  const item_id = searchParams.get("item_id");

  if (item_id === null) {
    window.location.href = "/patch/";
  }
  const result = useQuery({
    queryKey: ["patch", item_id],
    queryFn: async () => fetchData(`/items/?item_id=${item_id}`),
  });

  const patchResult = useQuery({
    queryKey: ["allPatches"],
    queryFn: async () => fetchData("/patch_versions/"),
  });

  if (result.isPending || patchResult.isPending) {
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

  // get the range of patches between the first and last time the item ever existed.
  // We iterate over this rather than itemList directly in case the item was removed at some point in the middle
  let AllPatches = patchResult.data as Patch[];
  const startIdx = AllPatches.findIndex((e) => e[0] === itemList[0].patch_version);
  const endIdx = AllPatches.findIndex((e) => e[0] === itemList[itemList.length - 1].patch_version);
  AllPatches = AllPatches.slice(startIdx, endIdx + 1);

  const name = itemList[0].item_name; // Maybe change the backend so it gives me the item name directly and only once...

  const InfoBoxJSXList: React.JSX.Element[] = [];

  // list store the patch versions where the current iteration of has existed unchanged
  const patchesUnchanged: string[] = [];

  // logic here is: compare item with lastItem. If different, group everything up to lastItem then push into JSXList.
  // note itemList comes in reverse chronological order, so lastItem is actually a NEWER item chronologically
  // this means a lot of logic is reversed and therefore counter intuitive.
  let lastItem: LeagueItem | null = null;
  let isRemoved = false;
  let itemListIdx = 0;
  for (const patchTuple of AllPatches) {
    const item = itemList[itemListIdx];
    const patchVersion = patchTuple[0];

    // if the item's patch_version is not the same as patch, it means the item has skipped a few patches - removal happened
    if (item.patch_version !== patchVersion) {
      if (!isRemoved) {
        // if it's a new removal, it means the item does not existed on the older patch. That means it's READDED
        isRemoved = true;
        lastItem = lastItem!; // safe because we know the item definitely exists on the first
        const isDifferent = compareItem(lastItem, item); // we'll return only the InfoBox and not a Switcher if it was readded exactly the same
        InfoBoxJSXList.push(
          <React.Fragment key={patchVersion}>
            <ExpandablePatchList patchList={[...patchesUnchanged]} />
            {isDifferent ? (
              <InfoBoxSwitcher
                infoBox={ItemInfoBox}
                diffBox={ItemDiffBox}
                infoItem={lastItem}
                diffItem={createDiffItem(lastItem, item)}
              />
            ) : (
              <ItemInfoBox item={lastItem} />
            )}
          </React.Fragment>
        );
        // if item name changed, put a header for the old item name
        if (lastItem.item_name !== item.item_name) {
          InfoBoxJSXList.push(<SubHeader key={patchVersion + "name"}>{item.item_name}</SubHeader>);
        }
        patchesUnchanged.length = 0;
      }
      // regardless, we continue until the patchVersion matches again, aka the item exists again
      patchesUnchanged.push(patchVersion);
      continue;
    }

    // if the item was previously removed, but now we matched again, it means the item now exists on the older patch
    // therefore, it was REMOVED from the game
    if (isRemoved) {
      isRemoved = false;

      InfoBoxJSXList.push(
        <React.Fragment key={patchVersion}>
          <ExpandablePatchList patchList={[...patchesUnchanged]} />

          <div className={"border-t border-blue-200 pt-5 pb-14 pl-3 pr-8 sm:pr-3"}>
            <SubHeader>REMOVED</SubHeader>
          </div>
        </React.Fragment>
      );
      patchesUnchanged.length = 0;
      // else here because we don't want to show the diff of a removed item even if it was changed upon readding
    } else if (
      // if the item was changed, we need to create a new Switcher.
      compareItem(lastItem, item) &&
      lastItem !== null
    ) {
      InfoBoxJSXList.push(
        <React.Fragment key={patchVersion}>
          <ExpandablePatchList patchList={[...patchesUnchanged]} />
          <InfoBoxSwitcher
            infoBox={ItemInfoBox}
            diffBox={ItemDiffBox}
            infoItem={lastItem}
            diffItem={createDiffItem(lastItem, item)}
          />
        </React.Fragment>
      );
      // if item name changed, put a header for the old item name
      if (lastItem.item_name !== item.item_name) {
        InfoBoxJSXList.push(<SubHeader key={patchVersion + "name"}>{item.item_name}</SubHeader>);
      }
      patchesUnchanged.length = 0;
    }

    // we've successfully matched an itemList entry with AllPatches, next loop, we can check for the next entry
    itemListIdx++;
    patchesUnchanged.push(item.patch_version);
    lastItem = item;
  }

  // last item in itemList will need to be manually added
  InfoBoxJSXList.push(
    <React.Fragment key={lastItem!.patch_version}>
      <ExpandablePatchList patchList={[...patchesUnchanged]} />
      <ItemInfoBox item={lastItem!} />
    </React.Fragment>
  );

  // TODO: display all versions of icon next to title, not just latest
  return (
    <>
      <title>{`History: ${name}`}</title>
      <h1 className="text-5xl text-center font-medium leading-none p-10">{name}</h1>

      <div className="flex flex-row flex-grow flex-nowrap">
        <div className="hidden sm:block lg:flex-1/3"></div>
        <div className="flex-auto mx-auto px-3 sm:flex-2/3 min-w-64 max-w-128">
          <div className="text-left text-xs pb-5 text-gray-400">
            <p>Click patch numbers to see items available on that patch.</p>
            <p>Click anywhere on an item iteration to highlight changes </p>
          </div>
          {InfoBoxJSXList}
        </div>

        <div className="hidden sm:block sm:flex-1/3 lg:flex-1/3"></div>
      </div>
    </>
  );
}
