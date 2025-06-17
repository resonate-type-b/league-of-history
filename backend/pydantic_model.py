from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

# there is no model for the patch table because I'm lazy and that table has static data that I already know is valid...


class ItemModel(BaseModel):
    item_id: int
    patch_version: str = Field(max_length=20)
    item_name: str = Field(max_length=50)
    gold_cost: int
    icon_version: int
    components: Optional[list[int]] = None
    hp: Optional[float] = None
    hp5: Optional[float] = None
    hp_regen: Optional[float] = None
    armor: Optional[float] = None
    magic_resist: Optional[float] = None
    tenacity: Optional[float] = None
    slow_resist: Optional[float] = None
    aspd: Optional[float] = None
    ad: Optional[float] = None
    ap: Optional[float] = None
    crit_chance: Optional[float] = None
    armor_pen_flat: Optional[float] = None
    lethality: Optional[float] = None
    armor_pen_percent: Optional[float] = None
    magic_pen_flat: Optional[float] = None
    magic_pen_percent: Optional[float] = None
    lifesteal: Optional[float] = None
    physical_vamp: Optional[float] = None
    magic_vamp: Optional[float] = None
    omnivamp: Optional[float] = None
    cdr: Optional[float] = None
    haste: Optional[float] = None
    mp: Optional[float] = None
    mp5: Optional[float] = None
    mp_regen: Optional[float] = None
    movespeed_flat: Optional[float] = None
    movespeed_percent: Optional[float] = None
    gp10: Optional[float] = None
    unique_passive_1: Optional[str] = Field(max_length=1000, default=None)
    unique_passive_1_name: Optional[str] = Field(max_length=50, default=None)
    unique_passive_2: Optional[str] = Field(max_length=1000, default=None)
    unique_passive_2_name: Optional[str] = Field(max_length=50, default=None)
    unique_passive_3: Optional[str] = Field(max_length=1000, default=None)
    unique_passive_3_name: Optional[str] = Field(max_length=50, default=None)
    unique_passive_4: Optional[str] = Field(max_length=1000, default=None)
    unique_passive_4_name: Optional[str] = Field(max_length=50, default=None)
    motd: Optional[str] = Field(max_length=1000, default=None)  # for bugfix/hotfix messages = None
    reworked: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)
