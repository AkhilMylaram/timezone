# TimeZone Watches ⌚
> **Premium Watch Shopping E-Commerce Web Application**  
> Built with **Python Django**, **MySQL 8.0**, **Bootstrap 5**, and a luxury black, white, and gold visual design.

---

## 🌟 Application Overview

**TimeZone Watches** is a complete, fully functional online watch shopping platform built using pure Python Django and MySQL 8.0. It features timepieces from prestigious brands including **Casio**, **Titan**, **Fastrack**, **Timex**, **Fossil**, and **Seiko** across categories such as **Analog**, **Digital**, **Sports**, **Luxury**, and **Smartwatch**.

### Key Features
1. **User Authentication & Accounts**:
   - Customer registration with Full Name, Email, Phone Number, Password, and Confirm Password.
   - Duplicate email prevention and secure password hashing.
   - User credentials validation via Django authentication.
   - Safe session management and logout.

2. **Luxury Watch Catalog**:
   - Modern black, white, and gold color scheme.
   - Real-time search by watch name, brand, or description.
   - Category and brand filter pills with active state indicators.
   - Responsive product cards with watch photo, brand, name, price in Indian Rupees (₹), and Add to Cart action.
   - 14 pre-seeded sample luxury watches with realistic pricing.

3. **Dynamic Shopping Cart**:
   - Live cart badge count in the navigation bar across all pages.
   - Instant "Product added to cart" toast notifications.
   - Quantity adjustment steppers (`+` and `-`) with dynamic subtotal recalculation.
   - Item removal and empty-cart empty state.

4. **Order Placement & Confirmation Popup**:
   - Backend cart validation and server-side order total calculation.
   - Atomic MySQL transaction creating `Order` and `OrderItem` records.
   - Shopping cart cleared automatically upon order placement.
   - **Bootstrap Modal Popup**:
     - Green success checkmark icon.
     - Heading: *Order Placed Successfully!*
     - Message: *Thank you for shopping with TimeZone Watches.*
     - Unique Order Reference ID (`TZW-YYYYMMDD-XXXXXX`).
     - Total Order Amount in Indian Rupees (₹).
     - *Continue Shopping* button redirecting back to the catalog.

---

## 🏗️ Project Architecture

```
timezone_watches/
├── Dockerfile                  # Container build recipe with Python 3.10 and MySQL headers
├── docker-compose.yml          # Multi-container orchestration for MySQL 8.0 & Django
├── entrypoint.sh               # Container entrypoint: waits for MySQL, migrates & seeds
├── requirements.txt            # Python dependencies (Django, mysqlclient, PyMySQL, etc.)
├── .env.example                # Database and environment variable templates
├── manage.py                   # Django management utility
├── seed_data.py                # Standalone database seeding script
│
├── timezone_watches/           # Project core configuration
│   ├── __init__.py             # PyMySQL / mysqlclient compatibility wrapper
│   ├── settings.py             # Settings, database configuration, auth model
│   ├── urls.py                 # Master URL routing
│   ├── wsgi.py                 # WSGI entrypoint
│   └── asgi.py                 # ASGI entrypoint
│
├── accounts/                   # Customer authentication & profile app
│   ├── models.py               # Custom User model (timezone_users)
│   ├── views.py                # signup, signin, logout views
│   ├── forms.py                # SignUpForm, SignInForm with validations
│   └── urls.py                 # /accounts/signup/, /accounts/signin/, etc.
│
├── products/                   # Watch catalog & inventory app
│   ├── models.py               # Product model (timezone_products)
│   ├── views.py                # home_view, catalog search, product detail
│   ├── urls.py                 # /, /watches/, /watch/<id>/
│   └── management/commands/    # python manage.py seed_watches
│
├── cart/                       # Shopping cart & session management app
│   ├── models.py               # Cart & CartItem models
│   ├── views.py                # add_to_cart, update_quantity, remove_item
│   ├── context_processors.py   # cart_item_count for global navbar badge
│   └── urls.py                 # /cart/, /cart/add/<id>/, etc.
│
├── orders/                     # Checkout & order processing app
│   ├── models.py               # Order & OrderItem models
│   ├── views.py                # place_order_view, order_success, order history
│   └── urls.py                 # /orders/place-order/, /orders/success/<id>/
│
├── templates/                  # Bootstrap 5 HTML Django Templates
│   ├── base.html               # Master layout, navbar, order modal popup, footer
│   ├── accounts/
│   │   ├── signup.html         # User registration form
│   │   └── signin.html         # User login form
│   ├── products/
│   │   ├── home.html           # Catalog grid, brand filters, search
│   │   └── detail.html         # Product detail view
│   ├── cart/
│   │   └── cart.html           # Itemized cart, quantity steppers, summary
│   └── orders/
│       ├── order_success.html  # Success view with Bootstrap modal trigger
│       └── my_orders.html      # Past customer order history
│
└── static/                     # Static styling & JavaScript
    ├── css/style.css           # Luxury gold & black custom stylesheet
    └── js/main.js              # AJAX add-to-cart, toast & modal triggers
```

