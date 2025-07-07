from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional, Self

# there is no model for the patch table because I'm lazy and that table has static data that I already know is valid...


class ItemModel(BaseModel):
    item_id: int
    patch_version: str = Field(max_length=20)
    item_name: str = Field(max_length=50)
    gold_cost: int
    icon_version: int
    category: str
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
    heal_power: Optional[float] = None
    passive_1: Optional[str] = Field(max_length=1000, default=None)
    passive_1_name: Optional[str] = Field(max_length=50, default=None)
    passive_2: Optional[str] = Field(max_length=1000, default=None)
    passive_2_name: Optional[str] = Field(max_length=50, default=None)
    passive_3: Optional[str] = Field(max_length=1000, default=None)
    passive_3_name: Optional[str] = Field(max_length=50, default=None)
    passive_4: Optional[str] = Field(max_length=1000, default=None)
    passive_4_name: Optional[str] = Field(max_length=50, default=None)
    buy_group: Optional[list[str]] = None
    motd: Optional[str] = Field(max_length=1000, default=None)  # for bugfix/hotfix messages
    reworked: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def mutually_exclusive_stats(self) -> Self:
        exclusive_stats = [
            ("hp5", "hp_regen"),
            ("mp5", "mp_regen"),
            ("armor_pen_flat", "lethality"),
            ("cdr", "haste")
        ]

        for stat1, stat2 in exclusive_stats:
            if getattr(self, stat1) and getattr(self, stat2):
                raise ValueError(f"Only one of {stat1} or {stat2} can be set.")
        return self

    @model_validator(mode="after")
    def check_zero_value(self) -> Self:
        numerical_stats = [
            "hp",
            "hp5",
            "hp_regen",
            "armor",
            "magic_resist",
            "tenacity",
            "slow_resist",
            "aspd",
            "ad",
            "ap",
            "crit_chance",
            "armor_pen_flat",
            "lethality",
            "armor_pen_percent",
            "magic_pen_flat",
            "magic_pen_percent",
            "lifesteal",
            "physical_vamp",
            "magic_vamp",
            "omnivamp",
            "cdr",
            "haste",
            "mp",
            "mp5",
            "mp_regen",
            "movespeed_flat",
            "movespeed_percent",
            "gp10",
            "heal_power"
        ]

        for stat in numerical_stats:
            value = getattr(self, stat)
            if value == 0:
                raise ValueError(f"{stat} is 0. Should be None instead.")
        return self
