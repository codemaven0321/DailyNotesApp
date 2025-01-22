from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer
from rest_framework.permissions import IsAuthenticated

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This ensures that users can only access their own notes.
        """
        return Note.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Set the user to the currently authenticated user
        serializer.save(user=self.request.user)