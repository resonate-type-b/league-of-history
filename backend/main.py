from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from conn import engine
from datamodel import BaseORM
from patch_history_data import import_patch_history_data


BaseORM.metadata.create_all(engine)
import_patch_history_data()

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
