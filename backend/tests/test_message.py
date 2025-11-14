"""Tests for message endpoint."""

import pytest
from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_generate_message(client: TestClient):
    """Test message generation endpoint."""
    # TODO: Implement test
    # Note: This requires mocking the LLM service
    pass


def test_generate_message_without_auth():
    """Test message generation without authentication."""
    # TODO: Implement test
    pass
