from django.core.management.base import BaseCommand
from products.models import Product
from decimal import Decimal

SAMPLE_WATCHES = [
    {
        "name": "Presage Cocktail Time Automatic",
        "brand": "Seiko",
        "category": "Luxury",
        "price": Decimal("38500.00"),
        "image_url": "/src/assets/images/watch_seiko_presage_1793529331550.jpg",
        "description": "Exquisite Japanese automatic 23-jewel movement with sunburst guilloche dial, blued sweep second hand, and fine genuine leather band.",
        "stock": 15
    },
    {
        "name": "Neutra Chronograph Smoke Dial",
        "brand": "Fossil",
        "category": "Analog",
        "price": Decimal("12495.00"),
        "image_url": "/src/assets/images/watch_fossil_chronograph_1793529330811.jpg",
        "description": "Mid-century minimalist architecture meets modern horology. Features a smoked sunray dial with Roman numerals, stop-watch sub-dials, and aged leather strap.",
        "stock": 25
    },
    {
        "name": "Edifice Solar Octagon Chronograph",
        "brand": "Casio",
        "category": "Sports",
        "price": Decimal("14995.00"),
        "image_url": "/src/assets/images/watch_casio_edifice_1793529332405.jpg",
        "description": "High-octane automotive racing chronograph powered by solar energy. Octagonal carbon-fiber bezel, sapphire crystal, and 100M water resistance.",
        "stock": 20
    },
    {
        "name": "Edge Ceramic Midnight Black",
        "brand": "Titan",
        "category": "Luxury",
        "price": Decimal("24995.00"),
        "image_url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
        "description": "One of the slimmest ceramic watches in the world at just 4.4mm thin. Hypoallergenic high-tech ceramic case with sapphire glass.",
        "stock": 18
    },
    {
        "name": "Edge Ceramic Midnight Black",
        "brand": "Titan",
        "category": "Luxury",
        "price": Decimal("24995.00"),
        "image_url": "/src/assets/images/hero_luxury_chronograph_1793529330446.jpg",
        "description": "One of the slimmest ceramic watches in the world with obsidian black dial, hypoallergenic case, and sapphire glass.",
        "stock": 18
    },
    {
        "name": "G-Shock GA-2100 Octagonal Carbon Core",
        "brand": "Casio",
        "category": "Sports",
        "price": Decimal("8995.00"),
        "image_url": "/src/assets/images/watch_gshock_rugged_1793532280139.jpg",
        "description": "The legendary 'CasiOak'. Ultra-rugged carbon core guard structure, 200M water resistance, dual digital-analog display with double LED illumination.",
        "stock": 35
    },
    {
        "name": "Grandmaster Mechanical Skeleton",
        "brand": "Titan",
        "category": "Luxury",
        "price": Decimal("19995.00"),
        "image_url": "/src/assets/images/watch_skeleton_automatic_1793532302935.jpg",
        "description": "Intricate open-heart skeleton dial revealing the rhythmic heartbeat of precision automatic movement. Rose gold plated stainless steel case.",
        "stock": 12
    },
    {
        "name": "Reflex Play AMOLED Smartwatch",
        "brand": "Fastrack",
        "category": "Smartwatch",
        "price": Decimal("4995.00"),
        "image_url": "/src/assets/images/watch_fastrack_smartwatch_1793532279618.jpg",
        "description": "1.3-inch Ultra AMOLED display with Bluetooth calling, built-in games, 100+ sports modes, SpO2 monitor, and 7-day battery life.",
        "stock": 50
    },
    {
        "name": "Marlin Mechanical Hand-Wind Vintage",
        "brand": "Timex",
        "category": "Analog",
        "price": Decimal("16495.00"),
        "image_url": "/src/assets/images/watch_timex_vintage_1793532280439.jpg",
        "description": "A true 1960s reissue featuring a hand-wound mechanical movement, domed acrylic crystal, sunburst champagne dial, and embossed leather strap.",
        "stock": 14
    },
    {
        "name": "Gen 6 Touchscreen Smartwatch",
        "brand": "Fossil",
        "category": "Smartwatch",
        "price": Decimal("22995.00"),
        "image_url": "/src/assets/images/watch_fastrack_smartwatch_1793532279618.jpg",
        "description": "Powered with Wear OS by Google. Qualcomm Snapdragon Wear 4100+ platform, fast charging, heart rate zone tracking, and phone calls on wrist.",
        "stock": 22
    },
    {
        "name": "Seiko 5 Sports Automatic Diver Navy",
        "brand": "Seiko",
        "category": "Sports",
        "price": Decimal("26500.00"),
        "image_url": "/src/assets/images/watch_seiko_diver_1793532301210.jpg",
        "description": "Iconic diver aesthetics with unidirectional rotating navy bezel, Lumibrite hour markers, day/date complication, and 4R36 automatic caliber.",
        "stock": 16
    },
    {
        "name": "Expedition Shock Digital Digital Trail",
        "brand": "Timex",
        "category": "Digital",
        "price": Decimal("5495.00"),
        "image_url": "/src/assets/images/watch_gshock_rugged_1793532280139.jpg",
        "description": "Built for rugged wilderness adventures. Heavy-duty shock resistance, INDIGLO night-light, 100-hour chronograph, and countdown timer.",
        "stock": 40
    },
    {
        "name": "Vintage Gold Digital Illuminator",
        "brand": "Casio",
        "category": "Digital",
        "price": Decimal("4295.00"),
        "image_url": "/src/assets/images/watch_casio_vintage_gold_1793532302040.jpg",
        "description": "Timeless retro 1980s aesthetic with polished gold-tone stainless steel bracelet, daily alarm, hourly time signal, and auto-calendar.",
        "stock": 45
    },
    {
        "name": "Vyb Trendsetter Monochrome Analog",
        "brand": "Fastrack",
        "category": "Analog",
        "price": Decimal("2895.00"),
        "image_url": "/src/assets/images/hero_luxury_chronograph_1793529330446.jpg",
        "description": "Youthful contemporary minimalist timepiece with textured black dial, high-contrast gold second hand, and flexible sport strap.",
        "stock": 60
    },
    {
        "name": "Regalia Imperial Diamond Accent",
        "brand": "Titan",
        "category": "Luxury",
        "price": Decimal("32500.00"),
        "image_url": "/src/assets/images/watch_titan_regalia_gold_1793532279316.jpg",
        "description": "Prestigious royal luxury watch adorned with genuine certified diamond hour markers on a gold-plated multi-link Jubilee bracelet.",
        "stock": 10
    }
]

class Command(BaseCommand):
    help = "Seeds sample luxury watch products into MySQL database for TimeZone Watches"

    def handle(self, *args, **options):
        self.stdout.write("Seeding sample watches...")
        created_count = 0
        updated_count = 0

        for watch_data in SAMPLE_WATCHES:
            obj, created = Product.objects.update_or_create(
                name=watch_data["name"],
                brand=watch_data["brand"],
                defaults=watch_data
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded database! ({created_count} added, {updated_count} updated. Total: {Product.objects.count()})"
            )
        )
