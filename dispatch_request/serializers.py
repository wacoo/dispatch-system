''' serializer module '''
from django.contrib.auth.models import Group
from .models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import VehicleRequest, Driver, Approval, Vehicle, Dispatch, Refuel, Department, VehicleMake, PricePerLiter, MonthlyPlan, Oil, Maintenance

class UserLimitedSerializer(serializers.ModelSerializer):
    ''' only for Eager fetch '''
    class Meta:
        ''' Meta '''
        model = User
        fields = ('id', 'username', 'fname', 'mname', 'lname', 'department')

class UserSerializer(serializers.ModelSerializer):
    ''' user serializer class '''
    password = serializers.CharField(write_only=True)

    class Meta:
        ''' user serialization meta '''
        model = User
        fields = ('id', 'username', 'fname', 'mname', 'lname', 'department', 'access_level', 'password', 'phone_number', 'is_staff', 'is_superuser')
    def create(self, validated_data):
        ''' create user custom with password hashing '''
        is_superuser = validated_data.get('is_superuser', False)
        validated_data['password'] = make_password(validated_data.get('password'))
        if is_superuser:
            validated_data['is_staff'] = True
        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        ''' update user custom with password hashing '''
        password = validated_data.get('password')
        if password:
            validated_data['password'] = make_password(password)
        return super(UserSerializer, self).update(instance, validated_data)

class GroupSerializer(serializers.ModelSerializer):
    ''' group serielizer class '''
    class Meta:
        ''' group serizlizer meta '''
        model = Group
        fields = '__all__'

class MonthlyPlanSerializer(serializers.ModelSerializer):
    ''' monthly plan serielizer class '''
    class Meta:
        ''' group serizlizer meta '''
        model = MonthlyPlan
        fields = '__all__'

class VehicleRequestLimitedSerializer(serializers.ModelSerializer):
    '''Vehicle request serializer class'''
    # user = UserLimitedSerializer(read_only=True)
    class Meta:
        ''' Request meta '''
        model = VehicleRequest
        fields = ('id', 'request_date','requested_vehicle_type', 'destination_type', 'destination', 'duration_from', 'duration_to', 'status')
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            representation['user'] = UserLimitedSerializer(instance.user).data
        except User.DoesNotExist:
            representation['user'] = None
        return representation
# class StatusField(serializers.Field):
#     """
#     Custom serializer field for 'status'.
#     Allows only updating the 'status' field.
#     """
#     def to_representation(self, obj):
#         return obj

#     def to_internal_value(self, data):
#         return data
    
# class VehicleRequestSerializer(serializers.ModelSerializer):
#     '''Vehicle request serializer class'''
#     status = StatusField()  # Use the custom field for 'status'

#     class Meta:
#         ''' Request meta '''
#         model = VehicleRequest
#         fields = ('id', 'user', 'request_date', 'description', 'destination', 'requested_vehicle_type', 'destination_type', 'estimated_duration_hrs', 'status', 'created_at', 'updated_at')

#     def update(self, instance, validated_data):
#         instance.status = validated_data.get('status', instance.status)
#         instance.save()
#         return instance
class VehicleRequestSerializer(serializers.ModelSerializer):
    '''Vehicle request serializer class'''
    # user = UserLimitedSerializer(read_only=True)
    class Meta:
        ''' Request meta '''
        model = VehicleRequest
        fields = '__all__'
        # fields = ('id', 'user', 'request_date', 'description', 'destination', 'requested_vehicle_type', 'destination_type', 'duration_from', 'duration_time_from', 'duration_to', 'duration_time_to', 'status', 'dispatch', 'created_at', 'updated_at')
        # read_only_fields = ('id', 'user', 'request_date', 'description', 'destination', 'requested_vehicle_type', 'destination_type', 'estimated_duration_hrs', 'dispatch', 'created_at', 'updated_at')
    # def update(self, instance, validated_data):
    #     ''' update user custom with password hashing '''
    #     status = validated_data.get('status')
    #     if status == 'PENDING':
    #         validated_data['status'] = 'APPROVED'
    #     return super(VehicleRequestSerializer, self).update(instance, validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            representation['user'] = UserLimitedSerializer(instance.user).data
        except User.DoesNotExist:
            representation['user'] = None
        return representation

class DriverLimitedSerializer(serializers.ModelSerializer):
    ''' Drivers serializer '''
    class Meta:
        ''' Driver meta '''
        model= Driver
        fields = ('id', 'fname', 'mname', 'lname', 'id_no', 'position')
class DriverSerializer(serializers.ModelSerializer):
    ''' Drivers serializer '''
    class Meta:
        ''' Driver meta '''
        model= Driver
        fields = '__all__'

class VehicleLimitedSerializer(serializers.ModelSerializer):
    ''' Vehicle serializer '''
    class Meta:
        ''' Vehicle meta '''
        model= Vehicle
        fields = ('id', 'make', 'model', 'year', 'type', 'license_plate', 'km_per_liter')

class VehicleSerializer(serializers.ModelSerializer):
    ''' Vehicle serializer '''
    class Meta:
        ''' Vehicle meta '''
        model= Vehicle
        fields = '__all__'

class ApprovalSerializer(serializers.ModelSerializer):
    ''' Approval serializer '''
    class Meta:
        ''' Approval meta '''
        model = Approval
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            representation['manager'] = UserLimitedSerializer(instance.manager).data
            representation['request'] = VehicleRequestLimitedSerializer(instance.request).data
        except User.DoesNotExist:
            representation['user'] = None
        # except VehicleRequest.DoesNotExist:
        #     representation['request'] = None
        return representation

