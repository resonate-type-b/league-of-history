import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/PatchOverview.tsx"),
    route("item/*", "routes/ItemHistory.tsx")
] satisfies RouteConfig;
