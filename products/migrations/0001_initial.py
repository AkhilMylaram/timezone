from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Watch Name')),
                ('brand', models.CharField(choices=[('Casio', 'Casio'), ('Titan', 'Titan'), ('Fastrack', 'Fastrack'), ('Timex', 'Timex'), ('Fossil', 'Fossil'), ('Seiko', 'Seiko')], max_length=50, verbose_name='Brand Name')),
                ('category', models.CharField(choices=[('Analog', 'Analog'), ('Digital', 'Digital'), ('Sports', 'Sports'), ('Luxury', 'Luxury'), ('Smartwatch', 'Smartwatch')], default='Analog', max_length=30)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Price in INR (₹)')),
                ('description', models.TextField(blank=True, verbose_name='Product Description')),
                ('image_url', models.CharField(max_length=500, verbose_name='Product Image URL')),
                ('stock', models.PositiveIntegerField(default=30, verbose_name='Stock Quantity')),
                ('is_featured', models.BooleanField(default=True, verbose_name='Featured Product')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
                'db_table': 'timezone_products',
                'ordering': ['-created_at'],
            },
        ),
    ]
