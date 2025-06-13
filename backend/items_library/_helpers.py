from typing import NamedTuple

# most basic type: simply a dictionary of stat:values for the Item ORM
# no mandatory keys as this is just for syntactic sugar as necessary
type StatDictType = dict[str, str | int | None]


# self explanatory. Used to define the changes in the source data .pys
# only patch_version is named in the tuple. This is not for any design considerations,
# but because it makes it easier to enter the patch data into code
class ItemDefinition(NamedTuple):
    patch_version: str
    stat_dict: StatDictType


# A list of ItemDefinitions gives a full history of the item's stats over time...
type ItemHistoryType = list[ItemDefinition]

# ... and adding the item_id & item_name gives us all the information we need
type ItemFullInfoType = tuple[int, str, ItemHistoryType]
