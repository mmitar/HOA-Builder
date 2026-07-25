from typing import Annotated
from sqlmodel import Session, SQLModel, create_engine
from fastapi import Depends

sqlite_url = "sqlite:///backend/sqlite.db"
engine = create_engine(sqlite_url, echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

DbSession = Annotated[Session, Depends(get_session)]