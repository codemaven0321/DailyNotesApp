# Generated by Django 5.1.5 on 2025-01-20 10:28

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("notes", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameField(
            model_name="note",
            old_name="content",
            new_name="description",
        ),
        migrations.AlterField(
            model_name="note",
            name="title",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="note",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="notes",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
