from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel
import sqlalchemy as sa

# --- Note Model ---

class NoteBase(SQLModel):
    message: str

class NoteModify(NoteBase):
    pass

class NoteResponse(NoteBase):
    note_id: int
    community_id: int
    creation_date: datetime

class Note(NoteBase, table=True):
    note_id: Optional[int] = Field(default=None, primary_key=True)
    community_id: int = Field(foreign_key="community.community_id")
    message: str
    creation_date: datetime = Field(
        default=datetime.now(timezone.utc),
        sa_column=sa.Column(sa.DateTime(timezone=True), nullable=False)
    )
# --- Community Model ---

class CommunityBase(SQLModel):
    name: str
    address: Optional[str] = ""
    city: Optional[str] = ""
    state: Optional[str] = ""
    zip_code: Optional[str] = ""
    president_name: Optional[str] = ""
    president_email: Optional[str] = ""
    annual_budget: Optional[float] = None
    monthly_dues: Optional[float] = None
    founded_year: Optional[int] = None
    description: Optional[str] = ""

class Community(CommunityBase, table=True):
    community_id: Optional[int] = Field(default=None, primary_key=True)

class CommunityModify(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    community_id: int

