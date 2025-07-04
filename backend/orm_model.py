from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Date, Boolean, Float
from sqlalchemy.dialects.postgresql import ARRAY
from typing import Any
from sqlalchemy import ForeignKey
from datetime import date


class BaseORM(DeclarativeBase):
    pass


# items stats have Integer type, dafaulting to None if unspecified
def stat_mapped_column(*args: Any, **kwargs: Any) -> Mapped[Any]:
    return mapped_column(Float, default=None, nullable=True, *args, **kwargs)


class Item(BaseORM):
    __tablename__ = "items"

    item_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    patch_version: Mapped[str] = mapped_column(String(20), ForeignKey("patches.patch_version"), primary_key=True)
    item_name: Mapped[str] = mapped_column(String(50))
    gold_cost: Mapped[int] = mapped_column(Integer, nullable=False)
    icon_version: Mapped[int] = mapped_column(Integer, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    components: Mapped[list[int]] = mapped_column(ARRAY(Integer), nullable=True)
    hp: Mapped[float] = stat_mapped_column()
    hp5: Mapped[float] = stat_mapped_column()
    hp_regen: Mapped[float] = stat_mapped_column()
    armor: Mapped[float] = stat_mapped_column()
    magic_resist: Mapped[float] = stat_mapped_column()
    tenacity: Mapped[float] = stat_mapped_column()
    # slow resist seems to always appear as a named passive... confirm and remove?
    slow_resist: Mapped[float] = stat_mapped_column()
    aspd: Mapped[float] = stat_mapped_column()
    ad: Mapped[float] = stat_mapped_column()
    ap: Mapped[float] = stat_mapped_column()
    crit_chance: Mapped[float] = stat_mapped_column()
    armor_pen_flat: Mapped[float] = stat_mapped_column()
    lethality: Mapped[float] = stat_mapped_column()
    armor_pen_percent: Mapped[float] = stat_mapped_column()
    magic_pen_flat: Mapped[float] = stat_mapped_column()
    magic_pen_percent: Mapped[float] = stat_mapped_column()
    lifesteal: Mapped[float] = stat_mapped_column()
    physical_vamp: Mapped[float] = stat_mapped_column()
    magic_vamp: Mapped[float] = stat_mapped_column()
    omnivamp: Mapped[float] = stat_mapped_column()
    cdr: Mapped[float] = stat_mapped_column()
    haste: Mapped[float] = stat_mapped_column()
    mp: Mapped[float] = stat_mapped_column()
    mp5: Mapped[float] = stat_mapped_column()
    mp_regen: Mapped[float] = stat_mapped_column()
    movespeed_flat: Mapped[float] = stat_mapped_column()
    movespeed_percent: Mapped[float] = stat_mapped_column()
    gp10: Mapped[float] = stat_mapped_column()
    heal_power: Mapped[float] = stat_mapped_column()
    passive_1: Mapped[str] = mapped_column(String(1000), nullable=True)
    passive_1_name: Mapped[str] = mapped_column(String(50), nullable=True)
    passive_2: Mapped[str] = mapped_column(String(1000), nullable=True)
    passive_2_name: Mapped[str] = mapped_column(String(50), nullable=True)
    passive_3: Mapped[str] = mapped_column(String(1000), nullable=True)
    passive_3_name: Mapped[str] = mapped_column(String(50), nullable=True)
    passive_4: Mapped[str] = mapped_column(String(1000), nullable=True)
    passive_4_name: Mapped[str] = mapped_column(String(50), nullable=True)
    buy_group: Mapped[list[str]] = mapped_column(ARRAY(String(50)), nullable=True)
    motd: Mapped[str] = mapped_column(String(1000), nullable=True)  # for bugfix/hotfix messages
    reworked: Mapped[bool] = mapped_column(Boolean, nullable=True)
    patches_existing: Mapped["Patch"] = relationship(back_populates="items")


class Patch(BaseORM):
    __tablename__ = "patches"

    patch_version: Mapped[str] = mapped_column(String(20), primary_key=True, unique=True)
    patch_date: Mapped[date] = mapped_column(Date, nullable=False)
    season: Mapped[int] = mapped_column(Integer, nullable=False)
    preseason: Mapped[bool] = mapped_column(Boolean, nullable=False)
    items: Mapped[list[Item]] = relationship(back_populates="patches_existing")


MODEL_DATATYPES = str | int | float | bool | list[int] | list[str]
