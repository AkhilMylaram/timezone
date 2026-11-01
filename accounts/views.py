from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib import messages
from .forms import SignUpForm, SignInForm
from cart.models import Cart, CartItem

def signup_view(request):
    if request.user.is_authenticated:
        return redirect('products:home')

    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            messages.success(request, f"Welcome {user.full_name}! Your account has been created. Please sign in.")
            return redirect('accounts:signin')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()

    return render(request, 'accounts/signup.html', {'form': form})

def signin_view(request):
    if request.user.is_authenticated:
        return redirect('products:home')

    if request.method == 'POST':
        form = SignInForm(request.POST)
        if form.is_valid():
            user = form.user
            # Remember guest session cart key to merge into user account
            session_key = request.session.session_key
            login(request, user)

            # Cart migration: If user had an anonymous cart before signing in, associate with user
            if session_key:
                try:
                    anon_cart = Cart.objects.filter(session_key=session_key, user__isnull=True).first()
                    if anon_cart:
                        user_cart, _ = Cart.objects.get_or_create(user=user)
                        for item in anon_cart.items.all():
                            existing_item = user_cart.items.filter(product=item.product).first()
                            if existing_item:
                                existing_item.quantity += item.quantity
                                existing_item.save()
                            else:
                                item.cart = user_cart
                                item.save()
                        anon_cart.delete()
                except Exception:
                    pass

            messages.success(request, f"Welcome back, {user.full_name}!")
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            return redirect('products:home')
        else:
            messages.error(request, "Invalid email or password.")
    else:
        form = SignInForm()

    return render(request, 'accounts/signin.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out safely.")
    return redirect('products:home')
