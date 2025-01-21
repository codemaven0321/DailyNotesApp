from django.urls import path, include
from .views import NoteViewSet

urlpatterns = [
    path('notes/', NoteViewSet.as_view({'get': 'list', 'post': 'create'}), name='note-list-create'),
    path('notes/<int:pk>/', NoteViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='note-detail'),
]