class DispatchSerializer(serializers.ModelSerializer):
    ''' Dispatch serializer '''
    vehicle_requests = VehicleRequestSerializer(many=True, read_only=True)
    # vehicle_requests = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        ''' Dispatch meta '''
        model = Dispatch
        # fields = '__all__'
        fields = ('id', 'assigned_vehicle', 'assigned_driver', 'assigned_date', 'departure_date', 'departure_time_est', 'departure_time_act', 'departure_milage', 'return_date_est', 'return_date_act', 'return_time_est', 'return_time_act', 'return_milage', 'dispatcher', 'refuel_liters', 'vehicle_requests', 'created_at', 'updated_at')
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            representation['driver'] = DriverLimitedSerializer(instance.assigned_driver).data
            representation['vehicle'] = VehicleLimitedSerializer(instance.assigned_vehicle).data
            representation['dispatcher'] = UserLimitedSerializer(instance.dispatcher).data
            if 'vehicle_requests' in representation:
                # Customize the representation of each request in vehicle_requests list
                representation['vehicle_requests'] = [
                    {
                        'id': request['id'],                        
                        'request_date': request['request_date'],
                        'destination': request['destination'],
                        'description': request['description'],
                        'requester': request['user'],
                        # Include more fields if needed
                    }
                    for request in representation['vehicle_requests']
                ]
        except Driver.DoesNotExist:
            representation['driver'] = None
        except Vehicle.DoesNotExist:
            representation['vehilce'] = None
        # except VehicleRequest.DoesNotExist:
            # representation['request'] = None
        except User.DoesNotExist:
            representation['dispatcher'] = None
        # except Vehicle.DoesNotExist:
        #     representation['vehicle'] = None
        # except VehicleRequest.DoesNotExist:
        #     representation['vehicle'] = None
        return representation

class RefuelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refuel
        fields=('id', 'vehicle', 'refuel_request_date', 'refuel_date', 'nafta', 'benzine', 'nafta_price_ppl', 'benzine_price_ppl', 'km_during_refuel', 'km_during_previous_refuel', 'km_per_liter', 'current_fuel_level', 'remark')
        #fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            representation['vehicle'] = VehicleLimitedSerializer(instance.vehicle).data
        except Vehicle.DoesNotExist:
            representation['vehicle'] = None
        # except VehicleRequest.DoesNotExist:
        #     representation['request'] = None
        return representation

class PricePerLiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricePerLiter
        fields = '__all__'

# class RefuelALLSerializer(serializers.ModelSerializer):
#     total_benzine_liters = serializers.SerializerMethodField()
#     total_benzine_price = serializers.SerializerMethodField()
#     total_nafta_liters = serializers.SerializerMethodField()
#     total_nafta_price = serializers.SerializerMethodField()

#     class Meta:
#         model = Refuel
#         fields = ('id', 'vehicle', 'total_benzine_liters', 'total_benzine_price',
#                   'total_nafta_liters', 'total_nafta_price')

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         try:
#             representation['vehicle'] = VehicleLimitedSerializer(instance.vehicle).data
#         except Vehicle.DoesNotExist:
#             representation['vehicle'] = None
#         return representation

#     def get_total_benzine_liters(self, obj):
#         total_liters = Refuel.objects.filter(vehicle=obj.vehicle).aggregate(Sum('actual_benzine_liters'))['actual_benzine_liters__sum']
#         return total_liters if total_liters is not None else 0

#     def get_total_benzine_price(self, obj):
#         total_price = Refuel.objects.filter(vehicle=obj.vehicle).aggregate(Sum('actual_benzine_price'))['actual_benzine_price__sum']
#         return total_price if total_price is not None else 0

#     def get_total_nafta_liters(self, obj):
#         total_liters = Refuel.objects.filter(vehicle=obj.vehicle).aggregate(Sum('actual_nafta_liters'))['actual_nafta_liters__sum']
#         return total_liters if total_liters is not None else 0

#     def get_total_nafta_price(self, obj):
#         total_price = Refuel.objects.filter(vehicle=obj.vehicle).aggregate(Sum('actual_nafta_price'))['actual_nafta_price__sum']
#         return total_price if total_price is not None else 0
    
class DepartmentSerializer(serializers.ModelSerializer):
    ''' Department serializer '''
    class Meta:
        ''' Department serializer meta'''
        model = Department
        fields = '__all__'

class VehicleMakeSerializer(serializers.ModelSerializer):
    ''' Vehicle make serializer '''
    class Meta:
        ''' Vehicle make serializer meta'''
        model = VehicleMake
        fields = '__all__'

# class DispatchReportSerializer(serializers.ModelSerializer):
#     ''' Dispatch report serializer '''

#     class Meta:
#         ''' Dispatch report serializer meta'''
#         model = DispatchReport
#         fields = '__all__'

class OilSerializer(serializers.ModelSerializer):
    ''' Oil serializer '''
    class Meta:
        ''' Oil meta '''
        model= Oil
        fields = '__all__'

class MaintenanceSerializer(serializers.ModelSerializer):
    ''' Oil serializer '''
    class Meta:
        ''' Oil meta '''
        model= Maintenance
        fields = '__all__'