from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'user', 'title', 'description', 'audio_file', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

