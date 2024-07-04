from django.contrib.auth.models import Group
from dispatch_request.models import User
from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import VehicleRequest, Driver, Approval, Vehicle, Dispatch, Refuel, Department, VehicleMake
from .serializers import VehicleRequestSerializer, DriverSerializer, ApprovalSerializer, VehicleSerializer, DispatchSerializer, GroupSerializer, UserSerializer, RefuelSerializer, DepartmentSerializer, VehicleMakeSerializer

from rest_framework import viewsets
from .models import User, Group
from rest_framework.decorators import action

# class UserLoginAPIView(APIView):
#     # authentication_classes = [JWTAuthentication]
#     permission_classes = (IsAuthenticated,)

#     def post(self, request):
#         username = request.data.get('user_id')
#         password = request.data.get('password')
#         print(username)
#         print(password)
#         user = authenticate(username=username, password=password)

#         if user is None:
#             return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

#         refresh = RefreshToken.for_user(user)

#         serializer = UserSerializer(user)

#         return Response({
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#             'user': serializer.data
#         })
    


# class GroupViewSet(viewsets.ModelViewSet):
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
class UserLoginAPIView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data
        })

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class DriverViewSet(viewsets.ModelViewSet):
    ''' Driver api end point view set '''
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class DispatchViewSet(viewsets.ModelViewSet):
    ''' Dispatch api end point view set '''
    queryset = Dispatch.objects.all()
    serializer_class = DispatchSerializer
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        # Order by created_at in descending order to get the most recent first
        return Dispatch.objects.all().order_by('-created_at')
    
class VehicleViewSet(viewsets.ModelViewSet):
    ''' Vehicle api end point view set '''
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class ApprovalViewSet(viewsets.ModelViewSet):
    ''' Approval api end point view set'''
    queryset = Approval.objects.all()
    serializer_class = ApprovalSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'options']

class VehicleRequestViewSet(viewsets.ModelViewSet):
    ''' vehicle request api view set '''
    queryset = VehicleRequest.objects.select_related('user')
    serializer_class = VehicleRequestSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'options']

    


class VehicleApprovedRequestViewSet(viewsets.ModelViewSet):
    ''' vehicle request api view set '''
    serializer_class = VehicleRequestSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        ''' Returns queryset filtered to include only requests with status 'APPROVED' '''        
        return VehicleRequest.objects.filter(status='APPROVED').select_related('user').order_by('-created_at')

class VehiclePendingRequestViewSet(viewsets.ModelViewSet):
    ''' vehicle request api view set '''
    serializer_class = VehicleRequestSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ''' Returns queryset filtered to include only requests with status 'PENDING' '''
        return VehicleRequest.objects.filter(status='PENDING').select_related('user')

class VehicleRequestByDispatch(viewsets.ModelViewSet):
    ''' Vehicle request by dispatch view set '''
    serializer_class = VehicleRequestSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ''' Returns queryset filtered to include only requests associated with a specific dispatch '''
        # Extract dispatch ID from query parameters
        dispatch_id = self.request.query_params.get('dispatch_id')
        
        # Check if dispatch ID is provided in the query parameters
        if dispatch_id:
            # If dispatch ID is provided, filter requests by it
            return VehicleRequest.objects.filter(dispatch_id=dispatch_id).select_related('user')
        else:
            # If dispatch ID is not provided, return an empty queryset
            return VehicleRequest.objects.none()

class RefuelViewSet(viewsets.ModelViewSet):
    ''' refuel api view set '''
    queryset = Refuel.objects.select_related('vehicle')
    serializer_class = RefuelSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='vehicle/(?P<vehicle_id>[^/.]+)')
    def by_vehicle(self, request, vehicle_id=None):
        queryset = self.get_queryset().filter(vehicle_id=vehicle_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class DepartmentViewSet(viewsets.ModelViewSet):
    ''' department api view set '''
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class VehicleMakeViewSet(viewsets.ModelViewSet):
    ''' department api view set '''
    queryset = VehicleMake.objects.all()
    serializer_class = VehicleMakeSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

# class DispatchReportViewSet(viewsets.ModelViewSet):
#     ''' dispatch report api view set '''
#     queryset = DispatchReport.objects.all()
#     serializer_class = DispatchReportSerializer

    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

class VehicleRequestDispatchUpdateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def put(self, request, pk, format=None):
        try:
            instance = VehicleRequest.objects.get(pk=pk)
        except VehicleRequest.DoesNotExist:
            return Response({"error": "Vehicle Request does not exist"}, status=status.HTTP_404_NOT_FOUND)

        dispatch_id = request.data.get('dispatch')
        if dispatch_id is not None:
            # Check if the dispatch object with the provided ID exists
            try:
                dispatch = Dispatch.objects.get(pk=dispatch_id)
            except Dispatch.DoesNotExist:
                return Response({"error": "Dispatch does not exist"}, status=status.HTTP_400_BAD_REQUEST)

            instance.dispatch = dispatch
            instance.save()

            serializer = VehicleRequestSerializer(instance)
            return Response(serializer.data)
        else:
            return Response({"error": "Dispatch ID is required"}, status=status.HTTP_400_BAD_REQUEST)