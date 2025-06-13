import type { LeagueItem } from "./types";

type IconProps = {
  item: LeagueItem;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Icon({ item, className, ...imgProps }: IconProps) {
  return (
    <img
      {...imgProps}
      src={`/icons/${item.item_id}.png`}
      className={`${className} border-1 border-gray-500`}
      alt={item.item_name}
      height="64px"
      width="64px"
    />
  );
}
