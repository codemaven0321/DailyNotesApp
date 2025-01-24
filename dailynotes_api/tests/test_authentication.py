import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_register_user():
    """
    Test user registration.
    """
    client = APIClient()

    # Step 1: Send POST request to register a user
    response = client.post(
        "/api/auth/register/",
        {
            "email": "testuser@example.com",
            "username": "testuser",
            "password": "testpassword123",
        },
        format="json",
    )

    # Step 2: Verify the response
    assert response.status_code == status.HTTP_201_CREATED, f"Response: {response.json()}"
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert data["username"] == "testuser"

    # Step 3: Verify the user exists in the database
    user = User.objects.filter(email="testuser@example.com").first()
    assert user is not None
    assert user.username == "testuser"

@pytest.mark.django_db
def test_login_user():
    """
    Test user login.
    """
    # Step 1: Create a test user
    email = "testuser@example.com"
    username = "testuser"
    password = "testpassword123"
    User.objects.create_user(email=email, username=username, password=password)

    client = APIClient()

    # Step 2: Attempt login
    response = client.post(
        "/api/auth/login/",
        {"email": email, "password": password},
        format="json",
    )

    # Step 3: Verify the response
    assert response.status_code == status.HTTP_200_OK, f"Response: {response.json()}"
    data = response.json()
    assert "refresh" in data, "Refresh token missing"
    assert "access" in data, "Access token missing"
