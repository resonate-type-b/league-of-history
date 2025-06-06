from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from conn import engine, initialise_sqlite
from datamodel import BaseORM
from patch_history_data import import_patch_history_data
from items import format_single_item_data, insert_items_data
from items_library import all_items


if __name__ == "__main__":
    initialise_sqlite()

BaseORM.metadata.create_all(engine)
import_patch_history_data()

d = format_single_item_data(all_items[0])
insert_items_data(d)


class Item(BaseModel):
    item_id: int
    q: Optional[str] = None


app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: int, q: Optional[str] = None):
    return Item(item_id=item_id, q=q)
