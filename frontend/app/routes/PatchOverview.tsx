import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { z } from "zod/v4";
import { Icon } from "~/Icon";
import type { LeagueItem } from "~/leagueItem";
import { LeagueItemSchema } from "~/leagueItem";
import useFavicon from "~/useFavicon";
import { fetchData } from "../queryClient";

export default function PatchOverview() {
  useFavicon("/item_favicon.ico");
  const [searchParams] = useSearchParams();
  let patch_version = searchParams.get("patch_version");
  const result = useQuery({
    queryKey: ["item", patch_version],
    queryFn: async () =>
      fetchData(patch_version === null ? "/items/" : `/items/?patch_version=${patch_version}`),
  });

  if (result.isPending) {
    return "Loading...";
  }

  let itemList: LeagueItem[];
  try {
    itemList = z.array(LeagueItemSchema).parse(result.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return "Patch doesn't exist!";
    }
    throw error;
  }

  patch_version = patch_version ?? itemList[0].patch_version;

  // 96rem: the breakpoint for tailwind's 2xl screen size.
  // tailwind prases at build time, so setting it dynamically would require creating custom css variables and setting them at runtime
  // easier in this use case to just magic number
  return (
    <>
      <title>{`Patch ${patch_version}`}</title>
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
  return (
    <a href={`/item/?item_id=${item.item_id}`}>
      <div className="py-2 hover:bg-gray-700 active:bg-gray-700 transition">
        <Icon className="mx-auto" item={item} />
        <p className="text-center">{item.item_name}</p>
      </div>
    </a>
  );
}
