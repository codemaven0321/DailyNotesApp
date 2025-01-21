from django.contrib import admin
from .models import Note

class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at', 'author')
    search_fields = ['title', 'content']

admin.site.register(Note, NoteAdmin)