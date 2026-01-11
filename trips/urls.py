from django.urls import path
from .views import TripAPIView

urlpatterns = [
    path('trip/', TripAPIView.as_view()),
]