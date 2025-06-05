from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Date
from typing import Any


class BaseORM(DeclarativeBase):
    pass


# items stats have Integer type, dafaulting to None if unspecified
def stat_mapped_column(*args: Any, **kwargs: Any) -> Mapped[Any]:
    return mapped_column(Integer, default=None, nullable=True, *args, **kwargs)


class Item(BaseORM):
    __tablename__ = "items"

    item_id: Mapped[int] = mapped_column(Integer, primary_key=True, unique=True)
    item_name: Mapped[str] = mapped_column(String(50), unique=True)
    patch_version: Mapped[str] = mapped_column(String(20), nullable=False)
    gold_cost: Mapped[int] = mapped_column(Integer, nullable=False)
    hp: Mapped[int] = stat_mapped_column()
    hp5: Mapped[int] = stat_mapped_column()
    armor: Mapped[int] = stat_mapped_column()
    magic_resist: Mapped[int] = stat_mapped_column()
    tenacity: Mapped[int] = stat_mapped_column()
    slow_resist: Mapped[int] = stat_mapped_column()
    aspd: Mapped[int] = stat_mapped_column()
    ad: Mapped[int] = stat_mapped_column()
    ap: Mapped[int] = stat_mapped_column()
    crit_chance: Mapped[int] = stat_mapped_column()
    armor_pen_flat: Mapped[int] = stat_mapped_column()
    armor_pen_percent: Mapped[int] = stat_mapped_column()
    magic_pen_flat: Mapped[int] = stat_mapped_column()
    magic_pen_percent: Mapped[int] = stat_mapped_column()
    lifesteal: Mapped[int] = stat_mapped_column()
    physical_vamp: Mapped[int] = stat_mapped_column()
    magic_vamp: Mapped[int] = stat_mapped_column()
    omnivamp: Mapped[int] = stat_mapped_column()
    cdr: Mapped[int] = stat_mapped_column()
    haste: Mapped[int] = stat_mapped_column()
    mp: Mapped[int] = stat_mapped_column()
    mp5: Mapped[int] = stat_mapped_column()
    movespeed: Mapped[int] = stat_mapped_column()
    gp5: Mapped[int] = stat_mapped_column()
    unique_passive_1: Mapped[str] = mapped_column(String(200), nullable=True)
    unique_passive_1_name: Mapped[str] = mapped_column(String(20), nullable=True)
    unique_passive_2: Mapped[str] = mapped_column(String(200), nullable=True)
    unique_passive_2_name: Mapped[str] = mapped_column(String(20), nullable=True)
    unique_passive_3: Mapped[str] = mapped_column(String(200), nullable=True)
    unique_passive_3_name: Mapped[str] = mapped_column(String(20), nullable=True)


class Patch(BaseORM):
    __tablename__ = "patch"

    patch_version: Mapped[str] = mapped_column(String(20), primary_key=True, unique=True)
    patch_date: Mapped[str] = mapped_column(Date, nullable=False)
    season: Mapped[int] = mapped_column(Integer, nullable=False)
