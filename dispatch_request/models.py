from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.contrib.auth.models import BaseUserManager, Group
from django.db.models.functions import Lower
from django.utils import timezone
from enum import Enum

class CustomUserManager(BaseUserManager):
  ''' custom user class '''
  def _create_user(self, username, fname, mname, lname, department, access_level, password, phone_number, **extra_fields):
    ''' create user indirect method '''
    if not username:
            raise ValueError('The username must be set')

    user = self.model(
        username=username,
        fname=fname,
        mname=mname,
        lname=lname,
        department=department,
        phone_number=phone_number,
        access_level=access_level,
        **extra_fields
    )
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_user(self, username=None, fname=None, mname=None, lname=None, department=None, access_level=None, password=None, phone_number=None, **extra_fields):
    ''' create regular user method '''
    extra_fields.setdefault('is_staff', False)
    extra_fields.setdefault('is_superuser', False)
    return self._create_user(username, fname, mname, lname, department, access_level, password, phone_number, **extra_fields)

def create_superuser(self, username=None, fname=None, mname=None, lname=None, department=None, access_level=None, password=None, phone_number=None, **extra_fields):
    ''' create superuser method '''
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    if extra_fields.get('is_staff') is not True:
        raise ValueError('Superuser must have is_staff=True.')
    if extra_fields.get('is_superuser') is not True:
        raise ValueError('Superuser must have is_superuser=True.')
    
    return self._create_user(username, fname, mname, lname, department, access_level, password, phone_number, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
  ''' user class '''
  username = models.CharField(max_length=10, unique=True)
  fname = models.CharField(max_length=50, blank=False)
  mname = models.CharField(max_length=50, blank=False)
  lname = models.CharField(max_length=50, blank=True, default='')
  department = models.CharField(max_length=200, blank=False)
  access_level = models.IntegerField(default=0)# 0 = requester, 1= approver, 2 = dispatcher, 3 = admin
  phone_number = models.CharField(max_length=50, blank=True, default='')
  is_superuser = models.BooleanField(default=False)
  is_active = models.BooleanField(default=True)
  is_staff = models.BooleanField(default=False)
  date_joined = models.DateTimeField(default=timezone.now)
  last_login = models.DateField(blank=True, null=True)
    
  USERNAME_FIELD = 'username'
  REQUIRED_FIELDS = []

  objects = CustomUserManager()
  groups = models.ManyToManyField(Group, blank=True)

  class Meta:
    ''' User meta '''
    verbose_name = 'User'
    verbose_name_plural = 'Users'

  def get_full_name(self):
    ''' Get full name '''
    return "{} {} {}".format(self.fname, self.mname, self.lname)
    
  def get_short_name(self):
    ''' Return first name '''
    return self.fname
    
  def __str__(self):
    ''' return username  '''
    return self.username

class VehicleRequestStatus(Enum):
    ''' Status enumarable '''
    PENDING = 'PENDING'
    APPROVED = 'APPROVED'
    REJECTED = 'REJECTED'
    ACTIVE = 'ACTIVE'
    COMPLETE = 'COMPLETE'

class VehicleType(Enum):
    ''' Vehicle type enumerable '''
    CAR = 'CAR'
    BUS = 'BUS'
    MINIBUS = 'MINIBUS'
    VAN = 'VAN'
    TRUCK = 'TRUCK'
    BIKE = 'BIKE'

class DestinationType(Enum):
  ''' Destination type enumerable '''
  ADDIS_ABABA= 'ADDIS ABABA'
  AROUND_ADDIS_ABABA = 'AROUND ADDIS ABABA'
  REGIONAL = 'REGIONAL'

class VehicleStatus(Enum):
  ''' Destination type enumerable '''
  AVAILABLE= 'AVAILABLE'
  IN_USE = 'IN_USE'
  RESERVED = 'RESERVED'
  OUT_OF_SERVICE = 'OUT OF SERVICE'

# class VehicleRequest(models.Model):
#     ''' Vehicle request class '''
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     request_date = models.DateTimeField(default=timezone.now)
#     description = models.CharField(max_length=500)
#     requested_vehicle_type = models.CharField(max_length=50, choices=[(tag, tag.value) for tag in VehicleType], default=VehicleType.CAR)
#     destination = models.CharField(max_length=200)
#     estimated_duration = models.IntegerField(default=0)
#     status = models.CharField(max_length=50, choices=[(tag, tag.value) for tag in VehicleRequestStatus], default=VehicleRequestStatus.PENDING)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

class Driver(models.Model):
  ''' Drivers class '''
  fname = models.CharField(max_length=50)
  mname = models.CharField(max_length=50)
  lname = models.CharField(max_length=50, blank=True, default='')
  phone_number = models.CharField(max_length=20, blank=True, default='')
  id_no = models.CharField(max_length=20, unique=True)
  position = models.CharField(max_length=200, blank=True, default='')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

class Vehicle(models.Model):
  ''' Vehicle class '''
  make = models.CharField(max_length=200, default='')
  model = models.CharField(max_length=200, default='')
  year = models.IntegerField(default=0)
  type = models.CharField(max_length=50, choices=[(tag.name, tag.value) for tag in VehicleType], default=VehicleType.CAR.value)
  km_per_liter = models.FloatField(blank=True, default=0)
  current_milage = models.IntegerField(blank=True, default=0)
  license_plate = models.CharField(max_length=20, unique=True, default='')
  fuel_level = models.FloatField(blank=True, default=0)
  vehicle_status = models.CharField( null=True, max_length=50, choices=[(tag.name, tag.value) for tag in VehicleStatus], default=VehicleStatus.AVAILABLE.value)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

class Dispatch(models.Model):
  ''' Dispatch class '''
  # vehicle_request  = models.ForeignKey(VehicleRequest, on_delete=models.CASCADE)
  assigned_vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, default='')
  assigned_driver = models.ForeignKey(Driver, on_delete=models.CASCADE, default='')
  assigned_date = models.DateTimeField(default=timezone.now)
  departure_date = models.DateField(default=None, blank=True)
  departure_time_est = models.TimeField(default=None, blank=True)
  departure_time_act = models.TimeField(default='00:00:00')
  departure_milage = models.IntegerField(default=0)
  # departure_fuel_level = models.FloatField(blank=True, default=0.0)
  return_date_est = models.DateField(default='1970-01-01')
  return_date_act = models.DateField(default='1970-01-01')
  return_time_est = models.TimeField(default='00:00:00')
  return_time_act = models.TimeField(default='00:00:00')
  return_milage = models.IntegerField(default=0)
  # return_fuel_level = models.FloatField(blank=True, default=0.0)
  dispatcher = models.ForeignKey(User, on_delete=models.CASCADE, default='')
  refuel_liters = models.FloatField(max_length=20, default=0.0)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

    
