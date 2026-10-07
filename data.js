/* ==========================================================
   DATA.JS - Enterprise Admin Settings & Master Database
   ========================================================== */

// 👑 ADMIN SETTINGS
const APP_CONFIG = {
    restaurant_name: "Kavya Family Restaurant",
    upi_id: 'merchant@upi',       // <--- ENTER YOUR UPI ID HERE
    gst_rate: 0.05,               
    free_delivery_threshold: 199, 
    delivery_fee: 30,             
    admin_phone: '+919999999999',
    instagram_url: 'https://www.instagram.com/kavyafamilyrestaurant?stkn=MWNxZ3hjMzR1eGJ0eQ==',
    coin_reward_min: 10,
    coin_reward_max: 50,
    max_discount_percentage: 0.10, 
    order_tracking_enabled: true  
};

// 📂 HORIZONTAL MENU ICONS (Updated for Both Pages)
const categories = [
    { id: 'All', name: 'All', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
    { id: 'Biryani', name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' }, 
    { id: 'Rolls', name: 'Rolls', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=200&q=80' },
    { id: 'Chinese', name: 'Chowmein & Chilli', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&q=80' },
    { id: 'Starters', name: 'Starters', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&q=80' }, 
    { id: 'Chicken', name: 'Chicken', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=200&q=80' }, 
    { id: 'Veg', name: 'Paneer & Veg', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=200&q=80' }, 
    { id: 'Dal', name: 'Dal', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' },
    { id: 'RotiRice', name: 'Roti & Rice', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80' }
];

// 🍔 FULL ENTERPRISE MENU DATABASE (Page 1 + Page 2 Fully Mapped in English)
const menuItems = [

    // ==========================================
    // PAGE 2: BIRYANI (बिरयानी)
    // ==========================================
    { id: 'bir1', category: 'Biryani', name: 'Special Chicken Biryani', price: 180, strikePrice: 220, veg: false, needsSpice: true, variants: [{ size: 'Full', price: 180 }], meta: '⚡ 20 mins', rating: '4.9', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' },
    { id: 'bir2', category: 'Biryani', name: 'Special Veg Biryani', price: 200, strikePrice: 250, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 200 }], meta: '⚡ 20 mins | Paneer, Mushroom, Kaju', rating: '4.8', img: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=800&q=80' },
    { id: 'bir3', category: 'Biryani', name: 'Veg Biryani', price: 140, strikePrice: 180, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 140 }], meta: '⚡ 15-20 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80' },

    // ==========================================
    // PAGE 2: ROLLS (रोल)
    // ==========================================
    { id: 'rl1', category: 'Rolls', name: 'Double Egg Double Chicken Roll', price: 120, strikePrice: 150, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 120 }], meta: '⚡ 10-15 mins | Heavy', rating: '4.9', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl2', category: 'Rolls', name: 'Chicken Cheese Egg Roll', price: 140, strikePrice: 170, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 140 }], meta: '⚡ 15 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl3', category: 'Rolls', name: 'Double Egg Chicken Roll', price: 100, strikePrice: 130, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 100 }], meta: '⚡ 10 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl4', category: 'Rolls', name: 'Single Egg Chicken Roll', price: 90, strikePrice: 110, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 90 }], meta: '⚡ 10 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl5', category: 'Rolls', name: 'Plain Chicken Roll', price: 80, strikePrice: 100, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 80 }], meta: '⚡ 10 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl6', category: 'Rolls', name: 'Double Egg Paneer Roll', price: 90, strikePrice: 110, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 90 }], meta: '⚡ 10 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl7', category: 'Rolls', name: 'Single Egg Paneer Roll', price: 80, strikePrice: 100, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 80 }], meta: '⚡ 10 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl8', category: 'Rolls', name: 'Paneer Roll', price: 70, strikePrice: 90, veg: true, needsSpice: true, variants: [{ size: '1 Pc', price: 70 }], meta: '⚡ 10 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl9', category: 'Rolls', name: 'Double Egg Roll', price: 70, strikePrice: 90, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 70 }], meta: '⚡ 10 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl10', category: 'Rolls', name: 'Single Egg Roll', price: 60, strikePrice: 80, veg: false, needsSpice: true, variants: [{ size: '1 Pc', price: 60 }], meta: '⚡ 10 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl11', category: 'Rolls', name: 'Veg Roll', price: 50, strikePrice: 70, veg: true, needsSpice: true, variants: [{ size: '1 Pc', price: 50 }], meta: '⚡ 10 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'rl12', category: 'Rolls', name: 'Manchurian Roll', price: 70, strikePrice: 90, veg: true, needsSpice: true, variants: [{ size: '1 Pc', price: 70 }], meta: '⚡ 10 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },

    // ==========================================
    // PAGE 2: CHOWMEIN & CHILLI (चौमिन & चिल्ली)
    // ==========================================
    { id: 'chw1', category: 'Chinese', name: 'Chicken Chowmein', price: 100, strikePrice: 130, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 100 }, { size: 'Full', price: 200 }], meta: '⚡ Wok Tossed', rating: '4.8', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
    { id: 'chw2', category: 'Chinese', name: 'Mix Non-Veg Chowmein', price: 120, strikePrice: 150, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 120 }, { size: 'Full', price: 240 }], meta: '⚡ Loaded with Egg & Chicken', rating: '4.9', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
    { id: 'chw3', category: 'Chinese', name: 'Egg Chowmein', price: 70, strikePrice: 100, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 70 }, { size: 'Full', price: 140 }], meta: '⚡ Street Style', rating: '4.6', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
    { id: 'chw4', category: 'Chinese', name: 'Paneer Chowmein', price: 80, strikePrice: 110, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 80 }, { size: 'Full', price: 160 }], meta: '⚡ Wok Tossed', rating: '4.7', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
    { id: 'chw5', category: 'Chinese', name: 'Veg Chowmein', price: 60, strikePrice: 80, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 60 }, { size: 'Full', price: 120 }], meta: '⚡ Classic', rating: '4.5', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },
    
    { id: 'chl1', category: 'Chinese', name: 'Chicken Chilli Boneless', price: 110, strikePrice: 150, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 110 }, { size: 'Full', price: 200 }], meta: '⚡ Sweet & Spicy', rating: '4.8', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' },
    { id: 'chl2', category: 'Chinese', name: 'Chicken Chilli Bone', price: 110, strikePrice: 150, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 110 }, { size: 'Full', price: 200 }], meta: '⚡ Desi Chinese', rating: '4.6', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' },
    { id: 'chl3', category: 'Chinese', name: 'Paneer Chilli', price: 100, strikePrice: 130, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 100 }, { size: 'Full', price: 190 }], meta: '⚡ Chef Special', rating: '4.7', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'chl4', category: 'Chinese', name: 'Mushroom Chilli', price: 120, strikePrice: 150, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 120 }, { size: 'Full', price: 220 }], meta: '⚡ Crispy Fried', rating: '4.6', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'chl5', category: 'Chinese', name: 'Veg Manchurian', price: 70, strikePrice: 100, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 70 }, { size: 'Full', price: 140 }], meta: '⚡ Tangy Gravy', rating: '4.5', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80' },

    // ==========================================
    // PAGE 2: FRIED RICE (फ्राइड राइस)
    // ==========================================
    { id: 'fr1', category: 'Chinese', name: 'Chicken Fried Rice', price: 100, strikePrice: 140, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 100 }, { size: 'Full', price: 200 }], meta: '⚡ Wok Tossed', rating: '4.8', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80' },
    { id: 'fr2', category: 'Chinese', name: 'Mix Non-Veg Fried Rice', price: 120, strikePrice: 160, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 120 }, { size: 'Full', price: 200 }], meta: '⚡ Loaded', rating: '4.9', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80' },
    { id: 'fr3', category: 'Chinese', name: 'Egg Fried Rice', price: 100, strikePrice: 130, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 100 }, { size: 'Full', price: 180 }], meta: '⚡ Quick Bite', rating: '4.6', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80' },
    { id: 'fr4', category: 'Chinese', name: 'Paneer Fried Rice', price: 90, strikePrice: 120, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 90 }, { size: 'Full', price: 180 }], meta: '⚡ Soft Paneer Chunks', rating: '4.7', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80' },
    { id: 'fr5', category: 'Chinese', name: 'Mix Veg Fried Rice', price: 100, strikePrice: 130, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 100 }, { size: 'Full', price: 200 }], meta: '⚡ Healthy', rating: '4.5', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80' },
    { id: 'fr6', category: 'Chinese', name: 'Veg Fried Rice', price: 80, strikePrice: 110, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 80 }, { size: 'Full', price: 160 }], meta: '⚡ Classic', rating: '4.4', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80' },

    // ==========================================
    // PAGE 2: STARTERS (स्टार्टर)
    // ==========================================
    { id: 'st1', category: 'Starters', name: 'Chicken Lollypop', price: 260, strikePrice: 320, veg: false, needsSpice: true, variants: [{ size: '6 Pcs', price: 260 }], meta: '⚡ Deep Fried Crispy', rating: '4.9', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' },
    { id: 'st2', category: 'Starters', name: 'Chicken Chilli Dry', price: 260, strikePrice: 300, veg: false, needsSpice: true, variants: [{ size: 'Full', price: 260 }], meta: '⚡ Perfect Snack', rating: '4.8', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'st3', category: 'Starters', name: 'Baby Corn', price: 200, strikePrice: 240, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 200 }], meta: '⚡ Crispy', rating: '4.6', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'st4', category: 'Starters', name: 'Paneer Pakoda', price: 140, strikePrice: 180, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 140 }], meta: '⚡ Indian Classic', rating: '4.7', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'st5', category: 'Starters', name: 'Paneer Chilli Dry', price: 210, strikePrice: 250, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 210 }], meta: '⚡ Spicy Tossed', rating: '4.8', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'st6', category: 'Starters', name: 'Mushroom Chilli Dry', price: 250, strikePrice: 290, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 250 }], meta: '⚡ Wok Tossed', rating: '4.7', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'st7', category: 'Starters', name: 'Paneer Tikka (Dry)', price: 240, strikePrice: 280, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 240 }], meta: '⚡ Tandoor Grilled', rating: '4.8', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },

    // ==========================================
    // PAGE 2: DAL (दाल)
    // ==========================================
    { id: 'dl1', category: 'Dal', name: 'Dal Makhani', price: 200, strikePrice: 240, veg: true, needsSpice: false, variants: [{ size: 'Full', price: 200 }], meta: '⚡ Creamy & Rich', rating: '4.9', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'dl2', category: 'Dal', name: 'Punjabi Dal', price: 160, strikePrice: 190, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 160 }], meta: '⚡ Authentic Dhaba Style', rating: '4.7', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'dl3', category: 'Dal', name: 'Dal Tadka', price: 120, strikePrice: 150, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 120 }], meta: '⚡ Desi Ghee Tadka', rating: '4.6', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'dl4', category: 'Dal', name: 'Dal Butter Fry', price: 120, strikePrice: 150, veg: true, needsSpice: false, variants: [{ size: 'Full', price: 120 }], meta: '⚡ Amul Butter Roasted', rating: '4.5', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'dl5', category: 'Dal', name: 'Dal Fry', price: 100, strikePrice: 130, veg: true, needsSpice: true, variants: [{ size: 'Full', price: 100 }], meta: '⚡ Simple & Tasty', rating: '4.4', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'dl6', category: 'Dal', name: 'Plain Dal', price: 80, strikePrice: 100, veg: true, needsSpice: false, variants: [{ size: 'Full', price: 80 }], meta: '⚡ Homestyle', rating: '4.2', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },


    // ==========================================
    // PAGE 1: CHICKEN CURRY
    // ==========================================
    { id: 'c1', category: 'Chicken', name: 'Chicken Curry', price: 160, strikePrice: 220, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 20 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'c2', category: 'Chicken', name: 'Chicken Karahi', price: 180, strikePrice: 240, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 330 }], meta: '⚡ 25 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'c3', category: 'Chicken', name: 'Chicken Do Pyaza', price: 170, strikePrice: 230, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 170 }, { size: 'Full', price: 300 }], meta: '⚡ 20 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80' },
    { id: 'c4', category: 'Chicken', name: 'Chicken Handi', price: 190, strikePrice: 260, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 190 }, { size: 'Full', price: 350 }], meta: '⚡ 25 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1627308595229-7830f5c922b1?w=800&q=80' },
    { id: 'c5', category: 'Chicken', name: 'Chicken Butter Masala', price: 180, strikePrice: 250, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 330 }], meta: '⚡ 25 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { id: 'c6', category: 'Chicken', name: 'Chicken Masala', price: 200, strikePrice: 280, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 200 }, { size: 'Full', price: 380 }], meta: '⚡ 30 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'c7', category: 'Chicken', name: 'Chicken Tikka Masala', price: 190, strikePrice: 260, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 190 }, { size: 'Full', price: 350 }], meta: '⚡ 25 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' },
    { id: 'c9', category: 'Chicken', name: 'Chicken Tikka Butter Masala', price: 200, strikePrice: 270, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 200 }, { size: 'Full', price: 370 }], meta: '⚡ 30 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
    { id: 'c8', category: 'Chicken', name: 'Chicken Dehati', price: 480, strikePrice: 550, veg: false, needsSpice: true, variants: [{ size: 'Full', price: 480 }], meta: '⚡ Bestseller', rating: '4.9', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=800&q=80' },

    // ==========================================
    // PAGE 1: KEBAB
    // ==========================================
    { id: 'k1', category: 'Kebab', name: 'Chicken Tandoori', price: 180, strikePrice: 240, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 350 }], meta: '⚡ Charcoal Grilled', rating: '4.8', img: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&q=80' },
    { id: 'k2', category: 'Kebab', name: 'Chicken Tikka', price: 130, strikePrice: 180, veg: false, needsSpice: true, variants: [{ size: 'Half', price: 130 }, { size: 'Full', price: 220 }], meta: '⚡ 15 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1597289124948-688c1a35cb48?w=800&q=80' },
    { id: 'k3', category: 'Kebab', name: 'Chicken Leg Kabab', price: 270, strikePrice: 320, veg: false, needsSpice: true, variants: [{ size: 'Full', price: 270 }], meta: '⚡ 20 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&q=80' },
    
    // ==========================================
    // PAGE 1: VEG CURRY & PANEER
    // ==========================================
    { id: 'v1', category: 'Veg', name: 'Mix Veg', price: 120, strikePrice: 160, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 120 }, { size: 'Full', price: 200 }], meta: '⚡ Healthy', rating: '4.2', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'p3', category: 'Veg', name: 'Paneer Karahi', price: 150, strikePrice: 200, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 150 }, { size: 'Full', price: 260 }], meta: '⚡ 20 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&q=80' },
    { id: 'p6', category: 'Veg', name: 'Paneer Do Pyaza', price: 140, strikePrice: 190, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 140 }, { size: 'Full', price: 250 }], meta: '⚡ 20 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80' },
    { id: 'p4', category: 'Veg', name: 'Paneer Handi', price: 160, strikePrice: 210, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 20 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80' },
    { id: 'p7', category: 'Veg', name: 'Paneer Masala', price: 140, strikePrice: 190, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 140 }, { size: 'Full', price: 240 }], meta: '⚡ 20 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'p1', category: 'Veg', name: 'Paneer Butter Masala', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ Sweet & Rich', rating: '4.9', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&q=80' },
    { id: 'p5', category: 'Veg', name: 'Paneer Tikka Masala', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 25 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' },
    { id: 'p2', category: 'Veg', name: 'Mutter Paneer', price: 150, strikePrice: 200, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 150 }, { size: 'Full', price: 270 }], meta: '⚡ 20 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80' },
    { id: 'v2', category: 'Veg Curry', name: 'Mushroom Masala', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 20 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v3', category: 'Veg Curry', name: 'Mushroom Butter Masala', price: 170, strikePrice: 230, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 170 }, { size: 'Full', price: 290 }], meta: '⚡ 20 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=800&q=80' },
    { id: 'v4', category: 'Veg Curry', name: 'Mushroom Mutter Masala', price: 180, strikePrice: 240, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 300 }], meta: '⚡ 25 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'v5', category: 'Veg Curry', name: 'Mushroom Karahi', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 300 }], meta: '⚡ 20 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v6', category: 'Veg Curry', name: 'Mushroom Handi', price: 170, strikePrice: 230, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 170 }, { size: 'Full', price: 300 }], meta: '⚡ 25 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v7', category: 'Veg Curry', name: 'Mushroom Do Pyaza', price: 160, strikePrice: 220, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 160 }, { size: 'Full', price: 280 }], meta: '⚡ 25 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },
    { id: 'v8', category: 'Veg Curry', name: 'Mushroom Tikka Masala', price: 180, strikePrice: 240, veg: true, needsSpice: true, variants: [{ size: 'Half', price: 180 }, { size: 'Full', price: 320 }], meta: '⚡ 25 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1582285141940-02ebcb7c7390?w=800&q=80' },

    // ==========================================
    // PAGE 1: RICE & ROTI
    // ==========================================
    { id: 'r2', category: 'RotiRice', name: 'Steam Rice', price: 60, strikePrice: 80, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 60 }, { size: 'Full', price: 120 }], meta: '⚡ 10 mins', rating: '4.0', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80' },
    { id: 'r1', category: 'RotiRice', name: 'Jeera Rice', price: 80, strikePrice: 100, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 80 }, { size: 'Full', price: 130 }], meta: '⚡ 10 mins', rating: '4.4', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80' },
    { id: 'r5', category: 'RotiRice', name: 'Mutter Pulav', price: 70, strikePrice: 90, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 70 }, { size: 'Full', price: 140 }], meta: '⚡ 15 mins', rating: '4.2', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80' },
    { id: 'r4', category: 'RotiRice', name: 'Veg Pulav', price: 90, strikePrice: 120, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 90 }, { size: 'Full', price: 140 }], meta: '⚡ 15 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    { id: 'r3', category: 'RotiRice', name: 'Paneer Pulav', price: 100, strikePrice: 130, veg: true, needsSpice: false, variants: [{ size: 'Half', price: 100 }, { size: 'Full', price: 160 }], meta: '⚡ 15 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' },
    { id: 'b4', category: 'RotiRice', name: 'Lachha Paratha', price: 25, strikePrice: 35, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 25 }], meta: '⚡ 5-10 mins', rating: '4.7', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
    { id: 'b8', category: 'RotiRice', name: 'Tandoori Roti', price: 20, strikePrice: 30, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 20 }], meta: '⚡ 5 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1610192305530-9eb4c01740fb?w=800&q=80' },
    { id: 'b3', category: 'RotiRice', name: 'Tandoori Butter Roti', price: 25, strikePrice: 35, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 25 }], meta: '⚡ 5 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1610192305530-9eb4c01740fb?w=800&q=80' },
    { id: 'b7', category: 'RotiRice', name: 'Plain Naan', price: 30, strikePrice: 40, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 30 }], meta: '⚡ 5 mins', rating: '4.3', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b1', category: 'RotiRice', name: 'Butter Naan', price: 35, strikePrice: 45, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 35 }], meta: '⚡ 5-10 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b2', category: 'RotiRice', name: 'Garlic Naan', price: 70, strikePrice: 90, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 70 }], meta: '⚡ 5-10 mins', rating: '4.9', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'b5', category: 'RotiRice', name: 'Paneer Kulcha', price: 80, strikePrice: 100, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 80 }], meta: '⚡ 10 mins', rating: '4.8', img: 'https://images.unsplash.com/photo-1626779836928-8671ebfb447b?w=800&q=80' },
    { id: 'b6', category: 'RotiRice', name: 'Onion Kulcha', price: 50, strikePrice: 65, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 50 }], meta: '⚡ 10 mins', rating: '4.5', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b9', category: 'RotiRice', name: 'Stuffed Naan', price: 60, strikePrice: 80, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 60 }], meta: '⚡ 10 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { id: 'b10', category: 'RotiRice', name: 'Stuffed Paratha', price: 60, strikePrice: 80, veg: true, needsSpice: false, variants: [{ size: 'Per Piece', price: 60 }], meta: '⚡ 10 mins', rating: '4.6', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' }
];
