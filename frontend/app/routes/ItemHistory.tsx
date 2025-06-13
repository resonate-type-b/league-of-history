import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { z } from "zod/v4";
import ItemInfoBox from "../ItemInfoBox";
import { fetchData } from "../queryClient";
import type { LeagueItem } from "../types";
import { LeagueItemSchema } from "../types";
// const res = await fetch(import.meta.env.VITE_API_URL + `/api/products/${params.patch_version}`);

export default function ItemHistory() {
  const [searchParams] = useSearchParams();
  const item_id = searchParams.get("item_id");
  const result = useQuery({
    queryKey: ["patch", item_id],
    queryFn: async () => fetchData(`/items/?item_id=${item_id}`),
  });

  if (result.isPending) {
    return "Loading...";
  }
  const data: LeagueItem[] = z.array(LeagueItemSchema).parse(result.data);
  const name = Object.values(data)[0].item_name; // Maybe change the backend so it gives me the item name directly and only once...

  return (
    <>
      <h1 className="text-5xl text-center pt-5">{name}</h1>
      <div className="flex flex-row flex-grow flex-nowrap pt-16">
        <title>{`History: ${name}`}</title>
        <div className="hidden sm:block lg:flex-1/3"></div>
        <div className="flex-auto sm:flex-1/2 md:flex-1/3 min-w-52 max-w-96 ">
          {data.map((item) => {
            return <ItemInfoBox key={item.patch_version} item={item} />;
          })}
        </div>

        <div className="hidden sm:block md:flex-1/2 lg:flex-1/3"></div>
      </div>
    </>
  );
}
