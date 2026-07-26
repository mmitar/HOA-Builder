"""
Tests for the note routes.
"""

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Override database initialization on app startup
with patch("database.initialize_database"), patch("database.seed_data"):
    from main import app

from database import get_session
from models import Community, Note


@pytest.fixture
def mock_session():
    session = MagicMock()
    app.dependency_overrides[get_session] = lambda: session
    yield session
    app.dependency_overrides.clear()


@pytest.fixture
def client(mock_session):
    return TestClient(app)


def make_community(**overrides) -> Community:
    defaults = dict(
        name="Maple Grove HOA",
        address="1 Maple St",
        city="Springfield",
        state="IL",
        zip_code="62701",
        president_name="Jane Doe",
        president_email="jane@example.com",
        annual_budget=10000.0,
        monthly_dues=100.0,
        founded_year=2000,
        description="A neighborhood community.",
    )
    defaults.update(overrides)
    instance = Community(**defaults)
    instance.community_id = 1
    return instance

def make_note(**overrides) -> Note:
    defaults = dict(
        message="This is a sample note.",
        community_id=1,
    )
    defaults.update(overrides)
    instance = Note(**defaults)
    instance.note_id = 1
    return instance


def test_list_notes_returns_notes(client, mock_session):
    mock_session.get.return_value = make_community()
    mock_session.exec.return_value.all.return_value = [make_note()]

    response = client.get("/communities/1/notes")
    assert response.status_code == 200
    assert response.json()[0]["note_id"] == 1


def test_create_note_for_existing_community_succeeds(client, mock_session):
    mock_session.get.return_value = make_community()
    mock_session.refresh.side_effect = lambda obj: setattr(obj, "note_id", 1)

    response = client.post(
        "/communities/1/notes",
        json={"message": "Details"},
    )

    assert response.status_code == 201
    assert response.json()["note_id"] == 1
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()


def test_get_note_not_found_returns_404(client, mock_session):
    mock_session.get.return_value = None

    response = client.get("/communities/1/notes/999")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_update_note_for_existing_community_succeeds(client, mock_session):
    mock_session.get.side_effect = [make_community(), make_note()]

    response = client.put(
        "/communities/1/notes/1",
        json={"message": "Updated description"},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Updated description"
    mock_session.commit.assert_called_once()


def test_delete_note_for_existing_community_succeeds(client, mock_session):
    mock_session.get.side_effect = [make_community(), make_note()]

    response = client.delete("/communities/1/notes/1")

    assert response.status_code == 204
    mock_session.commit.assert_called_once()
