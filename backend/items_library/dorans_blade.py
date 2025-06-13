from ._helpers import ItemDefinition


item_name = "Doran's Blade"
item_id = 1055


patch_list: list[ItemDefinition] = [
    ItemDefinition("20090509", {
        "gold_cost": 475,
        "icon_version": 0,
        "hp": 150,
        "ad": 6,
        "aspd": 6
    }),
    ItemDefinition("20090515", {
        "gold_cost": 435,
        "hp": 130,
    }),
    ItemDefinition("20090710", {
        "aspd": None,
        "gp10": 2
    }),
    ItemDefinition("0.8.21.110", {
        "gp10": 1,
    }),
    # V0.9.22.7
    # Now sells back for 50% gold from 70%.

    ItemDefinition("1.0.0.70", {
        "hp": 120,
        "lifesteal": 4,
        "gp10": None
    }),
    ItemDefinition("1.0.0.106", {
        "ad": 8,
        "hp": 100,
        "lifesteal": 3
    }),
    ItemDefinition("1.0.0.110", {
        "gold_cost": 475,
        "ad": 9,
    }),
    ItemDefinition("1.0.0.113", {
        "gold_cost": 475,
        "ad": 10,
        "motd": "Bugfix: Fixed a bug where it was granting an unintended 1 gold per 10 seconds."
    }),
    ItemDefinition("1.0.0.138", {
        "hp": 80,
    }),
    ItemDefinition("1.0.0.152", {
        "lifesteal": None,
        "unique_passive_1": "Basic attacks restore 5 health each time they hit an enemy."
    }),
    ItemDefinition("3.14", {
        "gold_cost": 440,
        "ad": 8,
        "unique_passive_1": "Basic attacks restore [5|3] health each time they hit an enemy."
    }),
    ItemDefinition("4.10", {
        "health": 70,
        "ad": 7,
        "unique_passive_1": None,
        "lifesteal": 3
    }),
    ItemDefinition("5.22", {
        "gold_cost": 450,
        "ad": 8,
        "health": 80
    }),
    ItemDefinition("10.23", {
        # REWORK
        "icon_version": 1,
        "gold_cost": 450,
        "lifesteal": None,
        "unique_passive_1_name": "WARMONGER",
        "unique_passive_1": r"+2.5% omni vamp",
        "motd": "Hotfix-Bugfix: Fixed a bug where users would retain omnivamp after selling it."

    }),
    ItemDefinition("10.24", {
        "icon_version": 2,
    }),
    ItemDefinition("13.20", {
        "ad": 10,
        "health": 100,
        "unique_passive_2_name": "DORAN",
        "unique_passive_2": "Limited to 1 DORAN item.",
    }),
    ItemDefinition("14.1", {
        "lifesteal": 3.5,
        "unique_passive_1_name": None,
        "unique_passive_1": None,
    }),
    ItemDefinition("14.6", {
        "unique_passive_2_name": "STARTER",
        "unique_passive_2": "Limited to 1 STARTER item.",
    }),
    ItemDefinition("14.16", {
        "hp": 80,
        "lifesteal": 3,
    }),
    # placeholder example to show removed item
    # {
    #     "patch_version": "removed",
    # }
]
