import csv
from pathlib import Path
from typing import Annotated
from sqlmodel import Session, SQLModel, create_engine
from fastapi import Depends
from models import Community

# Define paths and database URL
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "sqlite.db"
DB_URL = f"sqlite:///{DB_PATH}"
CSV_PATH = BASE_DIR / "data" / "communities.csv"
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

def seed_data(db_path=DB_PATH, csv_path=CSV_PATH):
    if not csv_path.exists():
        return False

    with Session(engine) as session:
        with csv_path.open(newline="", encoding="utf-8") as handle:
            rows = list(csv.DictReader(handle))

        for row in rows:
            community = Community(
                name=row.get("name", "").strip(),
                address=row.get("address") or "",
                city=row.get("city") or "",
                state=row.get("state") or "",
                zip_code=row.get("zip_code") or "",
                president_name=row.get("president_name") or "",
                president_email=row.get("president_email") or "",
                annual_budget=float(row["annual_budget"]) if row.get("annual_budget") not in (None, "") else None,
                monthly_dues=float(row["monthly_dues"]) if row.get("monthly_dues") not in (None, "") else None,
                founded_year=int(row["founded_year"]) if row.get("founded_year") not in (None, "") else None,
                community_notes=row.get("community_notes") or "",
            )
            session.add(community)

        session.commit()
        return True
