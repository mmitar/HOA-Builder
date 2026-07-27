from fastapi import APIRouter, HTTPException
from sqlmodel import select
from database import DbSession
from models import Community, Note, NoteModify, NoteResponse, NoteModify

router = APIRouter(prefix="/communities/{community_id}/notes", tags=["Notes"])

NOTE_MAX_LENGTH = 500


def _validate_message(message: str) -> str:
    stripped = message.strip()
    if not stripped:
        raise HTTPException(status_code=422, detail="Note message cannot be blank")
    if len(stripped) > NOTE_MAX_LENGTH:
        raise HTTPException(
            status_code=422,
            detail=f"Note message cannot exceed {NOTE_MAX_LENGTH} characters",
        )
    return stripped


def _get_community(session: DbSession, community_id: int) -> Community:
    community = session.get(Community, community_id)
    if not community:
        raise HTTPException(status_code=404, detail=f"Community '{community_id}' not found")
    return community


def _get_note(session: DbSession, community_id: int, note_id: int) -> Note:
    note = session.get(Note, note_id)
    if not note or note.community_id != community_id:
        raise HTTPException(status_code=404, detail=f"Note '{note_id}' not found for Community '{community_id}'")
    return note


@router.get("/", response_model=list[NoteResponse], status_code=200)
def list_notes(session: DbSession, community_id: int):
    _get_community(session, community_id)
    statement = select(Note).where(Note.community_id == community_id).order_by(Note.creation_date.desc())
    return session.exec(statement).all()


@router.post("/", response_model=NoteResponse, status_code=201)
def create_note(session: DbSession, community_id: int, note: NoteModify) -> NoteResponse:
    _get_community(session, community_id)
    message = _validate_message(note.message)
    new_note = Note(message=message, community_id=community_id)
    session.add(new_note)
    session.commit()
    session.refresh(new_note)
    return new_note


@router.get("/{note_id}", response_model=NoteResponse, status_code=200)
def get_note(session: DbSession, community_id: int, note_id: int) -> NoteResponse:
    return _get_note(session, community_id, note_id)


@router.put("/{note_id}", response_model=NoteResponse, status_code=200)
def update_note(
    session: DbSession,
    community_id: int,
    note_id: int,
    updated_note: NoteModify,
) -> NoteResponse:
    _get_community(session, community_id)
    note = _get_note(session, community_id, note_id)

    updates = updated_note.model_dump(exclude_unset=True)
    if "message" in updates:
        updates["message"] = _validate_message(updates["message"])
    for key, value in updates.items():
        setattr(note, key, value)

    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.delete("/{note_id}", status_code=204)
def delete_note(session: DbSession, community_id: int, note_id: int) -> None:
    _get_community(session, community_id)
    note = _get_note(session, community_id, note_id)
    session.delete(note)
    session.commit()
