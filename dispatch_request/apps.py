from django.apps import AppConfig
from django.contrib.auth.management.commands import createsuperuser
from django.core.management import CommandError

class DispatchRequestConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dispatch_request'

class CustomCreateSuperuserCommand(createsuperuser.Command):
    help = 'Create superuser with extended fields'

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument(
            '--password',
            help='Password for the superuser',
        )
        parser.add_argument(
            '--fname',
            help='First name for the superuser',
        )
        parser.add_argument(
            '--mname',
            help='Middle name for the superuser',
        )
        parser.add_argument(
            '--lname',
            help='Last name for the superuser',
        )
        parser.add_argument(
            '--access_level',
            help='Access level for the superuser',
            type=int,
        )
        parser.add_argument(
            '--active',
            help='Whether the superuser is active',
            action='store_true',
        )

    def handle(self, *args, **options):
        password = options.get('password')
        fname = options.get('fname')
        mname = options.get('mname')
        lname = options.get('lname')
        access_level = options.get('access_level')
        active = options.get('active')

        if not password or not fname or not lname or not access_level:
            raise CommandError('You must provide a password, first name, last name, and access level')

        user = self.UserModel._default_manager.db_manager(options['database']).create_superuser(
            username=options['username'],
            password=password,
            fname=fname,
            mname=mname,
            lname=lname,
            access_level=access_level,
            active=active,
        )
        self.stdout.write(self.style.SUCCESS('Superuser created successfully.'))
