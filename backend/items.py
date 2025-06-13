from sqlalchemy import select, insert

from items_library._helpers import ItemFullInfoType, StatDictType
from conn import session_factory
from datamodel import Patch, Item


def format_single_item_data(data: ItemFullInfoType) -> list[StatDictType]:
    """
    The returned list of dicts will have k:v pairs ready to be passed to the Items constructor, aka ready to be inserted into the table.
    there will be one dictionary for every patch verion in the patch table. An unchanged item will be duplicated from the previous patch.
    If an item does not exist on a particular patch, there will not be an entry.
    """  # noqa: E501

    with session_factory.begin() as session:
        patch_versions: list[str] = list(session.scalars(select(Patch.patch_version).order_by(Patch.patch_date)).all())

    item_id, item_name, item_definition_list = data[0], data[1], data[2]
    # get the index of patch_versions where the item first appeared
    first_patch_index = patch_versions.index(str(data[2][0].patch_version))

    return_list: list[StatDictType] = []

    definition_idx = 0
    # these don't change through patches, so we can set them once
    # would satisfy some higher NF if this link was moved to a separate table, but who cares
    curr_definition: StatDictType = {
        "item_id": item_id,
        "item_name": item_name,
    }
    for patch in patch_versions[first_patch_index:]:
        if patch == item_definition_list[definition_idx].patch_version:
            # if there is a change in this patch, update the current item definition
            curr_definition.update(item_definition_list[definition_idx].stat_dict)

            if definition_idx + 1 < len(item_definition_list):
                # if there is another definition, get ready to check for that patch version in the next loop
                # if there isn't then we won't iterate so the patch versions will never match again
                # which is correct because we're on latest version.
                definition_idx += 1
        curr_definition["patch_version"] = patch
        return_list.append(curr_definition.copy())

        # bugfixes/hotfix messages are not persisted to future patches
        curr_definition["motd"] = None

    return return_list


def insert_items_data(item_list: list[StatDictType]):
    """
    Insert a list of item dictionaries into the items table.
    Each dictionary should have keys matching the column names in the items table.
    """
    with session_factory.begin() as session:
        session.execute(
            insert(Item),
            item_list
        )
