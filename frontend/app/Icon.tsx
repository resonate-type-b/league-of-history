import type { Change } from "diff";
import type { DiffLeagueItem, LeagueItem } from "./leagueItem";

type IconProps = {
  item: LeagueItem | DiffLeagueItem;
  height?: number;
  width?: number;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

// TODO: this method flickers on loading a .png...
// convert it into LBYL with new Image() at some point
// or better yet, sensible to batch convert to .webp
export function Icon({ item, className, ...imgProps }: IconProps) {
  // note size is 66px because it's 64px icon + 1px border each side
  const icon_version =
    typeof item.icon_version === "number" || typeof item.icon_version === "string"
      ? item.icon_version
      : // bit hacky, diffWord always returns in the order of removed, then added, so [1] is the new version...
        (item.icon_version as Change[])[1].value;

  return (
    <img
      {...imgProps}
      className={`border-1 border-gray-500 size-[66px] ${className} `}
      alt={typeof item.item_name === "string" ? item.item_name : "item icon"}
      src={`/icons/${item.item_id}_${icon_version}.webp`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (!target.dataset.fallback) {
          target.dataset.fallback = "true";
          target.onerror = null;
          target.src = `/icons/${item.item_id}_${icon_version}.png`;
        }
      }}
    />
  );
}
