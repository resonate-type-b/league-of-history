from config import config
from pathlib import Path
import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# TODO: we want to eventually just use in memory sqlite, currently using a file for debugging
sqlite_db_path = Path(config['PATH']['BASE']) / Path(config["PATH"]["sqlite_path"])
if sqlite_db_path.exists():
    os.remove(sqlite_db_path)

sqlite3.connect(sqlite_db_path)

engine = create_engine("sqlite:///" + str(sqlite_db_path))
session_factory = sessionmaker(bind=engine)
