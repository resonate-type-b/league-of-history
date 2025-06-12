import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../queryClient";

export default function PatchOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const patch_version = searchParams.get("patch_version");

  const result = useQuery({
    queryKey: ["item", patch_version],
    queryFn: async () => fetchData(`/items/?patch_version=${patch_version}`),
  });
  console.log(result.data);
  return <div>placeholder</div>;
}
