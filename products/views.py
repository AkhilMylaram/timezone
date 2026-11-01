from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from .models import Product

def home_view(request):
    """
    Homepage and Watch Catalog view.
    Supports search by watch name/brand and filtering by brand or category.
    """
    search_query = request.GET.get('search', '').strip()
    brand_filter = request.GET.get('brand', '').strip()
    category_filter = request.GET.get('category', '').strip()

    products = Product.objects.all()

    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(brand__icontains=search_query) |
            Q(description__icontains=search_query)
        )

    if brand_filter and brand_filter != 'All':
        products = products.filter(brand=brand_filter)

    if category_filter and category_filter != 'All':
        products = products.filter(category=category_filter)

    brands = [b[0] for b in Product.BRAND_CHOICES]
    categories = [c[0] for c in Product.CATEGORY_CHOICES]

    context = {
        'products': products,
        'search_query': search_query,
        'selected_brand': brand_filter or 'All',
        'selected_category': category_filter or 'All',
        'brands': brands,
        'categories': categories,
        'total_count': products.count(),
    }
    return render(request, 'products/home.html', context)

def product_detail_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    related_products = Product.objects.filter(brand=product.brand).exclude(id=product.id)[:4]
    return render(request, 'products/detail.html', {
        'product': product,
        'related_products': related_products,
    })
