import { z } from "zod/v4";

export const LeagueItemSchema = z.object({
  item_id: z.number(),
  patch_version: z.string(),
  item_name: z.string(),
  gold_cost: z.number(),
  hp: z.number().optional(),
  hp5: z.number().optional(),
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
  movespeed_flat: z.number().optional(),
  movespeed_percent: z.number().optional(),
  gp10: z.number().optional(),
  unique_passive_1: z.string().nullable().optional(),
  unique_passive_1_name: z.string().nullable().optional(),
  unique_passive_2: z.string().nullable().optional(),
  unique_passive_2_name: z.string().nullable().optional(),
  unique_passive_3: z.string().nullable().optional(),
  unique_passive_3_name: z.string().nullable().optional(),
  motd: z.string().nullable().optional(),
});

export type LeagueItem = z.infer<typeof LeagueItemSchema>;

// requires all possible keys from T, optional or not, and requires that value provided must not be null
export type FormatterMap = {
  [K in Exclude<
    keyof LeagueItem,
    | "unique_passive_1"
    | "unique_passive_1_name"
    | "unique_passive_2"
    | "unique_passive_2_name"
    | "unique_passive_3"
    | "unique_passive_3_name"
    | "motd"
  >]-?: (value: LeagueItem[K]) => [string, string];
};
