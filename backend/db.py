import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os

load_dotenv()

url: str | None = os.environ["psql"]

engine = create_engine(url)


SessionLocal: sessionmaker[Session] = sessionmaker(engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
