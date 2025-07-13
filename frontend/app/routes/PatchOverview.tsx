import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSearchParams } from "react-router";
import { z } from "zod/v4";
import { Icon } from "~/Icon";
import type { LeagueItem, PatchObject } from "~/leagueItem";
import { PatchSchema } from "~/leagueItem";
import useFavicon from "~/useFavicon";
import { fetchData } from "../queryClient";

export default function PatchOverview() {
  useFavicon("/item_favicon.ico");
  const [searchParams] = useSearchParams();
  let patch_version = searchParams.get("patch_version");
  const result = useQuery({
    queryKey: ["item", patch_version],
    queryFn: async () =>
      fetchData(patch_version === null ? "/patch/" : `/patch/?patch_version=${patch_version}`),
  });

  if (result.isPending) {
    return "Loading...";
  }

  let itemObj: PatchObject;
  try {
    itemObj = PatchSchema.parse(result.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return "Patch doesn't exist!";
    }
    throw error;
  }

  // hard coded, but we want them in this specific order so...
  // Could have the backend return an array, I kinda prefer having the ordering set on the frontend anyway.
  const categories: (keyof PatchObject)[] = ["Final", "Boots", "Transforms", "Others"];

  // if we just went to the base /patch/ route to auto get the latest patch, grab a patch_version from a random item to know where we're at
  patch_version = patch_version ?? itemObj["Final"][0].patch_version;

  // 96rem: magic number for the breakpoint for tailwind's 2xl screen size.
  return (
    <>
      <title>{`Patch ${patch_version}`}</title>
      <h1 className="text-5xl text-center p-10 font-medium">Patch {patch_version}</h1>
      {categories.map((category) => {
        return (
          <React.Fragment key={category}>
            <h2 className="text-center md:text-left text-3xl px-30 py-10 font-medium">
              {category}
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:max-w-[96rem] mx-auto px-3 text-xs lg:text-sm 2xl:text-base">
              {Object.keys(itemObj).includes(category) &&
                itemObj[category]!.map((item) => {
                  return <IconBox item={item} key={item.item_id} />;
                })}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}

function IconBox({ item }: { item: LeagueItem }) {
  return (
    <a
      href={`/item/?item_id=${item.item_id}`}
      className="py-2 px-1 hover:bg-gray-700 active:bg-gray-700 rounded-lg transition">
      <Icon className="mx-auto" item={item} />
      <p className="text-center">{item.item_name}</p>
    </a>
  );
}
