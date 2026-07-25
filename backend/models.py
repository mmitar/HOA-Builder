from typing import Optional
from sqlmodel import SQLModel, Field

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
    community_notes: Optional[str] = ""

class Community(CommunityBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class CommunityCreate(CommunityBase):
    pass

class CommunityUpdate(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    id: int