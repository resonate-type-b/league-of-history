# make sure this goes on top to load the .env!
import env_config  # type:ignore  # noqa: F401

from pathlib import Path
import json
from fastapi import FastAPI
from sqlalchemy import select, desc
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import date
from collections import defaultdict

from conn import engine, session_factory
from orm_model import BaseORM, Patch, Item, MODEL_DATATYPES
from pydantic_model import ItemModel
from patch_history_data import import_patch_history_data
from items_data import format_item_from_json, insert_items_data, categorise_final_items


# ====== data loading stuff here ======
# models come from orm_model
BaseORM.metadata.create_all(engine)
import_patch_history_data(Path(__file__).parent / "patch_history.csv")

with session_factory.begin() as session:
    patch_versions: list[str] = list(session.scalars(select(Patch.patch_version).order_by(Patch.patch_date)).all())
    latest_patch: str = patch_versions[-1]

p = Path(__file__).parent
for file in (p/"items_library").iterdir():
    if file.suffix == ".json":
        with open(file, "r", encoding="utf-8") as f:
            try:
                json_data = json.load(f)
                insert_items_data(format_item_from_json(json_data, patch_versions))
            except json.decoder.JSONDecodeError as e:
                print(f"Error decoding JSON from {file}: {e}")

categorise_final_items()

# ====== fastAPI stuff here ======

if os.getenv("ENV") == "dev":
    allowed_origins = [
        "http://localhost:5173",
        "https://localhost:5173",
        "http://localhost:3000",
        "https://localhost:3000",
        "https://resonate.moe"
    ]
elif os.getenv("ENV") == "prod":
    allowed_origins = [
        "https://resonate.moe"
    ]
else:
    raise ValueError("no environment specified")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_headers=["*"]
)


@app.head("/", include_in_schema=False)
@app.get("/", include_in_schema=False)
def read_root():
    msg = "Welcome to the League of Legends Items API! Go to /docs for available endpoints"

    return msg


# note that patch_version, even if provided, will be ignored if item_id is specified,
# as there is no use case for specifying both paremeters.
@app.get("/patch/")
def get_patch(patch_version: str = latest_patch) \
 -> dict[str, list[dict[str, MODEL_DATATYPES]]] | str:  # any type from the model, or a plain string in case of error
    stmt = (
        select(Item)
        .join(Patch, Item.patch_version == Patch.patch_version)
        .where(Item.patch_version == patch_version)
        .order_by(desc(Item.gold_cost), desc(Item.item_id))
    )

    with session_factory() as session:
        items = session.scalars(stmt).all()

        # a dictionary with 'category: str' as key,
        # containing a list of dicts, each of which is a dict representation of an item
        items_by_category: dict[str, list[dict[str, MODEL_DATATYPES]]] = defaultdict(list)
        for item in items:
            item = ItemModel.model_validate(item).model_dump(exclude_none=True)
            category = item["category"] if item["category"] else "Others"
            items_by_category[category].append(item)

    if not items_by_category:
        return "Error: No matching item found"
    return items_by_category


@app.get("/item/")
def get_item(item_id: int):

    stmt = (
        select(Item)
        .join(Patch, Item.patch_version == Patch.patch_version)
        .where(Item.item_id == item_id)
        .order_by(desc(Patch.patch_date))
    )

    with session_factory() as session:
        items = session.scalars(stmt).all()
        item_list = [ItemModel.model_validate(item).model_dump(exclude_none=True) for item in items]

    if not item_list:
        return "Error: No items found"
    return item_list


@app.get("/patch_versions/")
def get_patch_list() -> list[tuple[str, int, date]]:
    stmt = (
        select(Patch)
        .order_by(desc(Patch.patch_date))
    )

    with session_factory() as session:
        patches = session.scalars(stmt).all()
        patches = [(patch.patch_version, patch.season, patch.patch_date) for patch in patches]
    return patches
