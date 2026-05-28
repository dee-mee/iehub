from django.core.management.base import BaseCommand
from minio import Minio
from minio.error import S3Error
from django.conf import settings


class Command(BaseCommand):
    help = 'Initialize MinIO bucket for media storage'

    def handle(self, *args, **options):
        client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_USE_HTTPS,
        )

        bucket_name = settings.MINIO_MEDIA_BUCKET_NAME

        try:
            if not client.bucket_exists(bucket_name):
                client.make_bucket(bucket_name)
                self.stdout.write(
                    self.style.SUCCESS(f'Created bucket: {bucket_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Bucket already exists: {bucket_name}')
                )
        except S3Error as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating bucket: {e}')
            )
