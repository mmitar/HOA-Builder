from fastapi import FastAPI, HTTPException
from models import CommunityCreate, CommunityResponse, CommunityUpdate

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, World!"}

communities = [
    CommunityResponse(id=1, name="Community 1", description="This is the first community"),
]

@app.get("/communities", response_model=list[CommunityResponse])
def get_communities(limit: int = 5) -> list[CommunityResponse]:
    return communities[:limit]

@app.get("/communities/{community_id}", response_model=CommunityResponse)
def get_community(community_id: int) -> CommunityResponse:
    community = next((community for community in communities if community.id == community_id), None)
    if community:
        return community
    raise HTTPException(status_code=404, detail=f"Community '{community_id}' not found")

@app.post("/communities", response_model=list[CommunityResponse])
def create_community(community: CommunityCreate) -> list[CommunityResponse]:
    if any(existing_community.name == community.name for existing_community in communities):
        raise HTTPException(status_code=409, detail=f"Community with name '{community.name}' already exists")
    new_id = max((existing_community.id for existing_community in communities), default=0) + 1
    new_community = CommunityResponse(id=new_id, **community.dict())
    communities.append(new_community)
    return communities

@app.put("/communities/{community_id}", response_model=CommunityResponse)
def update_community(community_id: int, updated_community: CommunityUpdate) -> CommunityResponse:
    idx, community = next(((idx, community) for idx, community in enumerate(communities) if community.id == community_id), (None, None))
    if community:
        updated = CommunityResponse(id=community_id, **updated_community.dict())
        communities[idx] = updated
        return updated
    raise HTTPException(status_code=404, detail=f"Community '{community_id}' not found")

@app.delete("/communities/{community_id}", response_model=CommunityResponse)
def delete_community(community_id: int) -> CommunityResponse:
    idx, community = next(((idx, community) for idx, community in enumerate(communities) if community.id == community_id), (None, None))
    if community:
        return communities.pop(idx)
    raise HTTPException(status_code=404, detail=f"Community '{community_id}' not found")