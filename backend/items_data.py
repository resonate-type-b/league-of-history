from sqlalchemy import insert

from conn import session_factory
from datamodel import Item


type StatDictType = dict[str, str | int | float | None]


def format_item_from_json(data: list[StatDictType], patch_versions: list[str]) -> list[StatDictType]:
    '''
    Read the result of a json.read(), and parse the results into a list of full item definitions ready for inserting into the ORM.
    patch_versions should be sorted asc by date, and an entry will be provided for each version in the list,
    provided that the item exists that patch, as determined by the json data.
    '''  # noqa: E501

    # we want to work from oldest to newest
    data.reverse()
    # patch where item was first introduced
    first_patch_index = patch_versions.index(str(data[0]["patch_version"]))

    return_list: list[StatDictType] = []
    definition_idx = 0

    # default values to assume for an initial item definition goes here
    curr_definition: StatDictType = {
        "icon_version": 0,
        "reworked": None
    }

    for patch in patch_versions[first_patch_index:]:
        # if there is a change in this patch, update curr_definition with the changes
        if patch == data[definition_idx]["patch_version"]:
            curr_definition.update(data[definition_idx])

            # if a later change still exists, we'll wait for that patch to come around
            # if there isn't then we're on the latest version of the item, so no more updating is required
            if definition_idx + 1 < len(data):
                definition_idx += 1

        curr_definition["patch_version"] = patch
        return_list.append(curr_definition.copy())

        # these once off values are not persisted to future patches
        curr_definition["motd"] = None
        curr_definition["reworked"] = None

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
