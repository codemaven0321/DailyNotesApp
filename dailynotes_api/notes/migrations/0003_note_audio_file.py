# Generated by Django 5.1.5 on 2025-01-20 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("notes", "0002_rename_content_note_description_alter_note_title_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="note",
            name="audio_file",
            field=models.FileField(blank=True, null=True, upload_to="audio_notes/"),
        ),
    ]
