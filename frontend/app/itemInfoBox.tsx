import type { LeagueItem } from "./types";
import type * as React from "react";

type ItemMap = {
  [key: string]: (value: any) => string;
};

const itemMap: ItemMap = {
  item_id: (value: number) => `Item ID: ${value}`,
  patch_version: (value: string) => `Patch: ${value}`,
  item_name: (value: string) => `Name: ${value}`,
  gold_cost: (value: number) => `Gold Cost: ${value}`,
  hp: (value: number) => `Health: ${value}`,
  hp5: (value: number) => `HP Regen per 5: ${value}`,
  armor: (value: number) => `Armor: ${value}`,
  magic_resist: (value: number) => `Magic Resist: ${value}`,
  tenacity: (value: number) => `Tenacity: ${value}%`,
  slow_resist: (value: number) => `Slow Resist: ${value}%`,
  aspd: (value: number) => `Attack Speed: ${value}%`,
  ad: (value: number) => `Attack Damage: ${value}`,
  ap: (value: number) => `Ability Power: ${value}`,
  crit_chance: (value: number) => `Critical Strike Chance: ${value}%`,
  armor_pen_flat: (value: number) => `Armor Penentration: ${value}`,
  lethality: (value: number) => `Lethality: ${value}`,
  armor_pen_percent: (value: number) => `Armor Penetration: ${value}%`,
  magic_pen_flat: (value: number) => `Magic Penetration: ${value}`,
  magic_pen_percent: (value: number) => `Magic Penetration: ${value}%`,
  lifesteal: (value: number) => `Lifesteal: ${value}%`,
  physical_vamp: (value: number) => `Physical Vamp: ${value}%`,
  magic_vamp: (value: number) => `Magic Vamp: ${value}%`,
  omnivamp: (value: number) => `Omnivamp: ${value}%`,
  cdr: (value: number) => `Cooldown Reduction: ${value}%`,
  haste: (value: number) => `Ability Haste: ${value}`,
  mp: (value: number) => `Mana: ${value}`,
  mp5: (value: number) => `Mana Regen per 5: ${value}`,
  movespeed_flat: (value: number) => `Move Speed: ${value}`,
  movespeed_percent: (value: number) => `Move Speed: ${value}%`,
  gp10: (value: number) => `Gold per 10: ${value}`,
  unique_passive_1: (value: string) => `${value}`,
  unique_passive_1_name: (value: string) => `${value}`,
  unique_passive_2: (value: string) => `${value}`,
  unique_passive_2_name: (value: string) => `${value}`,
  unique_passive_3: (value: string) => `${value}`,
  unique_passive_3_name: (value: string) => `${value}`,
};

interface ItemInfoBoxProps {
  item: LeagueItem;
}

export default function ItemInfoBox({ item }: ItemInfoBoxProps) {
  const itemName = item.item_name;
  const patchVersion = item.patch_version;

  const statJSXList: React.JSX.Element[] = [];
  for (const stat of Object.keys(item)) {
    const itemKey = stat as keyof LeagueItem;
    const mappingKey = stat as keyof ItemMap;
    if (!["item_id", "item_name", "patch_version"].includes(stat)) {
      statJSXList.push(<p key={stat}>{itemMap[mappingKey](item[itemKey] as string)}</p>);
    }
  }

  return (
    <div className="border border-white">
      <h3>{patchVersion}</h3>
      {statJSXList}
    </div>
  );
}
