/**
 * TimeZone Watches - Core JavaScript
 * Handles cart interactions, AJAX addition, notifications, and Order Confirmation modal
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. AJAX Add to Cart
    const addToCartForms = document.querySelectorAll('.ajax-add-to-cart');
    addToCartForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Adding...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': form.querySelector('[name=csrfmiddlewaretoken]')?.value || getCsrfToken()
                    },
                    body: new FormData(form)
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Update Cart badge in navbar
                    const navBadge = document.getElementById('nav-cart-badge');
                    if (navBadge && data.cart_item_count !== undefined) {
                        navBadge.textContent = data.cart_item_count;
                        navBadge.classList.add('animate-bounce');
                        setTimeout(() => navBadge.classList.remove('animate-bounce'), 800);
                    }

                    // Show success toast notification
                    showFloatingToast(data.message || 'Product added to cart!');
                } else {
                    // Fallback to normal submission if AJAX fails
                    form.submit();
                }
            } catch (err) {
                console.error('Error adding to cart:', err);
                form.submit();
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    });

    // 2. AJAX Place Order to trigger Bootstrap Modal seamlessly
    const placeOrderForm = document.getElementById('placeOrderForm');
    if (placeOrderForm) {
        placeOrderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const orderBtn = document.getElementById('placeOrderBtn');
            const originalText = orderBtn.innerHTML;

            orderBtn.disabled = true;
            orderBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing Order in MySQL...';

            try {
                const response = await fetch(placeOrderForm.action, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': placeOrderForm.querySelector('[name=csrfmiddlewaretoken]')?.value || getCsrfToken()
                    },
                    body: new FormData(placeOrderForm)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success') {
                        // Populate modal with order ID and total amount
                        document.getElementById('modalOrderId').textContent = data.order_id;
                        document.getElementById('modalTotalAmount').textContent = data.total_amount;

                        // Clear nav cart count
                        const navBadge = document.getElementById('nav-cart-badge');
                        if (navBadge) navBadge.textContent = '0';

                        // Show Bootstrap modal
                        const modalElem = document.getElementById('orderConfirmationModal');
                        const modal = new bootstrap.Modal(modalElem);
                        modal.show();
                    } else {
                        alert(data.message || 'Could not complete order.');
                    }
                } else {
                    placeOrderForm.submit();
                }
            } catch (error) {
                console.error('Order placement error:', error);
                placeOrderForm.submit();
            } finally {
                orderBtn.disabled = false;
                orderBtn.innerHTML = originalText;
            }
        });
    }

    // Helper: CSRF Cookie reader
    function getCsrfToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === ('csrftoken=')) {
                    cookieValue = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }
        return cookieValue || '';
    }

    // Helper: Floating notification toast
    function showFloatingToast(message) {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const toastEl = document.createElement('div');
        toastEl.className = 'toast show align-items-center text-bg-dark border border-gold shadow-lg mb-2';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="bi bi-check-circle-fill text-gold fs-5"></i>
                    <span class="text-white">${message}</span>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        toastContainer.appendChild(toastEl);

        setTimeout(() => {
            toastEl.classList.remove('show');
            setTimeout(() => toastEl.remove(), 400);
        }, 3500);
    }
});
