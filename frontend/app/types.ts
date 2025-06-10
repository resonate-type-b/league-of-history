export type LeagueItem = {
    item_id: number;
    patch_version: string; // foreign key, primary key part
    item_name: string;
    gold_cost: number;
    hp?: number;
    hp5?: number;
    armor?: number;
    magic_resist?: number;
    tenacity?: number;
    slow_resist?: number;
    aspd?: number;
    ad?: number;
    ap?: number;
    crit_chance?: number;
    armor_pen_flat?: number;
    lethality?: number;
    armor_pen_percent?: number;
    magic_pen_flat?: number;
    magic_pen_percent?: number;
    lifesteal?: number;
    physical_vamp?: number;
    magic_vamp?: number;
    omnivamp?: number;
    cdr?: number;
    haste?: number;
    mp?: number;
    mp5?: number;
    movespeed_flat?: number;
    movespeed_percent?: number;
    gp10?: number;
    unique_passive_1?: string | null;
    unique_passive_1_name?: string | null;
    unique_passive_2?: string | null;
    unique_passive_2_name?: string | null;
    unique_passive_3?: string | null;
    unique_passive_3_name?: string | null;
}
