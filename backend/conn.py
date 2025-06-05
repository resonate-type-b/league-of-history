from config import config
from pathlib import Path
import sqlite3
from sqlalchemy import create_engine, Engine


sqlite_db_path = Path(__file__).parent / config["SQLITE"]["sqlite_path"]
if not sqlite_db_path.exists():
    sqlite3.connect(sqlite_db_path)

engine: Engine = create_engine("sqlite:///" + str(sqlite_db_path))
