from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('watches/', views.home_view, name='catalog'),
    path('watch/<int:product_id>/', views.product_detail_view, name='detail'),
]
