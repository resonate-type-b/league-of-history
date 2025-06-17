from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import MetaData
import os


db_path = os.getenv("DATABASE_URL")

# clear the database on start
engine = create_engine(db_path)  # type: ignore because if None, just letting it crash is the wanted behaviour
m = MetaData()
m.reflect(engine)
m.drop_all(engine)

session_factory = sessionmaker(bind=engine)
