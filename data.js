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
    max_discount_percentage: 0.10, // Max 10% bill can be paid via coins
    order_tracking_enabled: true  // New Feature: Live Order Tracking
};

// 📂 HORIZONTAL MENU ICONS
const GITHUB_BASE = "https://raw.githubusercontent.com/atishkumar3490-tech/Menu.LEGEND-tier/main/";

const categories = [
    { id: 'All', name: 'All', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
    { id: 'Biryani', name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' }, 
    { id: 'Chicken', name: 'Chicken', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&q=80' }, 
    { id: 'Kebab', name: 'Kebab', img: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=200&q=80' }, 
    { id: 'Paneer', name: 'Paneer', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=200&q=80' }, 
    { id: 'Veg Curry', name: 'Veg Curry', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' }, 
    { id: 'Rolls', name: 'Rolls', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=200&q=80' }, 
    { id: 'Cold Drinks', name: 'Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80' } 
];


// 🍔 FULL ENTERPRISE MENU DATABASE (Mapped accurately with Real Menu Image & Smart Logic)
const menuItems = [
    // --- CHICKEN CATEGORY ---
    { 
        id: 'c1', category: 'Chicken', name: 'Chicken Curry', 
        price: 160, strikePrice: 220, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }],
        meta: '⚡ 20-25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' 
    },
    { 
        id: 'c2', category: 'Chicken', name: 'Chicken Karahi', 
        price: 180, strikePrice: 240, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 330 }],
        meta: '⚡ 25-30 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' 
    },
    { 
        id: 'c3', category: 'Chicken', name: 'Chicken Do Pyaza', 
        price: 170, strikePrice: 230, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 170 }, { size: 'Full', price: 300 }],
        meta: '⚡ 20-25 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80' 
    },
    { 
        id: 'c4', category: 'Chicken', name: 'Chicken Handi', 
        price: 190, strikePrice: 260, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 190 }, { size: 'Full', price: 350 }],
        meta: '⚡ 25-30 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1627308595229-7830f5c922b1?w=800&q=80' 
    },
    { 
        id: 'c5', category: 'Chicken', name: 'Chicken Butter Masala', 
        price: 180, strikePrice: 250, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 330 }],
        meta: '⚡ 25-30 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' 
    },
    { 
        id: 'c6', category: 'Chicken', name: 'Chicken Masala', 
        price: 200, strikePrice: 280, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 200 }, { size: 'Full', price: 380 }],
        meta: '⚡ 30 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' 
    },
    { 
        id: 'c7', category: 'Chicken', name: 'Chicken Tikka Masala', 
        price: 190, strikePrice: 260, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 190 }, { size: 'Full', price: 350 }],
        meta: '⚡ 25-30 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' 
    },
    { 
        id: 'c9', category: 'Chicken', name: 'Chicken Tikka Butter Masala', 
        price: 200, strikePrice: 270, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 200 }, { size: 'Full', price: 370 }],
        meta: '⚡ 30 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' 
    },
    { 
        id: 'c8', category: 'Chicken', name: 'Chicken Dehati', 
        price: 480, strikePrice: 550, veg: false, needsSpice: true, 
        variants: [{ size: 'Full', price: 480 }],
        meta: '⚡ 35-40 mins | Bestseller', rating: '4.9', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' 
    },
    
    // --- KEBAB / STARTERS ---
    { 
        id: 'k1', category: 'Kebab', name: 'Chicken Tandoori', 
        price: 180, strikePrice: 240, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 350 }],
        meta: '⚡ 15-20 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&q=80' 
    },
    { 
        id: 'k2', category: 'Kebab', name: 'Chicken Tikka', 
        price: 130, strikePrice: 180, veg: false, needsSpice: true, 
        variants: [{ size: 'Half', price: 130 }, { size: 'Full', price: 220 }],
        meta: '⚡ 15-20 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1597289124948-688c1a35cb48?w=800&q=80' 
    },
    { 
        id: 'k3', category: 'Kebab', name: 'Chicken Leg Kabab', 
        price: 270, strikePrice: 320, veg: false, needsSpice: true, 
        variants: [{ size: 'Full', price: 270 }],
        meta: '⚡ 20 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&q=80' 
    },
    { 
        id: 'k4', category: 'Kebab', name: 'Paneer Tikka', 
        price: 120, strikePrice: 160, veg: true, needsSpice: true, 
        variants: [{ size: 'Half', price: 120 }, { size: 'Full', price: 200 }],
        meta: '⚡ 15-20 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' 
    },

    // --- VEG CURRY & PANEER ---
    { id: 'v1', category: 'Veg Curry', name: 'Mix Veg', price: 120, strikePrice: 160, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 120 }, { size: 'Full', price: 200 }], meta: '⚡ 15-20 mins', rating: '4.2', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'p3', category: 'Paneer', name: 'Paneer Karahi', price: 150, strikePrice: 200, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 150 }, { size: 'Full', price: 260 }], meta: '⚡ 20-25 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=800&q=80' },
    { id: 'p6', category: 'Paneer', name: 'Paneer Do Pyaza', price: 140, strikePrice: 190, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 140 }, { size: 'Full', price: 250 }], meta: '⚡ 20-25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80' },
    { id: 'p4', category: 'Paneer', name: 'Paneer Handi', price: 160, strikePrice: 210, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 20-25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { id: 'p7', category: 'Paneer', name: 'Paneer Masala', price: 140, strikePrice: 190, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 140 }, { size: 'Full', price: 240 }], meta: '⚡ 20 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'p1', category: 'Paneer', name: 'Paneer Butter Masala', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 20-25 mins', rating: '4.9', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&q=80' },
    { id: 'p5', category: 'Paneer', name: 'Paneer Tikka Masala', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 25 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'p2', category: 'Paneer', name: 'Mutter Paneer', price: 150, strikePrice: 200, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 150 }, { size: 'Full', price: 270 }], meta: '⚡ 20-25 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80' },
    
    // --- MUSHROOM (Mapped inside Veg Curry for accurate display) ---
    { id: 'v2', category: 'Veg Curry', name: 'Mashroom Masala', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 20-25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v3', category: 'Veg Curry', name: 'Mashroom Butter Masala', price: 170, strikePrice: 230, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 170 }, { size: 'Full', price: 290 }], meta: '⚡ 20-25 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=800&q=80' },
    { id: 'v4', category: 'Veg Curry', name: 'Mashroom Mutter Masala', price: 180, strikePrice: 240, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 300 }], meta: '⚡ 25 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'v5', category: 'Veg Curry', name: 'Mashroom Karahi', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 300 }], meta: '⚡ 20-25 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v6', category: 'Veg Curry', name: 'Mashroom Handi', price: 170, strikePrice: 230, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 170 }, { size: 'Full', price: 300 }], meta: '⚡ 25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v7', category: 'Veg Curry', name: 'Mashroom Do Payaza', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 25 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v8', category: 'Veg Curry', name: 'Mashroom Tikka Masala', price: 180, strikePrice: 240, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 320 }], meta: '⚡ 25 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },

    // --- RICE & BIRYANI ---
    { id: 'r2', category: 'Rice', name: 'Steam Rice', price: 60, strikePrice: 80, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 60 }, { size: 'Full', price: 120 }], meta: '⚡ 10 mins', rating: '4.0', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80' },
    { id: 'r1', category: 'Rice', name: 'Jeera Rice', price: 80, strikePrice: 100, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 80 }, { size: 'Full', price: 130 }], meta: '⚡ 10-15 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80' },
    { id: 'r5', category: 'Rice', name: 'Mutter Pulav', price: 70, strikePrice: 90, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 70 }, { size: 'Full', price: 140 }], meta: '⚡ 15 mins', rating: '4.2', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80' },
    { id: 'r4', category: 'Rice', name: 'Veg Pulav', price: 90, strikePrice: 120, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 90 }, { size: 'Full', price: 140 }], meta: '⚡ 15 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'r3', category: 'Rice', name: 'Paneer Pulav', price: 100, strikePrice: 130, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 100 }, { size: 'Full', price: 160 }], meta: '⚡ 15-20 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' },

    // --- ROTI & BREADS (No Popup Required, Direct Add) ---
    { id: 'b4', category: 'Roti', name: 'Lachha Partha', price: 25, strikePrice: 35, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 25 }], meta: '⚡ 5-10 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'b8', category: 'Roti', name: 'Tandoori Roti', price: 20, strikePrice: 30, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 20 }], meta: '⚡ 5 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1610192305530-9eb4c01740fb?w=800&q=80' },
    { id: 'b3', category: 'Roti', name: 'Tandoori Butter Roti', price: 25, strikePrice: 35, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 25 }], meta: '⚡ 5 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1610192305530-9eb4c01740fb?w=800&q=80' },
    { id: 'b7', category: 'Roti', name: 'Plane Naan', price: 30, strikePrice: 40, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 30 }], meta: '⚡ 5 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b1', category: 'Roti', name: 'Butter Naan', price: 35, strikePrice: 45, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 35 }], meta: '⚡ 5-10 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b2', category: 'Roti', name: 'Garlic Naan', price: 70, strikePrice: 90, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 70 }], meta: '⚡ 5-10 mins', rating: '4.9', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'b5', category: 'Roti', name: 'Paneer Kulcha', price: 80, strikePrice: 100, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 80 }], meta: '⚡ 10 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'b6', category: 'Roti', name: 'Onion Kulcha', price: 50, strikePrice: 65, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 50 }], meta: '⚡ 10 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b9', category: 'Roti', name: 'Staff Naan', price: 60, strikePrice: 80, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 60 }], meta: '⚡ 10 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b10', category: 'Roti', name: 'Staff Paratha', price: 60, strikePrice: 80, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 60 }], meta: '⚡ 10 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },

    // --- COLD DRINKS (New Addition - No Spice Popup) ---
    { 
        id: 'cd1', category: 'Cold Drinks', name: 'Thums Up', 
        price: 20, strikePrice: 20, veg: true, needsSpice: false, 
        variants: [
            { size: '250 ml', price: 20 }, 
            { size: '500 ml', price: 40 }, 
            { size: '1 Ltr', price: 80 }, 
            { size: '2 Ltr', price: 150 }
        ],
        meta: '⚡ Chilled', rating: '4.9', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80' 
    },
    { 
        id: 'cd2', category: 'Cold Drinks', name: 'Sprite', 
        price: 20, strikePrice: 20, veg: true, needsSpice: false, 
        variants: [
            { size: '250 ml', price: 20 }, 
            { size: '500 ml', price: 40 }, 
            { size: '1 Ltr', price: 80 }, 
            { size: '2 Ltr', price: 150 }
        ],
        meta: '⚡ Chilled', rating: '4.8', img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=80' 
    }
];
