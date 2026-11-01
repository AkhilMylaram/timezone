from .views import get_or_create_cart

def cart_item_count(request):
    """
    Context processor to inject total count of items in the current user's cart
    into every Django template context for the navbar badge.
    """
    try:
        cart = get_or_create_cart(request)
        return {'cart_item_count': cart.total_items}
    except Exception:
        return {'cart_item_count': 0}
