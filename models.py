from pydantic import BaseModel

class CommunityBase(BaseModel):
    name: str
    description: str = ""

class CommunityCreate(CommunityBase):
    pass

class CommunityUpdate(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    id: int