import os
import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from notes.models import Note

User = get_user_model()


@pytest.mark.django_db
def test_create_note():
    """
    Test creating a note with an audio file.
    """
    user = User.objects.create_user(
        email="testuser@example.com",
        username="testuser",  # Add username field
        password="testpassword123"
    )
    client = APIClient()
    client.force_authenticate(user=user)

    audio_file = SimpleUploadedFile(
        name="test-audio.webm",
        content=b"audio file content",
        content_type="audio/webm"
    )
    data = {
        "title": "Test Note",
        "description": "This is a test description.",
        "audio_file": audio_file,
    }

    response = client.post("/api/notes/", data, format="multipart")
    assert response.status_code == status.HTTP_201_CREATED
    note = Note.objects.get(title="Test Note")
    assert note.description == "This is a test description."
    assert note.user == user

    if os.path.exists(note.audio_file.path):
        os.remove(note.audio_file.path)


@pytest.mark.django_db
def test_get_notes():
    """
    Test retrieving notes for an authenticated user.
    """
    user = User.objects.create_user(
        email="testuser@example.com",
        username="testuser",  # Add username field
        password="testpassword123"
    )
    other_user = User.objects.create_user(
        email="otheruser@example.com",
        username="otheruser",  # Add username field
        password="password456"
    )

    Note.objects.create(user=user, title="User's Note", description="User's description")
    Note.objects.create(user=other_user, title="Other User's Note", description="Other User's description")

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get("/api/notes/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1  # Ensure only the user's note is returned
    assert data[0]["title"] == "User's Note"
    assert data[0]["description"] == "User's description"


@pytest.mark.django_db
def test_update_note():
    """
    Test updating a note for an authenticated user.
    """
    user = User.objects.create_user(
        email="testuser@example.com",
        username="testuser",  # Add username field
        password="testpassword123"
    )
    note = Note.objects.create(user=user, title="Old Title", description="Old Description")

    client = APIClient()
    client.force_authenticate(user=user)

    updated_data = {
        "title": "Updated Title",
        "description": "Updated Description",
    }
    response = client.put(f"/api/notes/{note.id}/", updated_data, format="json")
    assert response.status_code == status.HTTP_200_OK
    note.refresh_from_db()
    assert note.title == "Updated Title"
    assert note.description == "Updated Description"


@pytest.mark.django_db
def test_delete_note():
    """
    Test deleting a note for an authenticated user.
    """
    user = User.objects.create_user(
        email="testuser@example.com",
        username="testuser",  # Add username field
        password="testpassword123"
    )
    note = Note.objects.create(user=user, title="Note to Delete", description="Delete Me")

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.delete(f"/api/notes/{note.id}/")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Note.objects.filter(id=note.id).exists()


@pytest.mark.django_db
def test_unauthenticated_access():
    """
    Test that unauthenticated users cannot access the notes endpoint.
    """
    client = APIClient()

    create_response = client.post("/api/notes/", {"title": "Unauthorized"}, format="json")
    get_response = client.get("/api/notes/")
    delete_response = client.delete("/api/notes/1/")

    assert create_response.status_code == status.HTTP_401_UNAUTHORIZED
    assert get_response.status_code == status.HTTP_401_UNAUTHORIZED
    assert delete_response.status_code == status.HTTP_401_UNAUTHORIZED
