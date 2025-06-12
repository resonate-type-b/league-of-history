from typing import NamedTuple

# most basic type: simply a dictionary of stat:values as per Item ORM
type StatDictType = dict[str, str | int | None]


# self explanatory. Used to define the changes in the source data .pys
class ItemDefinition(NamedTuple):
    patch_version: str
    stat_dict: StatDictType


# A list of ItemDefinitions gives a full history of the item over time...
type ItemHistoryType = list[ItemDefinition]

# ...this final wrapping of item id + name is completely unnecessary as they are already included in each StatDictType
# TODO: remove both this and ItemHistoryType
type ItemFullInfoType = tuple[int, str, ItemHistoryType]
