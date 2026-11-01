/**
 * TimeZone Watches - Luxury Horology Store
 * Interactive live preview reproducing the Django + Bootstrap 5 + MySQL store
 */
import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Terminal, 
  Database, 
  Sparkles, 
  X,
  Truck,
  RotateCcw,
  Check
} from 'lucide-react';

interface WatchProduct {
  id: number;
  name: string;
  brand: 'Casio' | 'Titan' | 'Fastrack' | 'Timex' | 'Fossil' | 'Seiko';
  category: 'Analog' | 'Digital' | 'Sports' | 'Luxury' | 'Smartwatch';
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
}

interface CartItem {
  product: WatchProduct;
  quantity: number;
}

interface UserAccount {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface RegisteredUser {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
}

interface PlacedOrder {
  orderId: string;
  totalAmount: number;
  items: CartItem[];
  date: string;
  customerName: string;
}

const INITIAL_DB_USERS: RegisteredUser[] = [
  {
    id: 1,
    fullName: "Arjun Sharma",
    email: "arjun.sharma@example.com",
    phoneNumber: "+91 98765 43210",
    passwordHash: "password123"
  },
  {
    id: 2,
    fullName: "Priya Patel",
    email: "priya.patel@example.com",
    phoneNumber: "+91 98111 22334",
    passwordHash: "luxury2026"
  },
  {
    id: 3,
    fullName: "TimeZone Admin",
    email: "admin@timezonewatches.in",
    phoneNumber: "+91 80000 12345",
    passwordHash: "admin123"
  }
];

const SAMPLE_PRODUCTS: WatchProduct[] = [
  {
    id: 1,
    name: "Presage Cocktail Time Automatic",
    brand: "Seiko",
    category: "Luxury",
    price: 38500,
    imageUrl: "/src/assets/images/watch_seiko_presage_1793529331550.jpg",
    description: "Exquisite Japanese automatic 23-jewel movement with sunburst guilloche dial, blued sweep second hand, and fine genuine leather band.",
    stock: 15
  },
  {
    id: 2,
    name: "Neutra Chronograph Smoke Dial",
    brand: "Fossil",
    category: "Analog",
    price: 12495,
    imageUrl: "/src/assets/images/watch_fossil_chronograph_1793529330811.jpg",
    description: "Mid-century minimalist architecture meets modern horology. Smoked sunray dial with Roman numerals and stop-watch sub-dials.",
    stock: 25
  },
  {
    id: 3,
    name: "Edifice Solar Octagon Chronograph",
    brand: "Casio",
    category: "Sports",
    price: 14995,
    imageUrl: "/src/assets/images/watch_casio_edifice_1793529332405.jpg",
    description: "High-octane automotive racing chronograph powered by solar energy. Octagonal carbon-fiber bezel and sapphire crystal.",
    stock: 20
  },
  {
    id: 4,
    name: "Edge Ceramic Midnight Black",
    brand: "Titan",
    category: "Luxury",
    price: 24995,
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    description: "One of the slimmest ceramic watches in the world at just 4.4mm thin. Hypoallergenic high-tech ceramic case with sapphire glass.",
    stock: 18
  },
  {
    id: 5,
    name: "G-Shock GA-2100 Octagonal Carbon Core",
    brand: "Casio",
    category: "Sports",
    price: 8995,
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    description: "The legendary 'CasiOak'. Ultra-rugged carbon core guard structure, 200M water resistance, dual digital-analog display.",
    stock: 35
  },
  {
    id: 6,
    name: "Grandmaster Mechanical Skeleton",
    brand: "Titan",
    category: "Luxury",
    price: 19995,
    imageUrl: "https://images.unsplash.com/photo-1547996160-71dfa6358268?auto=format&fit=crop&w=800&q=80",
    description: "Intricate open-heart skeleton dial revealing the rhythmic heartbeat of precision automatic movement. Rose gold plated case.",
    stock: 12
  },
  {
    id: 7,
    name: "Reflex Play AMOLED Smartwatch",
    brand: "Fastrack",
    category: "Smartwatch",
    price: 4995,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    description: "1.3-inch Ultra AMOLED display with Bluetooth calling, built-in games, 100+ sports modes, SpO2 monitor, and 7-day battery life.",
    stock: 50
  },
  {
    id: 8,
    name: "Marlin Mechanical Hand-Wind Vintage",
    brand: "Timex",
    category: "Analog",
    price: 16495,
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    description: "A true 1960s reissue featuring a hand-wound mechanical movement, domed acrylic crystal, champagne dial, and embossed leather.",
    stock: 14
  },
  {
    id: 9,
    name: "Gen 6 Touchscreen Smartwatch",
    brand: "Fossil",
    category: "Smartwatch",
    price: 22995,
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    description: "Powered with Wear OS by Google. Qualcomm Snapdragon Wear 4100+ platform, fast charging, heart rate zone tracking.",
    stock: 22
  },
  {
    id: 10,
    name: "Seiko 5 Sports Automatic Diver Navy",
    brand: "Seiko",
    category: "Sports",
    price: 26500,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    description: "Iconic diver aesthetics with unidirectional rotating bezel, Lumibrite hour markers, day/date complication, and 4R36 caliber.",
    stock: 16
  },
  {
    id: 11,
    name: "Expedition Shock Digital Digital Trail",
    brand: "Timex",
    category: "Digital",
    price: 5495,
    imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80",
    description: "Built for rugged wilderness adventures. Heavy-duty shock resistance, INDIGLO night-light, 100-hour chronograph.",
    stock: 40
  },
  {
    id: 12,
    name: "Vintage Gold Digital Illuminator",
    brand: "Casio",
    category: "Digital",
    price: 4295,
    imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=80",
    description: "Timeless retro 1980s aesthetic with polished gold-tone stainless steel bracelet, daily alarm, hourly time signal, and auto-calendar.",
    stock: 45
  },
  {
    id: 13,
    name: "Vyb Trendsetter Monochrome Analog",
    brand: "Fastrack",
    category: "Analog",
    price: 2895,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Youthful contemporary minimalist timepiece with matte black dial, high-contrast neon second hand, and flexible silicone strap.",
    stock: 60
  },
  {
    id: 14,
    name: "Regalia Imperial Diamond Accent",
    brand: "Titan",
    category: "Luxury",
    price: 32500,
    imageUrl: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80",
    description: "Prestigious royal luxury watch adorned with genuine certified diamond hour markers on a gold-plated multi-link Jubilee bracelet.",
    stock: 10
  }
];

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'home' | 'cart' | 'signin' | 'signup' | 'dockerGuide'>('home');
  
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: SAMPLE_PRODUCTS[0], quantity: 1 } // seeded with 1 item for initial discovery
  ]);

  // User Accounts Database (simulating MySQL timezone_users table)
  const [usersDb, setUsersDb] = useState<RegisteredUser[]>(() => {
    try {
      const stored = localStorage.getItem('tzw_registered_users_db');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DB_USERS;
  });

  // Auth state (starts as null or previously stored session)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const storedSession = localStorage.getItem('tzw_current_session_user');
      if (storedSession) return JSON.parse(storedSession);
    } catch (e) {}
    return null;
  });

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Order Confirmation Modal State (Requirement 7)
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Auth form states
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Brands & Categories
  const brands = ['All', 'Casio', 'Titan', 'Fastrack', 'Timex', 'Fossil', 'Seiko'];
  const categories = ['All', 'Luxury', 'Analog', 'Sports', 'Digital', 'Smartwatch'];

  // Total cart items count
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Total cart monetary amount
  const cartTotalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [searchQuery, selectedBrand, selectedCategory]);

  // Handlers
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAddToCart = (product: WatchProduct) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    showToast(`'${product.name}' added to cart!`);
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast("Product removed from cart.");
  };

  // Place Order handler (Requirement 6 & 7)
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add timepieces before placing an order.");
      return;
    }

    if (!currentUser) {
      setCurrentView('signin');
      setAuthError("Please sign in or create an account to place your order.");
      return;
    }

    // Generate unique order ID in format TZW-20261101-XXXX
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const orderId = `TZW-20261101-${randomHex}`;

    const newOrder: PlacedOrder = {
      orderId,
      totalAmount: cartTotalAmount,
      items: [...cartItems],
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      customerName: currentUser.fullName
    };

    setConfirmedOrder(newOrder);
    setCartItems([]); // Clear cart in accordance with Requirement 6
    setIsOrderModalOpen(true); // Open Bootstrap modal popup (Requirement 7)
  };

  // Auth Handlers with strict database validation
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const emailTrimmed = signUpData.email.trim().toLowerCase();
    const nameTrimmed = signUpData.fullName.trim();
    const phoneTrimmed = signUpData.phoneNumber.trim();
    const passwordTrimmed = signUpData.password;
    const confirmPasswordTrimmed = signUpData.confirmPassword;

    if (!nameTrimmed || !emailTrimmed || !phoneTrimmed || !passwordTrimmed) {
      setAuthError("Please fill in all registration fields.");
      return;
    }

    if (passwordTrimmed.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    if (passwordTrimmed !== confirmPasswordTrimmed) {
      setAuthError("Password and Confirm Password do not match.");
      return;
    }

    // Prevent duplicate email registration in database
    const emailExists = usersDb.some(u => u.email.toLowerCase() === emailTrimmed);
    if (emailExists) {
      setAuthError("An account with this email address already exists in the database. Please sign in instead.");
      return;
    }

    // Create and persist new user in database
    const newUser: RegisteredUser = {
      id: Date.now(),
      fullName: nameTrimmed,
      email: emailTrimmed,
      phoneNumber: phoneTrimmed,
      passwordHash: passwordTrimmed
    };

    const updatedDb = [...usersDb, newUser];
    setUsersDb(updatedDb);
    try {
      localStorage.setItem('tzw_registered_users_db', JSON.stringify(updatedDb));
    } catch (err) {}

    showToast("Registration successful! Account stored in MySQL database. Please sign in.");
    setSignInData({ email: emailTrimmed, password: '' });
    setSignUpData({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
    setCurrentView('signin');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const emailTrimmed = signInData.email.trim().toLowerCase();
    const passwordInput = signInData.password.trim();

    if (!emailTrimmed || !passwordInput) {
      setAuthError("Please provide both email address and password.");
      return;
    }

    // Query database for user record by email
    const matchedUser = usersDb.find(u => u.email.toLowerCase() === emailTrimmed);

    if (!matchedUser) {
      setAuthError("Authentication failed: No user found with this email in the database. Please verify or sign up.");
      return;
    }

    // Check credentials: password must match the record in the database
    if (matchedUser.passwordHash !== passwordInput) {
      setAuthError("Authentication failed: Incorrect password for this account. Access denied.");
      return;
    }

    // Valid credentials verified: establish session
    const sessionUser: UserAccount = {
      fullName: matchedUser.fullName,
      email: matchedUser.email,
      phoneNumber: matchedUser.phoneNumber
    };

    setCurrentUser(sessionUser);
    try {
      localStorage.setItem('tzw_current_session_user', JSON.stringify(sessionUser));
    } catch (err) {}

    showToast(`Welcome back, ${matchedUser.fullName}! Signed in successfully.`);
    setSignInData({ email: '', password: '' });
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tzw_current_session_user');
    } catch (err) {}
    showToast("You have been signed out successfully.");
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#10121a]/95 backdrop-blur border-b border-[#d4af37]/25 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-2.5 text-left text-white group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#181a24] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] group-hover:border-[#d4af37] transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif tracking-widest text-lg font-bold text-white block">
                TIME<span className="text-[#d4af37]">ZONE</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-wider uppercase block -mt-1">
                Luxury Watches
              </span>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => setCurrentView('home')} 
              className={`hover:text-[#d4af37] transition-colors cursor-pointer ${currentView === 'home' ? 'text-[#d4af37] font-semibold' : 'text-gray-300'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentView('home'); setSelectedBrand('All'); setSelectedCategory('All'); }} 
              className="text-gray-300 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              All Watches
            </button>
            <button 
              onClick={() => setCurrentView('dockerGuide')} 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer ${currentView === 'dockerGuide' ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-gray-700 text-gray-400 hover:text-white'}`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Django & Docker Guide</span>
            </button>
          </nav>

          {/* Right Action Cluster: Search, Cart, Profile */}
          <div className="flex items-center gap-3">
            
            {/* Search Input in Top Bar */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181a24] text-xs text-white pl-9 pr-3 py-1.5 rounded border border-gray-700 focus:outline-none focus:border-[#d4af37] placeholder-gray-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cart Button with Dynamic Badge Count */}
            <button 
              onClick={() => setCurrentView('cart')}
              className="relative flex items-center gap-2 bg-[#181a24] hover:bg-[#202330] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] px-3 py-1.5 rounded transition-all cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              <span className="bg-[#d4af37] text-black text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
                {cartItemCount}
              </span>
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-gray-800">
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-white font-medium block leading-none">{currentUser.fullName}</span>
                  <span className="text-[10px] text-[#d4af37] leading-none">{currentUser.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                  title="Sign Out of TimeZone Watches"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setAuthError(null); setCurrentView('signin'); }}
                  className="text-xs text-gray-300 hover:text-white px-2 py-1 cursor-pointer font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setAuthError(null); setCurrentView('signup'); }}
                  className="text-xs bg-[#d4af37] hover:bg-[#ecc94b] text-black font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* FLOATING SUCCESS NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#151722] border border-[#d4af37] text-white px-4 py-3 rounded-lg shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 2. MAIN CONTENT BODY */}
      <main className="flex-1">

        {/* ===================== VIEW: HOMEPAGE / CATALOG ===================== */}
        {currentView === 'home' && (
          <div>
            {/* Hero Banner Section */}
            <section className="relative overflow-hidden border-b border-[#d4af37]/20 bg-gradient-to-b from-[#12141d] to-[#0b0c10] py-16 px-4">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="max-w-2xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-3 bg-[#d4af37]/10 px-3 py-1 rounded border border-[#d4af37]/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Exclusive Horology Collection · 2026</span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
                    TIMELESS CRAFT. <br/>
                    <span className="text-[#d4af37]">UNCOMPROMISED</span> LUXURY.
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
                    Explore precision masterworks from Casio, Titan, Seiko, Fossil, Timex, and Fastrack. Each timepiece is 100% genuine with official brand warranty.
                  </p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <a 
                      href="#watches-grid" 
                      className="bg-[#d4af37] hover:bg-[#ecc94b] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded transition-colors"
                    >
                      Browse Watches
                    </a>
                    <button 
                      onClick={() => { setSelectedCategory('Luxury'); }}
                      className="border border-[#d4af37]/60 hover:border-[#d4af37] text-white hover:text-[#d4af37] text-xs tracking-wider uppercase px-6 py-3 rounded transition-colors cursor-pointer"
                    >
                      Luxury Editions
                    </button>
                  </div>
                </div>

                {/* Hero Showcase Image */}
                <div className="w-full lg:w-1/2 max-w-lg rounded-xl overflow-hidden border border-[#d4af37]/30 shadow-2xl relative group">
                  <img 
                    src="/src/assets/images/hero_luxury_chronograph_1793529330446.jpg" 
                    alt="TimeZone Luxury Chronograph" 
                    className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                    <div>
                      <span className="text-[#d4af37] text-xs font-semibold tracking-wider uppercase">Master Chronometer</span>
                      <h3 className="font-serif text-lg text-white font-bold">Swiss Automatic Gold Bezel</h3>
                      <p className="text-gray-300 text-xs">Obsidian stone backdrop with sapphire glare protection</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Catalog & Filter Section */}
            <section id="watches-grid" className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
              
              {/* Filter Controls Bar */}
              <div className="bg-[#151722] p-5 rounded-lg border border-[#d4af37]/25 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Brand Filter */}
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-2 font-medium">Filter by Brand:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {brands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => setSelectedBrand(brand)}
                          className={`text-xs px-3 py-1.5 rounded transition-all cursor-pointer ${
                            selectedBrand === brand 
                              ? 'bg-[#d4af37] text-black font-bold shadow' 
                              : 'bg-[#1e202e] text-gray-300 hover:text-white hover:bg-[#252839]'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-2 font-medium md:text-right">Category:</span>
                    <div className="flex flex-wrap gap-1.5 md:justify-end">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded transition-all cursor-pointer ${
                            selectedCategory === cat 
                              ? 'border border-[#d4af37] text-[#d4af37] bg-[#d4af37]/15 font-semibold' 
                              : 'border border-gray-700 text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active search or filter feedback */}
                {(searchQuery || selectedBrand !== 'All' || selectedCategory !== 'All') && (
                  <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      Showing results for {selectedBrand !== 'All' ? `brand: ${selectedBrand}` : ''} {selectedCategory !== 'All' ? `category: ${selectedCategory}` : ''} {searchQuery ? `"${searchQuery}"` : ''} ({filteredProducts.length} watches)
                    </span>
                    <button 
                      onClick={() => { setSearchQuery(''); setSelectedBrand('All'); setSelectedCategory('All'); }}
                      className="text-[#d4af37] hover:underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Grid Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Curated Timepieces</h2>
                  <p className="text-xs text-gray-400">Showing {filteredProducts.length} watches in Indian Rupees (₹)</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#d4af37] border border-[#d4af37]/30 bg-[#d4af37]/5 px-3 py-1.5 rounded">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorized Official Warranty</span>
                </div>
              </div>

              {/* Product Cards Grid (Requirement 3: Image, Brand, Product name, Price in INR, Add to Cart) */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className="bg-[#151722] rounded-lg border border-gray-800 hover:border-[#d4af37]/50 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 group"
                    >
                      {/* Watch Image container */}
                      <div className="h-56 relative overflow-hidden bg-[#0c0d12]">
                        <img 
                          src={product.imageUrl} 
                          alt={`${product.brand} ${product.name}`}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold uppercase tracking-wider bg-black/80 text-[#d4af37] border border-[#d4af37]/40 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex flex-col flex-1">
                        <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider mb-1">
                          {product.brand}
                        </span>
                        <h3 className="font-semibold text-sm text-white line-clamp-1 mb-1.5" title={product.name}>
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1">
                          {product.description}
                        </p>

                        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between mb-3">
                          <span className="text-[11px] text-gray-500 uppercase">Price</span>
                          <span className="text-base font-bold text-[#d4af37] font-mono">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Add to Cart Button (Requirement 4) */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-[#d4af37] hover:bg-[#ecc94b] text-black font-semibold text-xs py-2.5 px-3 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#151722] rounded-lg border border-gray-800">
                  <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <h3 className="font-serif text-lg text-white mb-1">No watches found</h3>
                  <p className="text-xs text-gray-400 mb-4">Try clearing your search query or selecting a different brand or category.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedBrand('All'); setSelectedCategory('All'); }}
                    className="text-xs bg-[#d4af37] text-black font-semibold px-4 py-2 rounded"
                  >
                    View All Watches
                  </button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-6 border-t border-gray-800">
                <div className="bg-[#151722] p-4 rounded border border-gray-800 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">100% Authentic Watches</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Sourced directly from Casio, Titan, Seiko, Fossil, Timex & Fastrack.</p>
                  </div>
                </div>
                <div className="bg-[#151722] p-4 rounded border border-gray-800 flex items-start gap-3">
                  <Truck className="w-6 h-6 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Insured Express Shipping</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Tamper-proof luxury packaging with real-time shipment monitoring.</p>
                  </div>
                </div>
                <div className="bg-[#151722] p-4 rounded border border-gray-800 flex items-start gap-3">
                  <RotateCcw className="w-6 h-6 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Direct MySQL Persistence</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Orders, users, products, and carts are safely logged via Django ORM.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================== VIEW: CART PAGE (Requirement 5) ===================== */}
        {currentView === 'cart' && (
          <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">Your Shopping Cart</h1>
                <p className="text-xs text-gray-400">Review selected timepieces before completing your order</p>
              </div>
              <button 
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </button>
            </div>

            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Cart Items List */}
                <div className="lg:col-span-8">
                  <div className="bg-[#151722] rounded-lg border border-[#d4af37]/25 overflow-hidden shadow-lg">
                    <div className="divide-y divide-gray-800">
                      {cartItems.map(item => (
                        <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                          
                          {/* Image */}
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-20 h-20 rounded object-cover border border-gray-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=200&q=80";
                            }}
                          />

                          {/* Info */}
                          <div className="flex-1 text-center sm:text-left">
                            <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider block">
                              {item.product.brand}
                            </span>
                            <h3 className="font-semibold text-sm text-white mb-1">
                              {item.product.name}
                            </h3>
                            <span className="text-xs text-gray-400 font-mono">
                              Unit Price: ₹{item.product.price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Quantity Stepper (Requirement 4 & 5) */}
                          <div className="flex items-center border border-gray-700 rounded bg-[#0c0d12]">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-[#d4af37] hover:bg-gray-800/50 transition-colors cursor-pointer"
                              title="Decrease"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-9 text-center font-mono font-bold text-sm text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-[#d4af37] hover:bg-gray-800/50 transition-colors cursor-pointer"
                              title="Increase"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right min-w-[100px]">
                            <span className="text-[10px] text-gray-500 uppercase block">Subtotal</span>
                            <span className="text-base font-bold font-mono text-[#d4af37]">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="p-2 text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button 
                      onClick={() => setCurrentView('home')}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Continue Shopping</span>
                    </button>
                    <span className="text-xs text-gray-500">
                      Prices are inclusive of all GST & taxes.
                    </span>
                  </div>
                </div>

                {/* Order Summary & Place Order (Requirement 6) */}
                <div className="lg:col-span-4">
                  <div className="bg-[#151722] p-6 rounded-lg border border-[#d4af37] shadow-xl sticky top-24">
                    <h3 className="font-serif text-lg font-bold text-white mb-4 pb-3 border-b border-gray-800">
                      Order Summary
                    </h3>

                    <div className="space-y-2 text-xs text-gray-400 mb-4">
                      <div className="flex justify-between">
                        <span>Items Subtotal ({cartItemCount} items)</span>
                        <span className="font-mono text-white">₹{cartTotalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insured Delivery</span>
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST / Taxes (18% Included)</span>
                        <span className="text-gray-400">Included</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-800 flex justify-between items-baseline mb-6">
                      <span className="font-serif text-sm font-semibold text-white">Total Amount:</span>
                      <span className="font-mono text-2xl font-bold text-[#d4af37]">
                        ₹{cartTotalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Customer Status */}
                    {currentUser ? (
                      <div className="mb-4 p-2.5 rounded bg-[#0c0d12] border border-gray-800 text-[11px] text-gray-400">
                        Ordering as <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.email})
                      </div>
                    ) : (
                      <div className="mb-4 p-3 rounded bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200">
                        You are currently shopping as guest. Click below to sign in or create an account.
                      </div>
                    )}

                    {/* Place Order Button (Requirement 6) */}
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-[#d4af37] hover:bg-[#ecc94b] text-black font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded shadow-lg transition-all cursor-pointer"
                    >
                      Place Order (₹{cartTotalAmount.toLocaleString('en-IN')})
                    </button>

                    <div className="mt-4 pt-4 border-t border-gray-800/80 space-y-2 text-[11px] text-gray-500">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>No advance payment gateway required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Instant order logging in MySQL 8.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-[#151722] rounded-lg border border-gray-800">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-serif text-xl text-white mb-2">Your Shopping Cart is Empty</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                  You have not added any watches to your cart yet. Explore our luxury and sports collections from Casio, Titan, Seiko, and Fossil.
                </p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="bg-[#d4af37] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded cursor-pointer"
                >
                  Browse Catalog
                </button>
              </div>
            )}
          </section>
        )}

        {/* ===================== VIEW: SIGN UP (Requirement 1) ===================== */}
        {currentView === 'signup' && (
          <section className="max-w-md mx-auto px-4 py-12">
            <div className="bg-[#151722] p-8 rounded-lg border border-[#d4af37]/30 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#1e202e] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto mb-3">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-white">Create Account</h2>
                <p className="text-xs text-gray-400 mt-1">Join TimeZone Watches to manage your orders</p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
                  {authError}
                </div>
              )}

              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    placeholder="Arjun Sharma"
                    className="w-full bg-[#0c0d12] text-xs text-white px-3 py-2.5 rounded border border-gray-700 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    placeholder="arjun@example.com"
                    className="w-full bg-[#0c0d12] text-xs text-white px-3 py-2.5 rounded border border-gray-700 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={signUpData.phoneNumber}
                    onChange={(e) => setSignUpData({ ...signUpData, phoneNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0c0d12] text-xs text-white px-3 py-2.5 rounded border border-gray-700 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#0c0d12] text-xs text-white px-3 py-2.5 rounded border border-gray-700 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#0c0d12] text-xs text-white px-3 py-2.5 rounded border border-gray-700 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d4af37] hover:bg-[#ecc94b] text-black font-bold text-xs uppercase tracking-wider py-3 rounded mt-2 cursor-pointer transition-colors"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-gray-400">
                Already have an account?{' '}
                <button 
                  onClick={() => { setAuthError(null); setCurrentView('signin'); }}
                  className="text-[#d4af37] hover:underline font-semibold cursor-pointer"
                >
                  Sign In here
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ===================== VIEW: SIGN IN (Requirement 2) ===================== */}
        {currentView === 'signin' && (
          <section className="max-w-md mx-auto px-4 py-12">
            <div className="bg-[#151722] p-8 rounded-lg border border-[#d4af37]/30 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#1e202e] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto mb-3">
                  <LogIn className="w-6 h-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-white">Sign In</h2>
                <p className="text-xs text-gray-400 mt-1">Credentials verified against MySQL database</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 border border-emerald-600/60 text-emerald-300">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>Strict DB Check Active</span>
                </div>
              </div>

              {authError && (
                <div className="mb-5 p-3.5 rounded-lg bg-rose-950/70 border border-rose-600 text-xs text-rose-200 flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-300 font-semibold mb-0.5">Authentication Failed</strong>
                    <span>{authError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    placeholder="arjun.sharma@example.com"
                    className="w-full bg-[#0c0d12] text-xs text-white px-3 py-2.5 rounded border border-gray-700 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#0c0d12] text-xs text-white px-3 py-2.5 rounded border border-gray-700 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d4af37] hover:bg-[#ecc94b] text-black font-bold text-xs uppercase tracking-wider py-3 rounded mt-2 cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              </form>

              {/* Database Test Credentials & Failure Verification Section */}
              <div className="mt-6 pt-4 border-t border-gray-800 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Database Credentials Test</span>
                  </span>
                  <span className="text-[10px] text-gray-400">({usersDb.length} users registered)</span>
                </div>

                <div className="space-y-1 mb-3 text-[11px] text-gray-400 bg-[#0c0d12] p-2.5 rounded border border-gray-800 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300">Default:</span>
                    <span className="text-emerald-400">arjun.sharma@example.com</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300">Password:</span>
                    <span className="text-emerald-400">password123</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSignInData({ email: 'arjun.sharma@example.com', password: 'password123' });
                      setAuthError(null);
                    }}
                    className="bg-[#181a24] hover:bg-[#202331] text-[#d4af37] border border-[#d4af37]/40 py-1.5 px-2 rounded text-center cursor-pointer transition-colors font-medium"
                    title="Pre-fills correct registered credentials"
                  >
                    ✓ Valid Credentials
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSignInData({ email: 'arjun.sharma@example.com', password: 'wrongpassword999' });
                      setAuthError(null);
                    }}
                    className="bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 py-1.5 px-2 rounded text-center cursor-pointer transition-colors font-medium"
                    title="Pre-fills incorrect password to test refusal"
                  >
                    ✕ Wrong Password
                  </button>
                </div>
              </div>

              <div className="mt-5 text-center text-xs text-gray-400">
                Don't have an account yet?{' '}
                <button 
                  onClick={() => { setAuthError(null); setCurrentView('signup'); }}
                  className="text-[#d4af37] hover:underline font-semibold cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ===================== VIEW: DOCKER & DJANGO CODEBASE GUIDE ===================== */}
        {currentView === 'dockerGuide' && (
          <section className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
            <div className="bg-[#151722] p-6 lg:p-8 rounded-lg border border-[#d4af37]/40 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-7 h-7 text-[#d4af37]" />
                <h2 className="font-serif text-2xl font-bold text-white">Docker & Django MySQL Deployment</h2>
              </div>
              <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                The repository includes a complete Python Django 4.2+ application configured with MySQL 8.0, 
                Docker build files (<code className="text-[#d4af37]">Dockerfile</code>), and multi-container orchestration (<code className="text-[#d4af37]">docker-compose.yml</code>).
              </p>

              {/* Step 1: Run with Docker Compose */}
              <div className="mb-6 p-4 rounded bg-[#0c0d12] border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">Option A: 1-Click Docker Launch</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">Recommended</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Starts MySQL 8.0 with healthcheck, runs migrations, seeds 14 watches, and serves the Django app on port 8000:
                </p>
                <div className="bg-[#181a24] p-3 rounded font-mono text-xs text-emerald-300 overflow-x-auto">
                  docker compose up -d
                </div>
              </div>

              {/* Step 2: Native Python Run */}
              <div className="mb-6 p-4 rounded bg-[#0c0d12] border border-gray-800">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-2">Option B: Native Python Virtual Environment</span>
                <div className="bg-[#181a24] p-3 rounded font-mono text-xs text-gray-300 space-y-1.5 overflow-x-auto">
                  <div className="text-gray-500"># 1. Create and activate virtual environment</div>
                  <div>python3 -m venv venv && source venv/bin/activate</div>
                  <div className="text-gray-500 pt-1"># 2. Install dependencies</div>
                  <div>pip install -r requirements.txt</div>
                  <div className="text-gray-500 pt-1"># 3. Run database migrations</div>
                  <div>python manage.py makemigrations</div>
                  <div>python manage.py migrate</div>
                  <div className="text-gray-500 pt-1"># 4. Seed the 14 sample watches</div>
                  <div>python manage.py seed_watches</div>
                  <div className="text-gray-500 pt-1"># 5. Start development server</div>
                  <div>python manage.py runserver 0.0.0.0:8000</div>
                </div>
              </div>

              {/* Database Schema Map */}
              <div className="p-4 rounded bg-[#0c0d12] border border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">MySQL 8.0 Tables Created</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#151722] rounded border border-gray-800">
                    <span className="font-mono text-[#d4af37] font-bold block mb-1">timezone_users</span>
                    <span className="text-gray-400 text-[11px]">email, full_name, phone_number, password hash, date_joined</span>
                  </div>
                  <div className="p-3 bg-[#151722] rounded border border-gray-800">
                    <span className="font-mono text-[#d4af37] font-bold block mb-1">timezone_products</span>
                    <span className="text-gray-400 text-[11px]">name, brand, category, price (INR), image_url, stock</span>
                  </div>
                  <div className="p-3 bg-[#151722] rounded border border-gray-800">
                    <span className="font-mono text-[#d4af37] font-bold block mb-1">timezone_cart</span>
                    <span className="text-gray-400 text-[11px]">user_id, session_key, created_at, updated_at</span>
                  </div>
                  <div className="p-3 bg-[#151722] rounded border border-gray-800">
                    <span className="font-mono text-[#d4af37] font-bold block mb-1">timezone_cart_items</span>
                    <span className="text-gray-400 text-[11px]">cart_id, product_id, quantity, added_at</span>
                  </div>
                  <div className="p-3 bg-[#151722] rounded border border-gray-800">
                    <span className="font-mono text-[#d4af37] font-bold block mb-1">timezone_orders</span>
                    <span className="text-gray-400 text-[11px]">order_id (UUID), user_id, total_amount, status</span>
                  </div>
                  <div className="p-3 bg-[#151722] rounded border border-gray-800">
                    <span className="font-mono text-[#d4af37] font-bold block mb-1">timezone_order_items</span>
                    <span className="text-gray-400 text-[11px]">order_id, product_id, product_name, price, quantity</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setCurrentView('home')}
                  className="bg-[#d4af37] text-black font-semibold text-xs px-4 py-2 rounded cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ===================== 7. ORDER CONFIRMATION MODAL POPUP (Requirement 7) ===================== */}
      {isOrderModalOpen && confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#151722] border-2 border-[#d4af37] rounded-xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative">
            
            {/* Green Success Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-950/60 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 stroke-[2.5]" />
            </div>

            {/* Heading: Order Placed Successfully! */}
            <h2 className="font-serif text-2xl font-bold text-[#d4af37] mb-2">
              Order Placed Successfully!
            </h2>

            {/* Message: Thank you for shopping with TimeZone Watches. */}
            <p className="text-gray-300 text-xs sm:text-sm mb-6">
              Thank you for shopping with <strong className="text-white">TimeZone Watches</strong>.
            </p>

            {/* Order Details Receipt Box */}
            <div className="bg-[#0c0d12] border border-gray-800 rounded-lg p-4 mb-6 text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-800">
                <span className="text-gray-400">Unique Order ID:</span>
                <span className="font-mono text-[#d4af37] font-bold">{confirmedOrder.orderId}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-800">
                <span className="text-gray-400">Customer:</span>
                <span className="text-white font-medium">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-800">
                <span className="text-gray-400">Order Date:</span>
                <span className="text-gray-300">{confirmedOrder.date}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-semibold text-gray-300">Total Order Amount:</span>
                <span className="font-mono text-xl font-bold text-[#d4af37]">
                  ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Button: Continue Shopping -> redirects to homepage */}
            <button
              onClick={() => {
                setIsOrderModalOpen(false);
                setCurrentView('home');
              }}
              className="w-full bg-[#d4af37] hover:bg-[#ecc94b] text-black font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded transition-all cursor-pointer shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* 8. LUXURY FOOTER */}
      <footer className="bg-[#10121a] border-t border-[#d4af37]/25 pt-12 pb-8 px-4 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#d4af37]" />
                <span className="font-serif tracking-widest text-lg font-bold text-white">
                  TIME<span className="text-[#d4af37]">ZONE</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Curating horological brilliance. Official authorized timepieces from Casio, Titan, Seiko, Fossil, Timex, and Fastrack.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#d4af37]">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Guaranteed Authentic</span>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-3">Brands</h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li><button onClick={() => { setCurrentView('home'); setSelectedBrand('Seiko'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Seiko</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedBrand('Casio'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Casio</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedBrand('Titan'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Titan</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedBrand('Fossil'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Fossil</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedBrand('Timex'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Timex</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedBrand('Fastrack'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Fastrack</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-3">Categories</h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li><button onClick={() => { setCurrentView('home'); setSelectedCategory('Luxury'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Luxury Chronographs</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedCategory('Analog'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Vintage & Classic Analog</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedCategory('Sports'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Rugged Sports & Divers</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedCategory('Digital'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Retro Digital</button></li>
                <li><button onClick={() => { setCurrentView('home'); setSelectedCategory('Smartwatch'); }} className="hover:text-[#d4af37] transition-colors cursor-pointer">Connected Smartwatches</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-3">Backend Architecture</h4>
              <p className="text-xs text-gray-400 mb-2">
                Pure Python Django with MySQL 8.0 backend. Fully containerized with Docker Compose.
              </p>
              <div className="bg-[#0c0d12] p-2.5 rounded border border-gray-800 text-[11px] font-mono text-gray-300">
                docker compose up -d
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
            <span>&copy; 2026 TimeZone Watches. All Rights Reserved.</span>
            <span>All product prices listed in Indian Rupees (₹).</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
