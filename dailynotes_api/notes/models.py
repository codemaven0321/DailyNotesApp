from django.db import models
from django.conf import settings
import os

class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    description = models.TextField()
    audio_file = models.FileField(upload_to='audio_notes/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.audio_file:
            self.audio_file.name = os.path.basename(self.audio_file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title