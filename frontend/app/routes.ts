import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("patch/", "routes/PatchOverview.tsx"),
  route("item/", "routes/itemHistory/ItemHistory.tsx"),
] satisfies RouteConfig;
