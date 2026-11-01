from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db import transaction
from cart.views import get_or_create_cart
from .models import Order, OrderItem

@login_required(login_url='accounts:signin')
def place_order_view(request):
    """
    Creates order in MySQL from cart items, calculates backend total,
    clears cart, and returns order confirmation data for the Bootstrap modal popup.
    """
    if request.method != 'POST':
        return redirect('cart:cart_detail')

    cart = get_or_create_cart(request)
    cart_items = cart.items.select_related('product').all()

    # 1. Validate that the cart is not empty
    if not cart_items.exists():
        messages.error(request, "Your cart is empty. Please add items before placing an order.")
        return redirect('cart:cart_detail')

    try:
        with transaction.atomic():
            # 2. Calculate final order total on the backend
            backend_total = sum(item.subtotal for item in cart_items)

            # 3. Create an order record in MySQL
            order = Order.objects.create(
                user=request.user,
                total_amount=backend_total,
                status='Confirmed'
            )

            # 4. Save the purchased products and quantities in order items
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    brand_name=item.product.brand,
                    price=item.product.price,
                    quantity=item.quantity
                )

            # 5. Clear the shopping cart after successful order creation
            cart.items.all().delete()

        # If AJAX request, return JSON for immediate Bootstrap modal popup
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'status': 'success',
                'order_id': order.order_id,
                'total_amount': f"₹{order.total_amount:,.2f}",
                'total_raw': float(order.total_amount),
                'message': "Thank you for shopping with TimeZone Watches."
            })

        # Standard POST redirect to success page with modal
        request.session['last_order_id'] = order.order_id
        return redirect('orders:order_success', order_id=order.order_id)

    except Exception as e:
        messages.error(request, f"Failed to place order: {str(e)}")
        return redirect('cart:cart_detail')

def order_success_view(request, order_id):
    """
    Order success confirmation view rendering the order details and trigger for Bootstrap modal.
    """
    order = get_object_or_404(Order, order_id=order_id)
    return render(request, 'orders/order_success.html', {
        'order': order,
        'show_modal': True
    })

@login_required(login_url='accounts:signin')
def my_orders_view(request):
    """
    Lists past orders placed by the current user.
    """
    orders = Order.objects.filter(user=request.user).prefetch_related('items')
    return render(request, 'orders/my_orders.html', {'orders': orders})
