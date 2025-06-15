import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  // data will only become 'out of date' every league patch, so let's just say infinity...
  // TODO: server should save the current patch version in a useState and invalidate all queries on change
  queries: { staleTime: Infinity },
});

export async function fetchData(path: string): Promise<unknown> {
  const response = await fetch(import.meta.env.VITE_API_URL + path);
  if (!response.ok) {
    throw new Error(`fetching ${path} failed`);
  }
  return response.json();
}
