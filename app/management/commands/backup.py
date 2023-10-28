import os
import time
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Realiza um backup do banco de dados'

    def handle(self, *args, **options):
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')

        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)

        timestamp = time.strftime('%Y-%m-%d-%H-%M-%S')
        backup_file = os.path.join(backup_dir, f'backup-{timestamp}.sql')

        database_name = settings.DATABASES['default']['NAME']
        db_username = settings.DATABASES['default']['USER']
        db_host = settings.DATABASES['default']['HOST']

        os.system(f'pg_dump -U {db_username} -h {db_host} -Fc {database_name} > {backup_file}')

        self.stdout.write(self.style.SUCCESS(f'Backup do banco de dados criado em: {backup_file}'))
