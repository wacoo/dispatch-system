from rest_framework import routers
from .views import (
    VehicleRequestViewSet, VehiclePendingRequestViewSet, DriverViewSet,
    ApprovalViewSet, VehicleViewSet, DispatchViewSet, UserViewSet,
    GroupViewSet, UserLoginAPIView, RefuelViewSet, DepartmentViewSet,
    VehicleRequestDispatchUpdateAPIView, VehicleApprovedRequestViewSet,
    VehicleRequestByDispatch, VehicleMakeViewSet, DispatchersViewSet, ApproversViewSet, PricePerLiterViewSet
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path

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
router.register(r'make', VehicleMakeViewSet)
router.register(r'approvers', ApproversViewSet, basename='approvers')
router.register(r'dispatchers', DispatchersViewSet, basename='dispatchers')
router.register(r'price_per_liter', PricePerLiterViewSet, basename='price_per_liter')
# router.register(r'dispatch_reports', DispatchReportViewSet)

# Define URL patterns
urlpatterns = [
    path('token/', UserLoginAPIView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Append router URLs to urlpatterns
urlpatterns += router.urls