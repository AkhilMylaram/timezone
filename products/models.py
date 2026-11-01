from django.db import models

class Product(models.Model):
    """
    MySQL Product Table for TimeZone Watches.
    Stores watch brand, model name, category, price in INR, image, and inventory details.
    """
    CATEGORY_CHOICES = [
        ('Analog', 'Analog'),
        ('Digital', 'Digital'),
        ('Sports', 'Sports'),
        ('Luxury', 'Luxury'),
        ('Smartwatch', 'Smartwatch'),
    ]

    BRAND_CHOICES = [
        ('Casio', 'Casio'),
        ('Titan', 'Titan'),
        ('Fastrack', 'Fastrack'),
        ('Timex', 'Timex'),
        ('Fossil', 'Fossil'),
        ('Seiko', 'Seiko'),
    ]

    name = models.CharField(max_length=200, verbose_name="Watch Name")
    brand = models.CharField(max_length=50, choices=BRAND_CHOICES, verbose_name="Brand Name")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='Analog')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Price in INR (₹)")
    description = models.TextField(blank=True, verbose_name="Product Description")
    image_url = models.CharField(max_length=500, verbose_name="Product Image URL")
    stock = models.PositiveIntegerField(default=30, verbose_name="Stock Quantity")
    is_featured = models.BooleanField(default=True, verbose_name="Featured Product")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'timezone_products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand} {self.name} - ₹{self.price}"

    @property
    def formatted_price(self):
        return f"₹{self.price:,.2f}"
