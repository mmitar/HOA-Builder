from typing import Optional
from sqlmodel import SQLModel, Field

class CommunityBase(SQLModel):
    name: str
    description: Optional[str] = ""

class Community(CommunityBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class CommunityCreate(CommunityBase):
    pass

class CommunityUpdate(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    id: int