---

## 🗄️ MySQL 8.0 Database Tables

The application utilizes Django ORM models mapping to the following MySQL tables:

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| `timezone_users` | Customer accounts | `id`, `email` (unique), `full_name`, `phone_number`, `password` (hashed), `date_joined` |
| `timezone_products` | Watches catalog | `id`, `name`, `brand`, `category`, `price`, `description`, `image_url`, `stock` |
| `timezone_cart` | Shopping carts | `id`, `user_id` (FK), `session_key`, `created_at`, `updated_at` |
| `timezone_cart_items` | Products in cart | `id`, `cart_id` (FK), `product_id` (FK), `quantity`, `added_at` |
| `timezone_orders` | Customer orders | `id`, `order_id` (unique), `user_id` (FK), `total_amount`, `status`, `created_at` |
| `timezone_order_items` | Order line items | `id`, `order_id` (FK), `product_id` (FK), `product_name`, `price`, `quantity` |

---

## 🚀 Execution Instructions

### Option 1: 1-Click Launch with Docker (Recommended)

To run the complete application with MySQL 8.0 and Django in Docker:

```bash
docker compose down
docker compose up -d --build
```

#### What happens automatically:
1. Docker pulls and boots **MySQL 8.0** with healthchecks (`mysqladmin ping`).
2. Builds the Django web container with Python 3.10 and database drivers.
3. `/entrypoint.sh` is safely isolated from host mounts and normalized with Linux line endings.
4. Automatically applies database migrations: `python manage.py migrate`.
5. Automatically seeds the 14 sample watches: `python manage.py seed_watches`.
6. Starts the Django development server on port **8000**.

Open your browser and navigate to:
```
http://localhost:8000
```

To stop the containers:
```bash
docker compose down
```

---

### Option 2: Running Locally with Python & MySQL

#### 1. Setup MySQL Database
Ensure MySQL Server 8.0 is running on your machine:
```sql
CREATE DATABASE timezone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'timezone_user'@'localhost' IDENTIFIED BY 'timezone_pass';
GRANT ALL PRIVILEGES ON timezone_db.* TO 'timezone_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Create Python Virtual Environment & Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt
```

#### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DB_HOST=127.0.0.1` and database credentials match your MySQL setup.

#### 4. Run Migrations & Seed Sample Watches
```bash
# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Seed 14 luxury sample watches (Casio, Titan, Seiko, Fossil, Timex, Fastrack)
python manage.py seed_watches
# (or alternatively run: python seed_data.py)
```

#### 5. Start the Django Server
```bash
python manage.py runserver 0.0.0.0:8000
```

Open your browser at `http://localhost:8000`.

---

## 🛍️ Expected User Shopping Flow

1. **Sign Up**: Navigate to `/accounts/signup/`, register with Full Name, Email, Phone, and Password.
2. **Sign In**: Log in with your email and password.
3. **Homepage**: Browse watches, search by name, or filter by brand (e.g. *Seiko*, *Casio*, *Titan*) and category (*Luxury*, *Sports*, etc.).
4. **Add to Cart**: Click **Add to Cart** on any watch. Receive instant toast confirmation, and watch the navbar badge increment.
5. **Shopping Cart**: Go to `/cart/`. Adjust quantities with the `+` / `-` steppers, view subtotal and grand total.
6. **Place Order**: Click **Place Order**. Order records and order line items are created in MySQL.
7. **Confirmation Popup**: A modal popup appears with a green success icon, your unique Order ID, total amount in ₹, and a **Continue Shopping** button redirecting back to the homepage.