class VehicleRequest(models.Model):
  ''' Vehicle request class '''
  user = models.ForeignKey(User, on_delete=models.CASCADE, default='')
  request_date = models.DateTimeField(default=timezone.now)
  description = models.CharField(max_length=500, default='')
  requested_vehicle_type = models.CharField(max_length=50, choices=[(tag.name, tag.value) for tag in VehicleType], default=VehicleType.CAR.value)
  destination = models.CharField(max_length=200, default='')
  destination_type = models.CharField(max_length=50, choices=[(tag.name, tag.value) for tag in DestinationType], default=DestinationType.ADDIS_ABABA.value)
  # estimated_duration_hrs = models.FloatField(default=0.00)  
  duration_from = models.DateTimeField(default=timezone.now)
  duration_time_from = models.TimeField(blank=True, default='')
  duration_to = models.DateTimeField(default=timezone.now)
  duration_time_to = models.TimeField(blank=True, default='')
  status = models.CharField(max_length=50, choices=[(tag.name, tag.value) for tag in VehicleRequestStatus], default=VehicleRequestStatus.PENDING.value)
  dispatch = models.ForeignKey(Dispatch, related_name='vehicle_requests', on_delete=models.CASCADE, null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

class Approval(models.Model):
  ''' Approval class '''
  request = models.ForeignKey(VehicleRequest, on_delete=models.CASCADE)
  manager = models.ForeignKey(User, on_delete=models.CASCADE)
  approval_date = models.DateTimeField(default=timezone.now)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

class FuelType(Enum):
  ''' Destination type enumerable '''
  BENZINE= 'BENZINE'
  NAFTA = 'NAFTA'

class Refuel(models.Model):
  ''' Refuel class'''
  vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
  refuel_request_date = models.DateField(default='')
  refuel_date = models.DateField(default='')
  nafta = models.CharField(max_length=50, blank=True, default='')
  benzine = models.CharField(max_length=50, blank=True, default='')
  nafta_price_ppl = models.FloatField(blank=True, default=0)
  benzine_price_ppl = models.FloatField(blank=True, default=0)
  km_during_refuel = models.IntegerField()
  km_during_previous_refuel = models.IntegerField()
  km_per_liter = models.FloatField()
  current_fuel_level = models.FloatField()
  remark = models.CharField(max_length=500, default='')

class Department(models.Model):
  ''' Refuel class'''
  dept_name = models.CharField(max_length=200)
  location = models.CharField(max_length=100, default='')
  extension = models.CharField(max_length=50, default='')
  phone_number = models.CharField(max_length=100, default='')


class PricePerLiter(models.Model):
  ''' Price per liter class'''
  nafta = models.CharField(max_length=200, default='')
  benzine = models.CharField(max_length=100, default='')
  nafta_active = models.BooleanField()
  benzine_active = models.BooleanField()

class MonthlyPlan(models.Model):
  ''' refuel monthly plan'''  
  vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
  month = models.CharField(max_length=100, default='')
  km = models.CharField(max_length=100, default='')
  liters = models.FloatField(blank=True, default=0)

class VehicleMake(models.Model):
  ''' Vehicle make class'''
  make = models.CharField(max_length=100, unique=True)
  class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower('make'),
                name='unique_make_case_insensitive'
            )
        ]

# class DispatchReport(models.Model):
#   ''' A class to store actual dispatch data after the vehicle returns'''
#   dispatch = models.ForeignKey(Dispatch, on_delete=models.CASCADE)   
#   departure_milage_km = models.IntegerField(default=0, blank=True)
#   departure_date = models.DateField(default='')
#   departure_time = models.TimeField(default='')  
#   return_milage_km = models.IntegerField(default=0, blank=True)
#   return_date = models.DateField(default='')
#   return_time = models.TimeField(default='')     
# #  difference_duration = calculated
# #  difference_distance = calculated
#   refuel_liters = models.FloatField(default='')
#   supervisor = models.ForeignKey(User, on_delete=models.CASCADE)