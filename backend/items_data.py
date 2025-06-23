from sqlalchemy import insert, update
from pydantic_model import ItemModel
from typing import Sequence
from sqlalchemy import select
from collections import defaultdict

from conn import session_factory
from orm_model import Item


type StatDictType = dict[str, str | int | float | None]


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
        ItemModel.model_validate(curr_definition)

        return_list.append(ItemModel.model_validate(curr_definition))

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


def categorise_final_items():
    components_by_patch: dict[str, set[int]] = defaultdict(set)
    update_list: list[dict[str, str | int]] = []
    with session_factory.begin() as session:
        all_items = session.execute(select(Item.item_id, Item.category, Item.components, Item.patch_version)).all()

        for item_id, category, components, patch_version in all_items:
            if components is not None and category != "Transforms":
                components_by_patch[patch_version].update(components)

        for item_id, category, components, patch_version in all_items:
            item_id = int(item_id)
            if item_id not in components_by_patch[patch_version] and category == "":
                update_list.append(dict(item_id=item_id, patch_version=patch_version, category="Final"))

        if update_list:
            session.execute(update(Item), update_list)
