from rest_framework import routers
from .views import VehicleRequestViewSet, VehiclePendingRequestViewSet, DriverViewSet, ApprovalViewSet, VehicleViewSet, DispatchViewSet, UserViewSet, GroupViewSet, UserLoginAPIView, RefuelViewSet, DepartmentViewSet, VehicleRequestDispatchUpdateAPIView, VehicleApprovedRequestViewSet, VehicleRequestByDispatch
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'requests', VehicleRequestViewSet)
router.register(r'pending_requests', VehiclePendingRequestViewSet, basename='pending_requests')
router.register(r'approved_requests', VehicleApprovedRequestViewSet, basename='approved_requests')
router.register(r'drivers', DriverViewSet)
router.register(r'approvals', ApprovalViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'dispatches', DispatchViewSet)
router.register(r'refuels', RefuelViewSet)
# router.register(r'dispatch_reports', DispatchReportViewSet)

# Define URL patterns
urlpatterns = [
    # path('api/token/', obtain_auth_token, name='api-token'), 
    # path('api/login/', UserLoginAPIView.as_view(), name='api-login'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Append router URLs to urlpatterns
urlpatterns += router.urls
