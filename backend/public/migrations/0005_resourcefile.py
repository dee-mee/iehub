from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('public', '0004_donation'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResourceFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('file', models.FileField(upload_to='resource_files/')),
                ('file_type', models.CharField(
                    choices=[
                        ('PDF', 'PDF'),
                        ('VIDEO', 'Video'),
                        ('AUDIO', 'Audio'),
                        ('IMAGE', 'Image'),
                        ('DOCUMENT', 'Document'),
                        ('OTHER', 'Other'),
                    ],
                    default='OTHER',
                    max_length=16,
                )),
                ('label', models.CharField(
                    blank=True,
                    default='',
                    help_text='Optional display label, e.g. "English PDF" or "Intro Video"',
                    max_length=255,
                )),
                ('order', models.PositiveSmallIntegerField(default=0, help_text='Display order (lower = first)')),
                ('resource', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='files',
                    to='public.resource',
                )),
            ],
            options={
                'ordering': ['order', 'created_at'],
            },
        ),
    ]
