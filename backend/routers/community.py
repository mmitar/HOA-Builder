from fastapi import APIRouter, HTTPException
from sqlmodel import select
from database import DbSession
from models import Community, CommunityCreate, CommunityResponse, CommunityUpdate

router = APIRouter(prefix="/communities", tags=["Communities"])

@router.get("/", response_model=list[CommunityResponse], status_code=200)
def get_communities(session: DbSession, limit: int = 5):
    statement = select(Community).limit(limit)
    return session.exec(statement).all()


@router.get("/{community_id}", response_model=CommunityResponse, status_code=200)
def get_community(session: DbSession, community_id: int) -> CommunityResponse:
    community = session.get(Community, community_id)
    if community:
        return community
    raise HTTPException(status_code=404, detail=f"Community '{community_id}' not found")


@router.post("/", response_model=CommunityResponse, status_code=201)
def create_community(session: DbSession, community: CommunityCreate) -> CommunityResponse:
    existing = session.exec(select(Community).where(Community.name == community.name)).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Community with name '{community.name}' already exists")

    new_community = Community(**community.model_dump())
    session.add(new_community)
    session.commit()
    session.refresh(new_community)
    return new_community


@router.put("/{community_id}", response_model=CommunityResponse, status_code=200)
def update_community(
    session: DbSession,
    community_id: int,
    updated_community: CommunityUpdate,
) -> CommunityResponse:
    community = session.get(Community, community_id)
    if not community:
        raise HTTPException(status_code=404, detail=f"Community '{community_id}' not found")

    community.name = updated_community.name
    community.description = updated_community.description
    session.add(community)
    session.commit()
    return session.refresh(community)


@router.delete("/{community_id}", status_code=204)
def delete_community(session: DbSession, community_id: int) -> None:
    community = session.get(Community, community_id)
    if not community:
        raise HTTPException(status_code=404, detail=f"Community '{community_id}' not found")

    session.delete(community)
    session.commit()