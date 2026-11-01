from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('place-order/', views.place_order_view, name='place_order'),
    path('success/<str:order_id>/', views.order_success_view, name='order_success'),
    path('history/', views.my_orders_view, name='my_orders'),
]
