import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../queryClient";
import type { LeagueItem } from "~/types";
import { LeagueItemSchema } from "~/types";
import { z } from "zod/v4";

export default function PatchOverview() {
  const [searchParams] = useSearchParams();
  let patch_version = searchParams.get("patch_version");
  const result = useQuery({
    queryKey: ["item", patch_version],
    queryFn: async () => fetchData(patch_version == null ? "/items/" : `/items/?patch_version=${patch_version}`),
  });

  if (result.isPending) {
    return "Loading...";
  }

  const itemList: LeagueItem[] = z.array(LeagueItemSchema).parse(result.data);
  if (patch_version == null) {
    patch_version = itemList[0].patch_version;
  }

  // 96rem: the breakpoint for tailwind's 2xl screen size.
  // tailwind prases at build time, so setting it dynamically would require creating custom css variables and setting them at runtime
  // easier in this use case to just magic number
  return (
    <>
      <h1 className="text-5xl text-center pt-5 pb-10">Patch {patch_version}</h1>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:max-w-[96rem] mx-auto text-xs lg:text-sm 2xl:text-base">
        {itemList.map((item) => {
          return <IconBox item={item} key={item.item_id} />;
        })}
      </div>
    </>
  );
}

function IconBox({ item }: { item: LeagueItem }) {
  const itemIcon = `/icons/${item.item_id}.png`;

  return (
    <div className="py-2">
      <p className="text-center">{item.item_name}</p>
      <img className="mx-auto" src={itemIcon} width="64" height="64" alt={item.item_name} />
    </div>
  );
}
