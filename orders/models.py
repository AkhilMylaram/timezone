import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from products.models import Product

class Order(models.Model):
    """
    MySQL Order Table for TimeZone Watches.
    Stores customer completed orders, generated order ID, status, and calculated total amount.
    """
    STATUS_CHOICES = [
        ('Confirmed', 'Confirmed'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
    ]

    order_id = models.CharField(max_length=50, unique=True, editable=False, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Total Amount (₹)")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'timezone_orders'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_id:
            # Generate professional luxury order ID, e.g., TZW-20261101-8A3F2C
            timestamp_str = timezone.now().strftime('%Y%m%d')
            unique_token = uuid.uuid4().hex[:6].upper()
            self.order_id = f"TZW-{timestamp_str}-{unique_token}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.order_id} - ₹{self.total_amount}"

    @property
    def formatted_total(self):
        return f"₹{self.total_amount:,.2f}"

class OrderItem(models.Model):
    """
    MySQL OrderItem Table for TimeZone Watches.
    Snapshots purchased watch details, unit price at time of order, and quantity.
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    product_name = models.CharField(max_length=200)
    brand_name = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Unit Price (₹)")
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'timezone_order_items'
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f"{self.quantity} x {self.product_name} in {self.order.order_id}"

    @property
    def subtotal(self):
        return self.price * self.quantity

    @property
    def formatted_subtotal(self):
        return f"₹{self.subtotal:,.2f}"
