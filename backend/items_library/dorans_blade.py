from ._helpers import ItemHistoryType, ItemDefinition


item_name = "Doran's Blade"
item_id = 1055


patch_list: ItemHistoryType = [
    ItemDefinition("20090509", {
        "gold_cost": 475,
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
        "gp5": 2
    }),
    ItemDefinition("0.8.21.110", {
        "gp5": 1,
    })

    # placeholder example to show removed item
    # {
    #     "patch_version": "removed",
    # }
]
