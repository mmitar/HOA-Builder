"""
Tests for the community routes. The database session is mocked entirely,
no real SQLite reads/writes — so these tests focus purely on the business rules.
"""

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Override database initialization on app startup
with patch("database.initialize_database"), patch("database.seed_data"):
    from main import app

from database import get_session
from models import Community


@pytest.fixture
def mock_session():
    """Swap the DB session dependency for a MagicMock for the duration of a test."""
    session = MagicMock()
    app.dependency_overrides[get_session] = lambda: session
    yield session
    app.dependency_overrides.clear()


@pytest.fixture
def client(mock_session):
    return TestClient(app)


def make_community(**overrides) -> Community:
    """Build a Community instance with sensible defaults, as if loaded from the DB."""
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
        description="Welcome to the neighborhood.",
    )
    defaults.update(overrides)
    instance = Community(**defaults)
    instance.community_id = 1
    return instance


def test_create_community_with_unique_name_succeeds(client, mock_session):
    mock_session.exec.return_value.first.return_value = None
    # Simulate the DB assigning a primary key when session.refresh() is called.
    mock_session.refresh.side_effect = lambda obj: setattr(obj, "community_id", 1)

    response = client.post(
        "/communities/", json={"name": "New Community", "description": "Notes"}
    )
    assert response.status_code == 201
    assert response.json()["name"] == "New Community"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()


def test_create_community_with_duplicate_name_returns_409(client, mock_session):
    mock_session.exec.return_value.first.return_value = make_community(
        name="Existing Community"
    )

    response = client.post(
        "/communities/", json={"name": "Existing Community", "description": "Notes"}
    )
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]
    mock_session.add.assert_not_called()


def test_get_community_not_found_returns_404(client, mock_session):
    mock_session.get.return_value = None

    response = client.get("/communities/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_update_community_not_found_returns_404(client, mock_session):
    mock_session.get.return_value = None

    response = client.put(
        "/communities/999", json={"name": "X", "description": "Y"}
    )
    assert response.status_code == 404


def test_update_community_with_empty_description_succeeds(client, mock_session):
    mock_session.get.return_value = make_community()

    response = client.put(
        "/communities/1",
        json={"name": "Maple Grove HOA", "description": ""},
    )
    assert response.status_code == 200
    mock_session.commit.assert_called_once()


def test_update_community_with_valid_description_returns_200(client, mock_session):
    mock_session.get.return_value = make_community()

    response = client.put(
        "/communities/1",
        json={"name": "Maple Grove HOA", "description": "Updated notes"},
    )
    assert response.status_code == 200
    assert response.json()["description"] == "Updated notes"
    mock_session.commit.assert_called_once()


def test_delete_community_not_found_returns_404(client, mock_session):
    mock_session.get.return_value = None

    response = client.delete("/communities/999")
    assert response.status_code == 404