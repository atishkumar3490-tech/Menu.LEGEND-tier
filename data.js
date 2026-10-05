/* =========================================
   DATA.JS - Kavya Family Restaurant Menu
   ========================================= */

const GITHUB_BASE = "https://raw.githubusercontent.com/atishkumar3490-tech/Menu.LEGEND-tier/main/";

// Categories using YOUR GitHub Images
const categories = [
    { id: 'All', name: 'All', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
    { id: 'Chicken', name: 'Chicken', img: `${GITHUB_BASE}cat-chicken-1.jpg` },
    { id: 'Kebab', name: 'Kebab', img: `${GITHUB_BASE}cat-starter-1.jpg` },
    { id: 'Veg Curry', name: 'Veg Curry', img: `${GITHUB_BASE}cat-curry-1.jpg` },
    { id: 'Paneer', name: 'Paneer', img: `${GITHUB_BASE}cat-paneer-1.jpg` },
    { id: 'Rice', name: 'Rice & Biryani', img: `${GITHUB_BASE}cat-biryani-1.jpg` },
    { id: 'Roti', name: 'Breads', img: `${GITHUB_BASE}cat-rolls-1.jpg` } // Using rolls img as placeholder for breads
];

// Actual Menu from your Instagram Photo (HD Images added for premium feel)
const menuItems = [
    // --- CHICKEN ---
    { id: 'c1', category: 'Chicken', name: 'Chicken Curry', price: 160, veg: false, meta: '⚡ 20-25 mins', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'c2', category: 'Chicken', name: 'Chicken Butter Masala', price: 180, veg: false, meta: '⚡ 20-25 mins', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { id: 'c3', category: 'Chicken', name: 'Chicken Dehati', price: 480, veg: false, meta: '⚡ 30-35 mins | Bestseller', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' },
    
    // --- KEBAB & STARTERS ---
    { id: 'k1', category: 'Kebab', name: 'Chicken Tandoori (Half)', price: 180, veg: false, meta: '⚡ 15-20 mins', img: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&q=80' },
    { id: 'k2', category: 'Kebab', name: 'Chicken Tikka', price: 130, veg: false, meta: '⚡ 15-20 mins', img: 'https://images.unsplash.com/photo-1597289124948-688c1a35cb48?w=800&q=80' },
    { id: 'k3', category: 'Kebab', name: 'Paneer Tikka', price: 120, veg: true, meta: '⚡ 15-20 mins', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },

    // --- VEG CURRY & PANEER ---
    { id: 'v1', category: 'Veg Curry', name: 'Mix Veg', price: 120, veg: true, meta: '⚡ 20-25 mins', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'v2', category: 'Paneer', name: 'Paneer Butter Masala', price: 160, veg: true, meta: '⚡ 20-25 mins | Bestseller', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&q=80' },
    { id: 'v3', category: 'Paneer', name: 'Mutter Paneer', price: 150, veg: true, meta: '⚡ 20-25 mins', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80' },
    { id: 'v4', category: 'Veg Curry', name: 'Mashroom Masala', price: 160, veg: true, meta: '⚡ 20-25 mins', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },

    // --- RICE & BREADS ---
    { id: 'r1', category: 'Rice', name: 'Jeera Rice (Half)', price: 80, veg: true, meta: '⚡ 10-15 mins', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80' },
    { id: 'r2', category: 'Rice', name: 'Paneer Pulav (Half)', price: 100, veg: true, meta: '⚡ 15-20 mins', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' },
    { id: 'b1', category: 'Roti', name: 'Butter Naan', price: 35, veg: true, meta: '⚡ 10 mins', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b2', category: 'Roti', name: 'Tandoori Butter Roti', price: 25, veg: true, meta: '⚡ 10 mins', img: 'https://images.unsplash.com/photo-1610192305530-9eb4c01740fb?w=800&q=80' }
];

const INSTAGRAM_LINK = "https://www.instagram.com/kavyafamilyrestaurant?stkn=MWNxZ3hjMzR1eGJ0eQ==";
