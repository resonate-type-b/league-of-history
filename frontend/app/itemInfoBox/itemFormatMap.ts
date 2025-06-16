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
  >]-?: (value: LeagueItem[K]) => [string, string];
};

export const itemMap: FormatterMap = {
  gold_cost: (value) => ["Gold Cost: ", `${value}`],
  hp: (value) => ["Health: ", `${value}`],
  hp5: (value) => ["HP Regen per 5: ", `${value}`],
  hp_regen: (value) => ["Health regen: ", `${value}%`],
  armor: (value) => ["Armor: ", `${value}`],
  magic_resist: (value) => ["Magic Resist: ", `${value}`],
  tenacity: (value) => ["Tenacity: ", `${value}%`],
  slow_resist: (value) => ["Slow Resist: ", `${value}%`],
  aspd: (value) => ["Attack Speed: ", `${value}%`],
  ad: (value) => ["Attack Damage: ", `${value}`],
  ap: (value) => ["Ability Power: ", `${value}`],
  crit_chance: (value) => ["Critical Strike Chance: ", `${value}%`],
  armor_pen_flat: (value) => ["Armor Penetration: ", `${value}`],
  lethality: (value) => ["Lethality: ", `${value}`],
  armor_pen_percent: (value) => ["Armor Penetration: ", `${value}%`],
  magic_pen_flat: (value) => ["Magic Penetration: ", `${value}`],
  magic_pen_percent: (value) => ["Magic Penetration: ", `${value}%`],
  lifesteal: (value) => ["Lifesteal: ", `${value}%`],
  physical_vamp: (value) => ["Physical Vamp: ", `${value}%`],
  magic_vamp: (value) => ["Magic Vamp: ", `${value}%`],
  omnivamp: (value) => ["Omnivamp: ", `${value}%`],
  cdr: (value) => ["Cooldown Reduction: ", `${value}%`],
  haste: (value) => ["Ability Haste: ", `${value}`],
  mp: (value) => ["Mana: ", `${value}`],
  mp5: (value) => ["Mana Regen per 5: ", `${value}`],
  mp_regen: (value) => ["Mana regen: ", `${value}%`],
  movespeed_flat: (value) => ["Move Speed: ", `${value}`],
  movespeed_percent: (value) => ["Move Speed: ", `${value}%`],
  gp10: (value) => ["Gold per 10: ", `${value}`],
};
