from sqlalchemy import insert, update
from pydantic_model import ItemModel
from typing import Sequence, cast
from sqlalchemy import select
from collections import defaultdict
from pydantic import ValidationError

from conn import session_factory
from orm_model import Item, Patch


type StatDictType = dict[str, str | int | float | list[str] | None]


def format_item_from_json(data: list[StatDictType], patch_versions: list[str]) -> list[ItemModel]:
    '''
    Read the result of a json.read(), and parse the results into a list of full item definitions ready for inserting into the ORM.
    patch_versions should be sorted asc by date, and an entry will be provided for each version in the list,
    provided that the item exists that patch, as determined by the json data.
    '''  # noqa: E501

    # we want to work from oldest to newest
    data.reverse()
    # patch where item was first introduced
    first_patch_index = patch_versions.index(str(data[0]["patch_version"]))

    return_list: list[ItemModel] = []
    definition_idx = 0

    # default values to assume for an initial item definition goes here
    curr_definition: StatDictType = {
        "icon_version": 0,
        "reworked": None,
        "category": ""
    }

    removed = False
    for patch in patch_versions[first_patch_index:]:
        # if there is a change in this patch, update curr_definition with the changes
        if patch == data[definition_idx]["patch_version"]:
            try:
                # was the item added or removed this patch?
                removed = data[definition_idx]["removed"]
                data[definition_idx].pop("removed")
            except KeyError:  # the removed key was not present in the json this patch
                pass

            curr_definition.update(data[definition_idx])

            # if a later change still exists, we'll wait for that patch to come around
            # if there isn't then we're on the latest version of the item, so no more updating is required
            if definition_idx + 1 < len(data):
                definition_idx += 1

        # if the item is currently in a removed state, don't bother adding it to the list
        if removed:
            continue

        # the jsons are allowed to set category = null. We need to make sure it defaults to empty string.
        if curr_definition["category"] is None:
            curr_definition["category"] = ""

        curr_definition["patch_version"] = patch
        try:
            return_list.append(ItemModel.model_validate(curr_definition))
        except ValidationError as e:
            raise AssertionError(
                f"Error validating item {curr_definition['item_name']} for patch {patch}: {e}"
            ) from e

        # these once off values are not persisted to future patches
        curr_definition["motd"] = None
        curr_definition["reworked"] = None
    # make sure we matched every single entry in the json
    if definition_idx + 1 != len(data):
        raise AssertionError(
            f"{curr_definition["item_name"]} json not fully processed. Last good entry: {data[definition_idx]}")

    return return_list


def insert_items_data(items: Sequence[ItemModel]):
    """
    Insert a list of ItemModels into the items table.
    Each dictionary should have keys matching the column names in the items table.
    """
    item_dicts = [item.model_dump() for item in items]  # or just model_dump() if you want nulls
    with session_factory.begin() as session:
        session.execute(
            insert(Item),
            item_dicts
        )


# This function does two things:
# 1. If an item does not build into anything else,
#    and is not manually given a category (of either Boots or Transforms), it is categorised as Final.
# 2. If an item is a Final item, and is built from component items (to filter out starter items/consumables),
#    it is given a buy_group of its own name after patch 10.23, if one has not been manually set.
# TODO: add a warning if such an item costs less than e.g. 2000 gold, in case it's not a legendary
def categorise_final_items():
    components_by_patch: dict[str, set[int]] = defaultdict(set)
    update_list: list[StatDictType] = []
    with session_factory.begin() as session:
        all_items = session.execute(
            select(Item.item_id, Item.patch_version, Item.category, Item.components, Item.item_name, Item.buy_group)
        ).all()

        # all patches since the one legendary item limit was introduced in 10.23
        post_unique_legendary_patches = session.execute(
            select(Patch.patch_version)
            .where(Patch.patch_date >= "2020-11-11")
        ).scalars().all()
        post_unique_legendary_patches = set(post_unique_legendary_patches)

        for item_id, patch_version, category, components, item_name, buy_group in all_items:
            if components is not None and category != "Transforms":
                components_by_patch[patch_version].update(components)

        for item_id, patch_version, category, components, item_name, buy_group in all_items:
            # the type checker doesn't know how to unpack Row objects... Cast as necessary to shut it up
            item_id = cast(int, item_id)
            item_name = cast(str, item_name)
            if item_id not in components_by_patch[patch_version] and category == "":
                item_definition: StatDictType = dict(item_id=item_id, patch_version=patch_version, category="Final")
                # if it's a final item, and builds from something else, it's a legendary item
                if components is not None and buy_group is None and patch_version in post_unique_legendary_patches:
                    item_definition["buy_group"] = [item_name]
                update_list.append(item_definition)

        if update_list:
            session.execute(update(Item), update_list)
