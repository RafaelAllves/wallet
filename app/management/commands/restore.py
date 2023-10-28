import os
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Restores a database from a backup file'

    def add_arguments(self, parser):
        parser.add_argument('backup_file', help='Path to the backup file')

    def handle(self, *args, **options):
        backup_file = options['backup_file']
        
        db_name = settings.DATABASES['default']['NAME']
        db_user = settings.DATABASES['default']['USER']
        db_host = settings.DATABASES['default']['HOST']
        db_port = settings.DATABASES['default']['PORT']

        restore_cmd = f'pg_restore -U {db_user} -h {db_host} -d {db_name} -p {db_port} -Fc -c -v {backup_file}'

        os.system(restore_cmd)
        self.stdout.write(self.style.SUCCESS(f'Database {db_name} has been restored from {backup_file}'))
