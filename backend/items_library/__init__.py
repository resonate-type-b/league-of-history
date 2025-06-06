import os
import importlib
from ._helpers import ItemFullInfoType


all_items: list[ItemFullInfoType] = []

for file in os.listdir(os.path.dirname(__file__)):
    if not file.startswith("_") and file.endswith(".py"):
        module_name = file[:-3]
        module = importlib.import_module(f".{module_name}", package=__name__)
        all_items.append((module.item_id, module.item_name, module.patch_list))
