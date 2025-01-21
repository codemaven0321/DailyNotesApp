from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Add custom fields if needed
    # Example: phone_number = models.CharField(max_length=15)
    pass
