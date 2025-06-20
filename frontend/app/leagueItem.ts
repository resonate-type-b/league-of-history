import { type Change } from "diff";
import { z } from "zod/v4";

export const LeagueItemSchema = z.object({
  item_id: z.number(),
  patch_version: z.string(),
  item_name: z.string(),
  gold_cost: z.number(),
  icon_version: z.number(),
  components: z.array(z.number()).optional(),
  reworked: z.boolean().optional(),

  hp: z.number().optional(),
  hp5: z.number().optional(),
  hp_regen: z.number().optional(),
  armor: z.number().optional(),
  magic_resist: z.number().optional(),
  tenacity: z.number().optional(),
  slow_resist: z.number().optional(),
  aspd: z.number().optional(),
  ad: z.number().optional(),
  ap: z.number().optional(),
  crit_chance: z.number().optional(),
  armor_pen_flat: z.number().optional(),
  lethality: z.number().optional(),
  armor_pen_percent: z.number().optional(),
  magic_pen_flat: z.number().optional(),
  magic_pen_percent: z.number().optional(),
  lifesteal: z.number().optional(),
  physical_vamp: z.number().optional(),
  magic_vamp: z.number().optional(),
  omnivamp: z.number().optional(),
  cdr: z.number().optional(),
  haste: z.number().optional(),
  mp: z.number().optional(),
  mp5: z.number().optional(),
  mp_regen: z.number().optional(),
  movespeed_flat: z.number().optional(),
  movespeed_percent: z.number().optional(),
  gp10: z.number().optional(),
  unique_passive_1: z.string().optional(),
  unique_passive_1_name: z.string().optional(),
  unique_passive_2: z.string().optional(),
  unique_passive_2_name: z.string().optional(),
  unique_passive_3: z.string().optional(),
  unique_passive_3_name: z.string().optional(),
  unique_passive_4: z.string().optional(),
  unique_passive_4_name: z.string().optional(),
  buy_group: z.array(z.string()).optional(),
  quest_reward: z.boolean().optional(),
  motd: z.string().optional(),
});

export type LeagueItem = z.infer<typeof LeagueItemSchema>;

// every key except patch_version/motd/reworked, used to compare items
// motd field is a special case that needs to be checked manually for existence, not compared.
// TODO: compare components too
export const LeagueItemCompareKeys: (keyof LeagueItem)[] = Object.keys(
  LeagueItemSchema.shape
).filter(
  (element) => !["patch_version", "motd", "reworked", "components"].includes(element)
) as (keyof LeagueItem)[];

// a league item where each value is a ChangeObject from diffWords instead of a string
export type DiffLeagueItem = {
  // when constructing a DiffLeagueitem, we set the value to the string value if the strings are identical
  // this way we can continue to display the unchanged parts of the item
  [K in keyof LeagueItem]?: K extends "motd"
    ? string
    : K extends "item_id"
    ? number
    : Change[] | string;
};
