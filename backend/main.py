from pathlib import Path
import json
from fastapi import FastAPI
from typing import Optional
from sqlalchemy import select, desc
from fastapi.middleware.cors import CORSMiddleware

from conn import engine, initialise_sqlite, session_factory
from orm_model import BaseORM, Patch, Item
from pydantic_model import ItemModel
from patch_history_data import import_patch_history_data
from items_data import format_item_from_json, insert_items_data


# ====== data loading stuff here ======
initialise_sqlite()

# models come from orm_model
BaseORM.metadata.create_all(engine)
import_patch_history_data()

with session_factory.begin() as session:
    patch_versions: list[str] = list(session.scalars(select(Patch.patch_version).order_by(Patch.patch_date)).all())
    latest_patch: str = patch_versions[-1]

p = Path(__file__).parent
for file in (p/"items_library").iterdir():
    if file.suffix == ".json":
        with open(file, "r", encoding="utf-8") as f:
            json_data = json.load(f)
            insert_items_data(format_item_from_json(json_data, patch_versions))


# ====== fastAPI stuff here ======
allowed_origins = [
    "http://localhost:5173",
    "https://localhost:5173",
    "http://localhost:3000",
    "https://localhost:3000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_headers=["*"]
)


@app.get("/")
def read_root():
    msg = "Welcome to the League of Legends Items API! Go to /docs for available endpoints"

    return msg


# note that patch_version, even if provided, will be ignored if item_id is specified,
# as there is no use case for specifying both paremeters.
@app.get("/items/")
def get_item(item_id: Optional[int] = None, patch_version: str = latest_patch) \
 -> list[dict[str, str | int | float | bool]] | str:
    if item_id is not None:
        # fetch timeline of item
        stmt = (
            select(Item)
            .join(Patch, Item.patch_version == Patch.patch_version)
            .where(Item.item_id == item_id)
            .order_by(desc(Patch.patch_date))
        )
    else:
        # return all items on specified patch
        stmt = (
            select(Item)
            .join(Patch, Item.patch_version == Patch.patch_version)
            .where(Item.patch_version == patch_version)
            .order_by(desc(Item.gold_cost))
        )

    with session_factory() as session:
        items = session.scalars(stmt).all()
        item_data = [ItemModel.model_validate(item).model_dump(exclude_none=True) for item in items]
    if not item_data:
        item_data = "Error: No matching items found"

    return item_data
