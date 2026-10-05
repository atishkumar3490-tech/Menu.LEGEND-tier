/* ==========================================================
   DATA.JS - Enterprise Admin Settings & Master Database
   ========================================================== */

// 👑 ADMIN SETTINGS (Control Panel - No hardcoding needed in UI)
const APP_CONFIG = {
    restaurant_name: "Kavya Family Restaurant",
    upi_id: 'merchant@upi',       // <--- ENTER YOUR UPI ID HERE
    gst_rate: 0.05,               // 5% GST
    free_delivery_threshold: 199, // Orders above ₹199 get free delivery
    delivery_fee: 30,             // Standard delivery fee
    admin_phone: '+919999999999',
    instagram_url: 'https://www.instagram.com/kavyafamilyrestaurant?stkn=MWNxZ3hjMzR1eGJ0eQ==',
    coin_reward_min: 10,
    coin_reward_max: 50,
    max_discount_percentage: 0.10 // Max 10% bill can be paid via coins
};

// 📂 HORIZONTAL MENU ICONS (From your provided GitHub repository)
const GITHUB_BASE = "https://raw.githubusercontent.com/atishkumar3490-tech/Menu.LEGEND-tier/main/";

const categories = [
    { id: 'All', name: 'All', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
    { id: 'Chicken', name: 'Chicken', img: `${GITHUB_BASE}cat-chicken-1.jpg` },
    { id: 'Kebab', name: 'Kebab', img: `${GITHUB_BASE}cat-starter-1.jpg` },
    { id: 'Veg Curry', name: 'Veg Curry', img: `${GITHUB_BASE}cat-curry-1.jpg` },
    { id: 'Paneer', name: 'Paneer', img: `${GITHUB_BASE}cat-paneer-1.jpg` },
    { id: 'Rice', name: 'Rice & Biryani', img: `${GITHUB_BASE}cat-biryani-1.jpg` },
    { id: 'Roti', name: 'Breads', img: `${GITHUB_BASE}cat-rolls-1.jpg` },
    { id: 'Sweets', name: 'Sweets', img: `${GITHUB_BASE}cat-sweet-1.jpg` },
    { id: 'Beverages', name: 'Beverages', img: `${GITHUB_BASE}cat-bevrages-1.jpg` }
];

// 🍔 FULL ENTERPRISE MENU DATABASE (Extracted from your image + Premium HD Photos)
const menuItems = [
    // --- CHICKEN CATEGORY ---
    { id: 'c1', category: 'Chicken', name: 'Chicken Curry', price: 160, fullPrice: 280, veg: false, meta: '⚡ 20-25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'c2', category: 'Chicken', name: 'Chicken Karahi', price: 180, fullPrice: 330, veg: false, meta: '⚡ 25-30 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'c3', category: 'Chicken', name: 'Chicken Do Pyaza', price: 170, fullPrice: 300, veg: false, meta: '⚡ 20-25 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80' },
    { id: 'c4', category: 'Chicken', name: 'Chicken Handi', price: 190, fullPrice: 350, veg: false, meta: '⚡ 25-30 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1627308595229-7830f5c922b1?w=800&q=80' },
    { id: 'c5', category: 'Chicken', name: 'Chicken Butter Masala', price: 180, fullPrice: 330, veg: false, meta: '⚡ 25-30 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { id: 'c6', category: 'Chicken', name: 'Chicken Masala', price: 200, fullPrice: 380, veg: false, meta: '⚡ 30 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'c7', category: 'Chicken', name: 'Chicken Tikka Masala', price: 190, fullPrice: 350, veg: false, meta: '⚡ 25-30 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' },
    { id: 'c8', category: 'Chicken', name: 'Chicken Dehati', price: 480, fullPrice: 480, veg: false, meta: '⚡ 35-40 mins | Bestseller', rating: '4.9', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' },
    
    // --- KEBAB / STARTERS ---
    { id: 'k1', category: 'Kebab', name: 'Chicken Tandoori (Half)', price: 180, fullPrice: 350, veg: false, meta: '⚡ 15-20 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&q=80' },
    { id: 'k2', category: 'Kebab', name: 'Chicken Tikka', price: 130, fullPrice: 220, veg: false, meta: '⚡ 15-20 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1597289124948-688c1a35cb48?w=800&q=80' },
    { id: 'k3', category: 'Kebab', name: 'Chicken Leg Kabab', price: 270, fullPrice: 270, veg: false, meta: '⚡ 20 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&q=80' },
    { id: 'k4', category: 'Kebab', name: 'Paneer Tikka', price: 120, fullPrice: 200, veg: true, meta: '⚡ 15-20 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },

    // --- VEG CURRY ---
    { id: 'v1', category: 'Veg Curry', name: 'Mix Veg', price: 120, fullPrice: 200, veg: true, meta: '⚡ 15-20 mins', rating: '4.2', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'v2', category: 'Veg Curry', name: 'Mashroom Masala', price: 160, fullPrice: 280, veg: true, meta: '⚡ 20-25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v3', category: 'Veg Curry', name: 'Mashroom Butter Masala', price: 170, fullPrice: 290, veg: true, meta: '⚡ 20-25 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=800&q=80' },
    { id: 'v4', category: 'Veg Curry', name: 'Mashroom Mutter Masala', price: 180, fullPrice: 300, veg: true, meta: '⚡ 25 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'v5', category: 'Veg Curry', name: 'Mashroom Karahi', price: 160, fullPrice: 300, veg: true, meta: '⚡ 20-25 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },

    // --- PANEER ---
    { id: 'p1', category: 'Paneer', name: 'Paneer Butter Masala', price: 160, fullPrice: 280, veg: true, meta: '⚡ 20-25 mins | Chef Special', rating: '4.9', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&q=80' },
    { id: 'p2', category: 'Paneer', name: 'Mutter Paneer', price: 150, fullPrice: 270, veg: true, meta: '⚡ 20-25 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80' },
    { id: 'p3', category: 'Paneer', name: 'Paneer Karahi', price: 150, fullPrice: 260, veg: true, meta: '⚡ 20-25 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=800&q=80' },
    { id: 'p4', category: 'Paneer', name: 'Paneer Handi', price: 160, fullPrice: 280, veg: true, meta: '⚡ 20-25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { id: 'p5', category: 'Paneer', name: 'Paneer Tikka Masala', price: 160, fullPrice: 280, veg: true, meta: '⚡ 25 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },

    // --- RICE & BIRYANI ---
    { id: 'r1', category: 'Rice', name: 'Jeera Rice (Half)', price: 80, fullPrice: 130, veg: true, meta: '⚡ 10-15 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80' },
    { id: 'r2', category: 'Rice', name: 'Steam Rice (Half)', price: 60, fullPrice: 120, veg: true, meta: '⚡ 10 mins', rating: '4.0', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80' },
    { id: 'r3', category: 'Rice', name: 'Paneer Pulav (Half)', price: 100, fullPrice: 160, veg: true, meta: '⚡ 15-20 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' },
    { id: 'r4', category: 'Rice', name: 'Veg Pulav (Half)', price: 90, fullPrice: 140, veg: true, meta: '⚡ 15 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'r5', category: 'Rice', name: 'Mutter Pulav (Half)', price: 70, fullPrice: 140, veg: true, meta: '⚡ 15 mins', rating: '4.2', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80' },

    // --- ROTI & BREADS ---
    { id: 'b1', category: 'Roti', name: 'Butter Naan', price: 35, fullPrice: 35, veg: true, meta: '⚡ 5-10 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b2', category: 'Roti', name: 'Garlic Naan', price: 70, fullPrice: 70, veg: true, meta: '⚡ 5-10 mins', rating: '4.9', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'b3', category: 'Roti', name: 'Tandoori Butter Roti', price: 25, fullPrice: 25, veg: true, meta: '⚡ 5 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1610192305530-9eb4c01740fb?w=800&q=80' },
    { id: 'b4', category: 'Roti', name: 'Lachha Partha', price: 25, fullPrice: 25, veg: true, meta: '⚡ 5-10 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'b5', category: 'Roti', name: 'Paneer Kulcha', price: 80, fullPrice: 80, veg: true, meta: '⚡ 10 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'b6', category: 'Roti', name: 'Onion Kulcha', price: 50, fullPrice: 50, veg: true, meta: '⚡ 10 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b7', category: 'Roti', name: 'Plane Naan', price: 30, fullPrice: 30, veg: true, meta: '⚡ 5 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' }
];
