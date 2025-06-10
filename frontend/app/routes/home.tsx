import type { LeagueItem } from "../types";
import ItemInfoBox from "~/itemInfoBox";
import { queryClient, fetchData } from "../queryClient";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
// const res = await fetch(import.meta.env.VITE_API_URL + `/api/products/${params.patch_version}`);

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams("?item_id=1055");

  const result = useQuery({
    queryKey: ["item", searchParams.get("item_id")],
    queryFn: async () => fetchData(`/items/?${searchParams.toString()}`),
  });

  const isPending = result.isPending;
  const data: LeagueItem[] = result.data;

  if (isPending) {
    return "Loading...";
  }

  const name = Object.values(data)[0].item_name; // Maybe change the backend so it gives me the item name directly and only once...

  return (
    <div>
      <title>{`History: ${name}`}</title>
      <h1>{name}</h1>
      {data.map((item) => {
        return <ItemInfoBox key={item.patch_version} item={item} />;
      })}
    </div>
  );
}
