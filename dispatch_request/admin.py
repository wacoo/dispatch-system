from django.contrib import admin
from django.contrib.auth.admin import UserAdmin  as BaseUserAdmin
# Register your models here.
from .models import User, VehicleRequest, Driver, Approval, Vehicle, Dispatch, Refuel, Department, VehicleMake, PricePerLiter, MonthlyPlan, Oil, Maintenance

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
admin.site.register(VehicleRequest)
admin.site.register(Driver)
admin.site.register(Approval)
admin.site.register(Vehicle)
admin.site.register(Dispatch)
admin.site.register(Refuel)
admin.site.register(Department)
admin.site.register(VehicleMake)
admin.site.register(PricePerLiter)
admin.site.register(MonthlyPlan)
admin.site.register(Oil)
admin.site.register(Maintenance)
