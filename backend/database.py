import json
from pathlib import Path
from typing import Annotated
from sqlmodel import Session, SQLModel, create_engine
from fastapi import Depends
from models import Community, Note

# Define paths and database URL
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "sqlite.db"
DB_URL = f"sqlite:///{DB_PATH}"
COMMUNITIES_PATH = BASE_DIR / "data" / "communities.json"
NOTES_PATH = BASE_DIR / "data" / "notes.json"
engine = create_engine(DB_URL, echo=False)

def get_session():
    """ Database session dependency Injection for FastAPI routes."""
    with Session(engine) as session:
        yield session

DbSession = Annotated[Session, Depends(get_session)]

def initialize_database(seed: bool = False):
    db_exists = DB_PATH.exists()
    SQLModel.metadata.create_all(engine)
    if not db_exists and seed:
        seed_data()

def seed_data():
    if not COMMUNITIES_PATH.exists():
        return False

    with Session(engine) as session:
        communities = json.loads(COMMUNITIES_PATH.read_text(encoding="utf-8"))
        session.add_all(Community(**row) for row in communities)

        if NOTES_PATH.exists():
            notes = json.loads(NOTES_PATH.read_text(encoding="utf-8"))
            session.add_all(Note(**row) for row in notes)

        session.commit()
        return True

