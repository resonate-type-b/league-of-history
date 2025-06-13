from fastapi import FastAPI
from typing import Optional
from sqlalchemy import select, desc
from fastapi.middleware.cors import CORSMiddleware

from conn import engine, initialise_sqlite, session_factory
from datamodel import BaseORM, Patch, Item
from patch_history_data import import_patch_history_data
from items import format_single_item_data, insert_items_data
from items_library import all_items


# ====== data loading stuff here ======
initialise_sqlite()

BaseORM.metadata.create_all(engine)
import_patch_history_data()

for item in all_items:
    insert_items_data(format_single_item_data(item))

with session_factory.begin() as session:
    latest_patch: str = str(session.scalar(select(Patch.patch_version).order_by(desc(Patch.patch_date)).limit(1)))


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
    return "Welcome to the League of Legends Items API!"


# note that patch_version, even if provided, will be ignored if item_id is specified,
# as there is no use case for specifying both paremeters.
# //TODO: querying an non existing item or patch should return an error message instead of empty
@app.get("/items/")
def get_item(item_id: Optional[int] = None, patch_version: str = latest_patch) -> list[dict[str, str | int]]:
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
        item_data = [item.to_dense_dict() for item in session.scalars(stmt).all()]

    return item_data
