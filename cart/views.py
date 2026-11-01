from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from products.models import Product
from .models import Cart, CartItem

def get_or_create_cart(request):
    """
    Retrieves or creates a Cart for the current logged-in user or active session.
    """
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        cart, _ = Cart.objects.get_or_create(session_key=request.session.session_key)
    return cart

def cart_detail_view(request):
    """
    Displays cart contents, unit prices, quantity steppers, subtotals, and grand total.
    """
    cart = get_or_create_cart(request)
    cart_items = cart.items.select_related('product').all()

    context = {
        'cart': cart,
        'cart_items': cart_items,
        'total_amount': cart.total_amount,
        'total_items': cart.total_items,
    }
    return render(request, 'cart/cart.html', context)

def add_to_cart_view(request, product_id):
    """
    Adds a watch to the cart or increments quantity if already present.
    Displays success notification: 'Product added to cart.'
    """
    product = get_object_or_404(Product, id=product_id)
    cart = get_or_create_cart(request)

    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()

    success_msg = f"'{product.name}' added to your cart!"
    messages.success(request, success_msg)

    # If AJAX request
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('ajax') == '1':
        return JsonResponse({
            'status': 'success',
            'message': success_msg,
            'cart_item_count': cart.total_items,
            'item_quantity': cart_item.quantity,
        })

    next_url = request.POST.get('next') or request.GET.get('next') or request.META.get('HTTP_REFERER') or 'products:home'
    return redirect(next_url)

def update_cart_quantity_view(request, item_id):
    """
    Increases or decreases quantity of a cart item.
    """
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    action = request.POST.get('action') or request.GET.get('action')

    if action == 'increase':
        cart_item.quantity += 1
        cart_item.save()
        messages.success(request, f"Updated quantity for {cart_item.product.name}.")
    elif action == 'decrease':
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
            messages.success(request, f"Updated quantity for {cart_item.product.name}.")
        else:
            cart_item.delete()
            messages.info(request, f"Removed {cart_item.product.name} from cart.")

    return redirect('cart:cart_detail')

def remove_from_cart_view(request, item_id):
    """
    Removes a product entirely from the user's cart.
    """
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    product_name = cart_item.product.name
    cart_item.delete()
    messages.info(request, f"Removed '{product_name}' from your cart.")
    return redirect('cart:cart_detail')
