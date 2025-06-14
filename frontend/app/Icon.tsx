import type { LeagueItem } from "./types";

type IconProps = {
  item: LeagueItem;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Icon({ item, className, ...imgProps }: IconProps) {
  return (
    <img
      {...imgProps}
      className={`${className} border-1 border-gray-500`}
      alt={item.item_name}
      height="64px"
      width="64px"
      src={`/icons/${item.item_id}_${item.icon_version}.webp`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (!target.dataset.fallback) {
          console.info("This error is safe to ignore if not followed by a similar .png error");
          target.dataset.fallback = "true";
          target.onerror = null;
          target.src = `/icons/${item.item_id}_${item.icon_version}.png`;
        }
      }}
    />
  );
}
