import logging
from datetime import date
import csv
from sqlalchemy import insert
from conn import session_factory
from orm_model import Patch
from pathlib import Path


def import_patch_history_data(filepath: str | Path):
    insert_list: list[dict[str, str | date | int]] = []

    with open(filepath, mode='r', newline='') as csvfile:
        logging.info("loading patch history data...")
        csvreader = csv.reader(csvfile)
        next(csvreader)  # skip header
        for row in csvreader:
            patch_version = row[0]
            patch_date = date.fromisoformat(row[1])
            season = int(row[2])
            preseason = (False if row[3] == "false" else True)

            insert_list.append({
                "patch_version": patch_version,
                "patch_date": patch_date,
                "season": season,
                "preseason": preseason
            })

        with session_factory.begin() as session:
            session.execute(
                insert(Patch),
                insert_list
            )

        logging.info("patch history data done...")
