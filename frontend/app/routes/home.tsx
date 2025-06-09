import type { LeagueItem } from "../types";
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

  console.log(data);

  return (
    <div>
      <title>Hell Yeah Simulator</title>
      {data.map((item) => {
        return <p key={item.patch_version}>{JSON.stringify(item)}</p>;
      })}
    </div>
  );
}
