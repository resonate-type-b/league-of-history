from typing import NamedTuple


type StatDictType = dict[str, str | int | None]


class ItemDefinition(NamedTuple):
    patch_version: str
    stat_dict: StatDictType


# this is a  list of dicts. Each dict includes the patch_version, as well as the changes made in that patch.
# note that the full stats are not included in each dict, only the incremental changes
type ItemHistoryType = list[ItemDefinition]
type ItemFullInfoType = tuple[int, str, ItemHistoryType]
