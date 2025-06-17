import React from "react";
import type { LeagueItem } from "../leagueItem";
// requires all possible keys from T, optional or not, and requires that value provided must not be null

export type FormatterMap = {
  [K in Exclude<
    keyof LeagueItem,
    | "item_id"
    | "item_name"
    | "patch_version"
    | "icon_version"
    | "unique_passive_1"
    | "unique_passive_1_name"
    | "unique_passive_2"
    | "unique_passive_2_name"
    | "unique_passive_3"
    | "unique_passive_3_name"
    | "unique_passive_4"
    | "unique_passive_4_name"
    | "motd"
    | "reworked"
    | "components"
  >]-?: (value: string | number | React.JSX.Element[]) => [string, React.JSX.Element];
};

export const itemMap: FormatterMap = {
  gold_cost: (value) => ["Gold Cost: ", <React.Fragment key="goldCost">{value}</React.Fragment>],
  hp: (value) => ["Health: ", <React.Fragment key="hp">{value}</React.Fragment>],
  hp5: (value) => ["HP Regen per 5: ", <React.Fragment key="hp5">{value}</React.Fragment>],
  hp_regen: (value) => ["Health regen: ", <React.Fragment key="hpRegen">{value}%</React.Fragment>],
  armor: (value) => ["Armor: ", <React.Fragment key="armor">{value}</React.Fragment>],
  magic_resist: (value) => [
    "Magic Resist: ",
    <React.Fragment key="magicResist">{value}</React.Fragment>,
  ],
  tenacity: (value) => ["Tenacity: ", <React.Fragment key="tenacity">{value}%</React.Fragment>],
  slow_resist: (value) => [
    "Slow Resist: ",
    <React.Fragment key="slowResist">{value}%</React.Fragment>,
  ],
  aspd: (value) => ["Attack Speed: ", <React.Fragment key="aspd">{value}%</React.Fragment>],
  ad: (value) => ["Attack Damage: ", <React.Fragment key="ad">{value}</React.Fragment>],
  ap: (value) => ["Ability Power: ", <React.Fragment key="ap">{value}</React.Fragment>],
  crit_chance: (value) => [
    "Critical Strike Chance: ",
    <React.Fragment key="critChance">{value}%</React.Fragment>,
  ],
  armor_pen_flat: (value) => [
    "Armor Penetration: ",
    <React.Fragment key="armorPenFlat">{value}</React.Fragment>,
  ],
  lethality: (value) => ["Lethality: ", <React.Fragment key="lethality">{value}</React.Fragment>],
  armor_pen_percent: (value) => [
    "Armor Penetration: ",
    <React.Fragment key="armorPenPercent">{value}%</React.Fragment>,
  ],
  magic_pen_flat: (value) => [
    "Magic Penetration: ",
    <React.Fragment key="magicPenFlat">{value}</React.Fragment>,
  ],
  magic_pen_percent: (value) => [
    "Magic Penetration: ",
    <React.Fragment key="magicPenPercent">{value}%</React.Fragment>,
  ],
  lifesteal: (value) => ["Lifesteal: ", <React.Fragment key="lifesteal">{value}%</React.Fragment>],
  physical_vamp: (value) => [
    "Physical Vamp: ",
    <React.Fragment key="physicalVamp">{value}%</React.Fragment>,
  ],
  magic_vamp: (value) => [
    "Magic Vamp: ",
    <React.Fragment key="magicVamp">{value}%</React.Fragment>,
  ],
  omnivamp: (value) => ["Omnivamp: ", <React.Fragment key="omnivamp">{value}%</React.Fragment>],
  cdr: (value) => ["Cooldown Reduction: ", <React.Fragment key="cdr">{value}%</React.Fragment>],
  haste: (value) => ["Ability Haste: ", <React.Fragment key="haste">{value}</React.Fragment>],
  mp: (value) => ["Mana: ", <React.Fragment key="mp">{value}</React.Fragment>],
  mp5: (value) => ["Mana Regen per 5: ", <React.Fragment key="mp5">{value}</React.Fragment>],
  mp_regen: (value) => ["Mana regen: ", <React.Fragment key="mpRegen">{value}%</React.Fragment>],
  movespeed_flat: (value) => [
    "Move Speed: ",
    <React.Fragment key="movespeedFlat">{value}</React.Fragment>,
  ],
  movespeed_percent: (value) => [
    "Move Speed: ",
    <React.Fragment key="movespeedPercent">{value}%</React.Fragment>,
  ],
  gp10: (value) => ["Gold per 10: ", <React.Fragment key="gp10">{value}</React.Fragment>],
};
