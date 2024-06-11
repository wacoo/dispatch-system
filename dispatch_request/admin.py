from django.contrib import admin
from django.contrib.auth.admin import UserAdmin  as BaseUserAdmin
# Register your models here.
from .models import User, VehicleRequest, Vehicle, Driver, Dispatch, Approval

class UserAdmin(BaseUserAdmin):
    ''' Custom user admin page '''
    list_display = ('username', 'password', 'fname', 'mname', 'lname', 'department', 'access_level', 'phone_number', 'is_staff', 'is_superuser')

    fieldsets = (
        (None, {'fields': ('username', 'fname', 'mname', 'lname', 'department', 'access_level', 'phone_number')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'fname', 'mname', 'lname', 'department', 'access_level', 'password1', 'password2', 'phone_number', 'is_staff', 'is_superuser'),
        }),
    )

admin.site.register(User, UserAdmin)
admin.site.register(Vehicle)
admin.site.register(VehicleRequest)
admin.site.register(Driver)
admin.site.register(Dispatch)
admin.site.register(Approval)
