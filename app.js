/* ==========================================================
   APP.JS - Enterprise State Management, Cart & Firebase Engine
   (With QR Table Scanner / Dine-in Mode)
   ========================================================== */

// 🛡️ FAILSAFE UI OBJECT (Crash Guard)
if (typeof window.UI === 'undefined') {
    window.UI = {
        showToast: (msg) => alert(msg),
        toggleBookmark: (el) => el.classList.toggle('bookmarked'),
        openPopup: (id) => {
            const el = document.getElementById(id);
            if(el) { el.style.display = 'flex'; setTimeout(() => el.classList.add('open'), 10); }
        },
        closePopup: (id) => {
            const el = document.getElementById(id);
            if(el) { el.classList.remove('open'); setTimeout(() => el.style.display = 'none', 300); }
        }
    };
}

// Global Error Catcher to prevent blank screens
window.onerror = function(msg, url, line) {
    console.error("App Error:", msg, "at line", line);
    if(typeof UI !== 'undefined' && UI.showToast) UI.showToast("System syncing... Please wait.", "error");
    return true; 
};

// 🪑 QR TABLE SCANNER ENGINE
// Reads ?table=5 from the URL (e.g. https://yoursite.com/?table=5).
// The table number is also kept in sessionStorage, so a page refresh or
// navigation inside the app does not lose it. Scanning another table's
// QR code simply overrides it. No ?table= and nothing stored = normal Delivery app.
const TableMode = (function () {
    const STORE_KEY = 'kavya_table_number';

    // Only allow short, safe values (digits/letters/dash), e.g. "5", "12", "A3"
    function sanitize(value) {
        if (value === null || value === undefined) return null;
        const v = String(value).trim();
        return /^[A-Za-z0-9-]{1,8}$/.test(v) ? v : null;
    }

    let number = null;

    try {
        const fromUrl = sanitize(new URLSearchParams(window.location.search).get('table'));
        if (fromUrl) {
            number = fromUrl;
            try { sessionStorage.setItem(STORE_KEY, fromUrl); } catch (e) {}
        } else {
            number = sanitize(sessionStorage.getItem(STORE_KEY));
        }
    } catch (e) {
        console.error("Table QR parse error:", e);
    }

    return {
        number: number,          // string, e.g. "5"
        active: !!number,
        // Value saved to the database: a real Number for "5", text for labels like "A3"
        dbValue: function () {
            if (!this.active) return null;
            return /^\d+$/.test(this.number) ? parseInt(this.number, 10) : this.number;
        },
        clear: function () {
            try { sessionStorage.removeItem(STORE_KEY); } catch (e) {}
            this.number = null;
            this.active = false;
        }
    };
})();
window.TableMode = TableMode;

// Hides delivery/map sections and shows a "Table X" chip when in table mode
function applyTableMode() {
    if (!TableMode.active) return;

    document.body.classList.add('table-mode');

    // Hide any delivery address / map / location blocks that exist in your HTML.
    // Add `class="delivery-only"` (or data-delivery-only) to any other section you want hidden.
    if (!document.getElementById('table-mode-style')) {
        const style = document.createElement('style');
        style.id = 'table-mode-style';
        style.textContent = `
            body.table-mode .delivery-only,
            body.table-mode [data-delivery-only],
            body.table-mode #delivery-address-section,
            body.table-mode #address-section,
            body.table-mode #map-section,
            body.table-mode #location-section,
            body.table-mode #gps-status-badge { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // Small floating chip so the customer always sees which table they are at
    if (!document.getElementById('table-mode-chip')) {
        const chip = document.createElement('div');
        chip.id = 'table-mode-chip';
        chip.style.cssText = 'position:fixed; top:10px; left:50%; transform:translateX(-50%); background:#d4af37; color:#000; padding:6px 16px; border-radius:50px; font-weight:900; font-size:12px; z-index:998; box-shadow:0 4px 14px rgba(0,0,0,0.4); pointer-events:none;';
        chip.innerHTML = `<i class="fa-solid fa-chair"></i> Table ${TableMode.number}`;
        document.body.appendChild(chip);
    }
}

// 🔥 FIREBASE ENTERPRISE ENGINE
let db = null;
const firebaseConfig = {
    apiKey: "AIzaSyBsP14Fn5iyr_y8KVODcBPxFxPyrSyzAzQ",
    authDomain: "kavya-rsturant.firebaseapp.com",
    projectId: "kavya-rsturant",
    storageBucket: "kavya-rsturant.firebasestorage.app",
    messagingSenderId: "828437773467",
    appId: "1:828437773467:web:914fc4b67de7b96d55da3e"
};

async function initFirebase() {
    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
        const { getFirestore, collection, addDoc, serverTimestamp, query, where, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        const app = initializeApp(firebaseConfig);
        window.db = getFirestore(app);
        window.fbAddDoc = addDoc;
        window.fbCollection = collection;
        window.fbServerTimestamp = serverTimestamp;
        window.fbQuery = query;
        window.fbWhere = where;
        window.fbOnSnapshot = onSnapshot;
        console.log("🔥 Firebase DB Connected Successfully!");
    } catch (e) {
        console.error("Firebase Engine Error:", e);
    }
}
initFirebase();

// 👑 AUTHENTICATION MANAGER
class AuthManager {
    constructor() {
        this.user = localStorage.getItem('kavya_user_name') || null;
        this.phone = localStorage.getItem('kavya_user_phone') || null;
        this.coins = parseInt(localStorage.getItem('kavya_coins') || 50);
        this.profilePic = localStorage.getItem('kavya_profile_pic') || "https://ui-avatars.com/api/?name=VIP&background=d4af37&color=000";
    }

    login(name, phone) {
        if (!name.trim() || phone.length !== 10) {
            if(typeof UI !== 'undefined' && UI.showToast) {
                UI.showToast("Please enter a valid Name & 10-digit Mobile number.", "error");
            } else {
                alert("Please enter a valid Name & 10-digit Mobile number.");
            }
            return false;
        }
        this.user = name;
        this.phone = phone;
        localStorage.setItem('kavya_user_name', name);
        localStorage.setItem('kavya_user_phone', phone);
        if (!localStorage.getItem('kavya_coins')) {
            localStorage.setItem('kavya_coins', 50);
        }
        
        if(typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast(`Welcome to Kavya VIP, ${name}!`);
        }
        setTimeout(() => location.reload(), 1000);
        return true;
    }

    logout() {
        localStorage.clear();
        location.reload();
    }

    earnCoins(amount) {
        this.coins += amount;
        localStorage.setItem('kavya_coins', this.coins);
        return this.coins;
    }

    deductCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            localStorage.setItem('kavya_coins', this.coins);
            return true;
        }
        return false;
    }
}

// 🛒 ADVANCED CART ENGINE
class CartEngine {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('kavya_cart') || '[]');
        this.address = localStorage.getItem('kavya_address') || "";
        this.gpsLink = localStorage.getItem('kavya_gps') || "";
    }

    addItem(menuItem, variantSize, exactPrice, spiceLevel) {
        try {
            const existingIdx = this.items.findIndex(i => i.id === menuItem.id && i.variant === variantSize && i.spice === spiceLevel);
            if (existingIdx > -1) {
                this.items[existingIdx].quantity += 1;
            } else {
                this.items.push({ 
                    ...menuItem, 
                    quantity: 1, 
                    variant: variantSize, 
                    price: exactPrice, 
                    spice: spiceLevel || 'None' 
                });
            }
            this.saveState();
        } catch(e) { console.error("Add Item Error:", e); }
    }

    updateQty(itemId, variant, spice, amount) {
        try {
            const idx = this.items.findIndex(i => i.id === itemId && i.variant === variant && i.spice === spice);
            if (idx > -1) {
                this.items[idx].quantity += amount;
                if (this.items[idx].quantity <= 0) this.items.splice(idx, 1);
                this.saveState();
            }
        } catch(e) { console.error("Update Qty Error:", e); }
    }

    getTotals() {
        let subtotal = this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        
        // 5% GST and Delivery Logic
        let gst = Math.floor(subtotal * 0.05);

        // 🪑 QR TABLE: no delivery fee when dining in at a table
        let delivery = TableMode.active ? 0 : (subtotal >= 199 ? 0 : 30);
        
        return { 
            subtotal, 
            gst, 
            delivery, 
            totalBeforeDiscount: subtotal + gst + delivery 
        };
    }

    clearCart() {
        this.items = [];
        this.saveState();
    }

    saveState() {
        localStorage.setItem('kavya_cart', JSON.stringify(this.items));
    }
}

// Global Instances
window.Auth = new AuthManager();
window.Cart = new CartEngine();

// --- APP INITIALIZATION ---
let currentCategory = 'All';
let tableGuests = 2;

document.addEventListener('DOMContentLoaded', () => {
    // 🪑 QR TABLE: apply table mode first so the UI is correct from the start
    try { applyTableMode(); } catch(e) { console.error("Table Mode Error:", e); }

    // Basic Inits
    try { setupTopHeader(); } catch(e){}
    try { if(typeof categories !== 'undefined') renderCategories(); } catch(e){}
    try { if(typeof menuItems !== 'undefined') renderMenu(); } catch(e){}

    updateCartBadge();
    renderAuthPage();
    checkDiningStatus(); // Shows Pending Dining Status if exists

    // Show persistent tracking banner if order is active
    try { showActiveOrderBanner(); } catch(e){}

    // 🚀 AUTO SLIDER LOGIC (Properly integrated here)
    try {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        if(slides.length > 0) {
            setInterval(() => {
                slides[currentSlide].classList.add('hidden-slide');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.remove('hidden-slide');
            }, 3500);
        }
    } catch(e) { console.error("Slider Init Error", e); }
});

// 📌 PERSISTENT ORDER BANNER LOGIC
window.showActiveOrderBanner = function() {
    let orderStr = localStorage.getItem('kavya_active_order');
    if(!orderStr) return;
    
    let order = JSON.parse(orderStr);
    let banner = document.getElementById('active-order-banner');
    
    if(!banner) {
        banner = document.createElement('div');
        banner.id = 'active-order-banner';
        // Placed just above the Zomato bottom navbar
        banner.style.cssText = 'position:fixed; bottom:80px; left:15px; right:15px; background:linear-gradient(135deg, #00c6ff, #0072ff); color:#fff; padding:15px 20px; border-radius:16px; font-weight:800; display:flex; justify-content:space-between; align-items:center; z-index:999; box-shadow:0 8px 25px rgba(0, 114, 255, 0.4); cursor:pointer; font-size: 14px;';
        
        banner.onclick = () => launchLiveTracking(order.id);
        document.body.appendChild(banner);
    }

    // 🪑 QR TABLE: show table number on the banner for dine-in orders
    const isDineIn = order.tableNumber !== null && order.tableNumber !== undefined;
    const tableTxt = isDineIn ? ` • Table ${order.tableNumber}` : '';

    banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="background:#fff; color:#0072ff; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center;">
                <i class="fa-solid ${isDineIn ? 'fa-utensils' : 'fa-motorcycle'}"></i>
            </div> 
            <span>Track Order ${order.id}${tableTxt}</span>
        </div> 
        <i class="fa-solid fa-chevron-right"></i>`;
};

function setupTopHeader() {
    if (Auth.user) {
        const picEl = document.getElementById('nav-profile-pic');
        if(picEl) picEl.src = Auth.profilePic;
        
        const coinEl = document.getElementById('top-coin-bal');
        if(coinEl) coinEl.innerText = Auth.coins;
    }
    const hr = new Date().getHours();
    const g = hr < 12 ? "Good Morning" : hr < 16 ? "Good Afternoon" : "Good Evening";
    const greetEl = document.getElementById('dynamic-greeting');
    if(greetEl) greetEl.innerText = `${g}, ${Auth.user || 'Legend'}!`;
}

function renderCategories() {
    const cont = document.getElementById('category-scroll-container');
    if (!cont) return;
    cont.innerHTML = '';
    categories.forEach(cat => {
        cont.innerHTML += `
            <div class="z-cat-item ${cat.id === 'All' ? 'active' : ''}" onclick="setCategory('${cat.id}', this)">
                <div class="z-cat-icon"><img src="${cat.img}" loading="lazy"></div>
                <span>${cat.name}</span>
            </div>`;
    });
}

window.setCategory = function(id, el) {
    currentCategory = id;
    document.querySelectorAll('.z-cat-item').forEach(b => b.classList.remove('active'));
    if(el) el.classList.add('active');
    renderMenu();
};

window.filterMenu = function() { 
    renderMenu(); 
};

// 🧠 SAFE ACTION HANDLER (Guarantees ADD button won't freeze)
window.safeAction = function(type, id) {
    try {
        if (type === 'smart') openSmartSelector(id);
        else if (type === 'add') addDirectly(id);
        else if (type === 'qty') updateQtyDirect(id);
    } catch (e) {
        console.error("Action Error:", e);
    }
};

function renderMenu() {
    const searchEl = document.getElementById('main-search');
    const search = searchEl ? searchEl.value.toLowerCase() : '';
    const container = document.getElementById('menu-items-container');
    if(!container) return;
    
    container.innerHTML = '';

    const filtered = menuItems.filter(i => (currentCategory === 'All' || i.category === currentCategory) && i.name.toLowerCase().includes(search));
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 20px;">
                <i class="fa-solid fa-utensils" style="font-size:40px; color:#333; margin-bottom:15px;"></i>
                <h3 style="color:#888;">No dishes found</h3>
            </div>`;
        return;
    }

    filtered.forEach(item => {
        const cartItems = Cart.items.filter(i => i.id === item.id);
        const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);
        
        const vegColor = item.veg ? 'var(--z-green)' : 'var(--z-red)';
        const displayStrike = item.strikePrice ? `<span style="text-decoration: line-through; color: #888; font-size: 12px; margin-right: 5px;">₹${item.strikePrice}</span>` : '';
        const needsSmartPopup = (item.variants && item.variants.length > 1) || item.needsSpice;

        let actionBtn = totalQty > 0 
            ? `<div class="z-qty-box" style="background:var(--z-gold); color:#000; border:none;" onclick="safeAction('${needsSmartPopup ? 'smart' : 'qty'}', '${item.id}')">
                <span style="font-weight:900; margin:0 10px;">${totalQty} Added</span> 
                <i class="fa-solid fa-pen-to-square text-xs"></i>
               </div>`
            : `<button class="z-add-btn" onclick="safeAction('${needsSmartPopup ? 'smart' : 'add'}', '${item.id}')">
                ADD <i class="fa-solid fa-plus text-xs" style="margin-left:4px;"></i>
               </button>`;

        container.innerHTML += `
        <div class="z-food-card">
            <div class="z-food-img-box">
                <img src="${item.img}" loading="lazy">
                <div class="z-bookmark-btn" onclick="UI.toggleBookmark(this)">
                    <i class="fa-regular fa-bookmark"></i>
                </div>
            </div>
            <div class="z-food-info">
                <div class="z-food-details">
                    <div class="z-veg-dot" style="border: 1px solid ${vegColor};">
                        <div class="z-veg-inner" style="background:${vegColor};"></div>
                    </div>
                    <h3 class="z-food-title">${item.name}</h3>
                    <div class="z-rating-tag"><i class="fa-solid fa-star"></i> ${item.rating}</div>
                    <div class="text-xs text-muted font-weight-600">${item.meta}</div>
                    <div class="z-food-price">${displayStrike}₹${item.price}</div>
                </div>
                <div>${actionBtn}</div>
            </div>
        </div>`;
    });
}

window.addDirectly = function(id) {
    if (!Auth.user) { 
        if(typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast("Login required to order!", "error"); 
        }
        return openPage('login-page'); 
    }
    const item = menuItems.find(i => i.id === id);
    const variant = item.variants ? item.variants[0] : {size: 'Regular', price: item.price};
    
    Cart.addItem(item, variant.size, variant.price, 'None');
    updateCartBadge();
    renderMenu();
    
    if(typeof UI !== 'undefined' && UI.showToast) {
        UI.showToast(`Added ${item.name} to cart`);
    }
};

window.updateQtyDirect = function(id) {
    if (!Auth.user) return;
    const item = Cart.items.find(i => i.id === id);
    if(item) {
        Cart.updateQty(item.id, item.variant, item.spice, 1);
        updateCartBadge();
        renderMenu();
    }
};

// 🚀 DYNAMIC SMART POPUP INJECTOR
window.openSmartSelector = function(id) {
    if (!Auth.user) { 
        if(typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast("Login required to order!", "error"); 
        }
        return openPage('login-page'); 
    }
    const item = menuItems.find(i => i.id === id);
    
    let modal = document.getElementById('dynamic-smart-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dynamic-smart-modal';
        modal.className = 'z-overlay'; 
        document.body.appendChild(modal);
    }

    let variantHTML = '';
    if (item.variants && item.variants.length > 1) {
        variantHTML = `
            <h4 style="color:#fff; margin-bottom:10px;">Select Portion/Size</h4>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">`;
            
        item.variants.forEach((v, idx) => {
            variantHTML += `
                <div class="z-spice-btn ${idx === 0 ? 'active' : ''}" style="flex:1; border:1px solid var(--z-gold); color:var(--z-gold);" onclick="selectVariant(this, '${v.size}', ${v.price})" data-size="${v.size}" data-price="${v.price}">
                    ${v.size} - ₹${v.price}
                </div>`;
        });
        variantHTML += `</div>`;
    }

    let spiceHTML = '';
    if (item.needsSpice) {
        spiceHTML = `
            <h4 style="color:#fff; margin-bottom:10px;">Spice Level <i class="fa-solid fa-fire text-red"></i></h4>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <div class="z-spice-btn active" onclick="selectSpice(this, 'Mild')" data-spice="Mild">Mild 😌</div>
                <div class="z-spice-btn" onclick="selectSpice(this, 'Medium')" data-spice="Medium">Medium 🌶</div>
                <div class="z-spice-btn" onclick="selectSpice(this, 'Fire')" data-spice="Fire">Fire 🔥</div>
            </div>`;
    }

    modal.innerHTML = `
        <div class="z-bottom-sheet z-slide-up" style="position:absolute; bottom:0; width:100%; max-width:600px;">
            <div class="z-sheet-handle"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="color:#fff; font-weight:900;">${item.name}</h3>
                <button onclick="closeDynamicModal()" style="background:transparent; color:#888; border:none; font-size:24px; cursor:pointer;">
                    <i class="fa-solid fa-circle-xmark"></i>
                </button>
            </div>
            ${variantHTML}
            ${spiceHTML}
            <button class="z-gold-btn" style="width:100%; margin-top:10px; font-weight:900;" onclick="confirmSmartAdd('${item.id}')">
                Add to Cart <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('open'), 10);
};

window.selectVariant = function(el, size, price) {
    el.parentElement.querySelectorAll('.z-spice-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
};

window.selectSpice = function(el, level) {
    el.parentElement.querySelectorAll('.z-spice-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
};

window.closeDynamicModal = function() {
    const modal = document.getElementById('dynamic-smart-modal');
    if(modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

window.confirmSmartAdd = function(id) {
    const item = menuItems.find(i => i.id === id);
    const modal = document.getElementById('dynamic-smart-modal');
    
    let variantSize = 'Regular', exactPrice = item.price;
    if (item.variants && item.variants.length > 1) {
        const activeVariant = modal.querySelector('div[data-size].active');
        if(activeVariant) {
            variantSize = activeVariant.getAttribute('data-size');
            exactPrice = parseFloat(activeVariant.getAttribute('data-price'));
        }
    } else if (item.variants) {
        variantSize = item.variants[0].size;
        exactPrice = item.variants[0].price;
    }

    let spiceLevel = 'None';
    if (item.needsSpice) {
        const activeSpice = modal.querySelector('div[data-spice].active');
        if(activeSpice) spiceLevel = activeSpice.getAttribute('data-spice');
    }

    Cart.addItem(item, variantSize, exactPrice, spiceLevel);
    closeDynamicModal();
    updateCartBadge();
    renderMenu();
    
    if(typeof UI !== 'undefined' && UI.showToast) {
        UI.showToast(`Added ${item.name} (${variantSize}) to cart`);
    }
};

function updateCartBadge() {
    let total = Cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('nav-cart-count');
    if (!badge) return;
    
    if (total > 0) { 
        badge.classList.remove('hidden'); 
        badge.innerText = total; 
        const tab = document.querySelector('.z-cart-tab i');
        if(tab) tab.style.color = 'var(--z-red)'; 
    } else { 
        badge.classList.add('hidden'); 
        const tab = document.querySelector('.z-cart-tab i');
        if(tab) tab.style.color = 'var(--z-muted)'; 
        const cartPage = document.getElementById('cart-page');
        if(cartPage && cartPage.classList.contains('open')) renderCartSheet();
    }
}

// 🔐 SECURE CHECKOUT RENDERER
window.renderCartSheet = function() {
    const c = document.getElementById('cart-items-container');
    if(!c) return;
    c.innerHTML = '';
    
    if (Cart.items.length === 0) {
        c.innerHTML = `
            <div style="text-align:center; padding:100px 20px;">
                <i class="fa-solid fa-cart-shopping" style="font-size:60px; color:#222; margin-bottom:20px;"></i>
                <h3 style="color:#fff;">Cart is Empty</h3>
                <p class="text-muted text-sm mt-10">Good food is always cooking!</p>
                <button class="z-gold-btn mt-20" onclick="closePage('cart-page')">Browse Menu</button>
            </div>`;
        return;
    }

    const totals = Cart.getTotals();

    if (TableMode.active) {
        // 🪑 QR TABLE: replace Delivery Address + GPS block with a Table card
        c.innerHTML += `
            <div style="background:rgba(212,175,55,0.08); padding:18px; border-radius:16px; margin-bottom:20px; border:1px dashed var(--z-gold); display:flex; align-items:center; gap:14px;">
                <div style="background:var(--z-gold); color:#000; width:44px; height:44px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-size:18px;">
                    <i class="fa-solid fa-chair"></i>
                </div>
                <div>
                    <div style="color:#fff; font-weight:900; font-size:16px;">Dining at Table ${TableMode.number}</div>
                    <div style="color:#888; font-size:12px; margin-top:2px;">Your food will be served at your table.</div>
                </div>
            </div>
            <h4 style="color:#fff; margin-bottom:15px; font-weight:800;">Your Food</h4>
        `;
    } else {
        c.innerHTML += `
            <div style="background:#111; padding:18px; border-radius:16px; margin-bottom:20px; border:1px solid #222;">
                <label style="color:#888; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                    Delivery Address 
                    <span style="color:var(--z-neon); cursor:pointer; font-weight:700;" onclick="requestHighAccuracyGPS()">
                        <i class="fa-solid fa-location-crosshairs"></i> Get GPS
                    </span>
                </label>
                <textarea id="cart-address" class="z-input mt-10" rows="2" placeholder="Enter complete address...">${Cart.address}</textarea>
                <div id="gps-status-badge" style="font-size:11px; color:var(--z-green); margin-top:5px; font-weight:700; display:${Cart.gpsLink ? 'block' : 'none'};">
                    <i class="fa-solid fa-satellite-dish"></i> GPS Coordinates Locked
                </div>
            </div>
            <h4 style="color:#fff; margin-bottom:15px; font-weight:800;">Your Food</h4>
        `;
    }

    Cart.items.forEach(i => {
        let metaTxt = i.variant;
        if(i.spice !== 'None') metaTxt += ` | Spice: ${i.spice}`;
        
        c.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:15px; border-radius:16px; margin-bottom:12px; border:1px solid #222;">
            <div style="width:55%;">
                <div style="font-size:15px; color:#fff; font-weight:700;">${i.name}</div>
                <div style="font-size:11px; color:#888; margin-top:2px;">${metaTxt}</div>
                <div style="font-size:16px; color:#fff; font-weight:800; margin-top:6px;">₹${i.price * i.quantity}</div>
            </div>
            <div class="z-qty-box">
                <button onclick="Cart.updateQty('${i.id}', '${i.variant}', '${i.spice}', -1); renderCartSheet(); updateCartBadge(); renderMenu();">-</button>
                <span style="color:#fff; font-weight:800;">${i.quantity}</span>
                <button onclick="Cart.updateQty('${i.id}', '${i.variant}', '${i.spice}', 1); renderCartSheet(); updateCartBadge(); renderMenu();">+</button>
            </div>
        </div>`;
    });

    // 🪑 QR TABLE: no delivery fee row for dine-in orders
    const deliveryRow = TableMode.active ? '' : `
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:18px;">
                <span>Delivery Fee</span>
                <span style="color:${totals.delivery === 0 ? 'var(--z-green)' : '#ccc'}; font-weight:700;">
                    ${totals.delivery === 0 ? 'FREE' : '₹'+totals.delivery}
                </span>
            </div>`;

    // 🪑 QR TABLE: button labels. Payment methods ('COD' / 'UPI') are unchanged for your admin panel.
    const cashBtnLabel = TableMode.active ? 'Cash at Table' : 'Cash (COD)';
    const mainBtnLabel = TableMode.active
        ? `Order for Table: ${TableMode.number}<div style="font-size:11px; font-weight:700; opacity:0.9; margin-top:2px;">Pay via UPI <i class="fa-solid fa-bolt"></i></div>`
        : `Pay via UPI <i class="fa-solid fa-bolt" style="margin-left:5px;"></i>`;

    c.innerHTML += `
        <div style="background:#111; padding:20px; border-radius:16px; margin-top:25px; border:1px solid #222;">
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:12px;">
                <span>Item Total</span><span>₹${totals.subtotal}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:${TableMode.active ? '18px' : '12px'};">
                <span>Govt. Taxes (GST)</span><span>₹${totals.gst}</span>
            </div>
            ${deliveryRow}
            
            <div style="background: rgba(212,175,55,0.08); border: 1px dashed var(--z-gold); padding: 14px; border-radius: 12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="coins-check" onchange="calculateFinalBill()" style="width:18px; height:18px; accent-color: var(--z-gold);">
                    <label style="font-size:13px; color:var(--z-gold); font-weight:700;">Redeem Coins (Bal: ${Auth.coins})</label>
                </div>
                <span id="coin-discount" class="hidden" style="color:var(--z-green); font-size:14px; font-weight:900;">-₹0</span>
            </div>
            
            <div style="display:flex; justify-content:space-between; color:#fff; font-size:20px; font-weight:900; border-top:1px dashed #444; padding-top:18px;">
                <span>Grand Total</span>
                <span style="color:var(--z-neon);">₹<span id="bill-total">${totals.totalBeforeDiscount}</span></span>
            </div>
        </div>
        
        <div style="display:flex; gap:12px; margin-top:30px;">
            <button style="flex:1; background:#222; color:#fff; border:1px solid #444; padding:16px; border-radius:14px; font-weight:800;" onclick="placeOrder('COD')">${cashBtnLabel}</button>
            <button style="flex:1.5; background:var(--z-red); color:#fff; border:none; padding:16px; border-radius:14px; font-weight:900; box-shadow:0 6px 15px rgba(226,55,68,0.4);" onclick="placeOrder('UPI')">${mainBtnLabel}</button>
        </div>`;
};

window.calculateFinalBill = function() {
    const totals = Cart.getTotals();
    let disc = 0;
    const checkEl = document.getElementById('coins-check');
    const discEl = document.getElementById('coin-discount');
    
    if (checkEl && checkEl.checked) {
        disc = Math.min(Auth.coins, Math.floor(totals.subtotal * 0.10));
        if (disc > 0) { 
            discEl.innerText = `-₹${disc}`; 
            discEl.classList.remove('hidden'); 
        } else { 
            checkEl.checked = false; 
            if(typeof UI !== 'undefined' && UI.showToast) UI.showToast("Not enough coins to redeem", "error"); 
        }
    } else if(discEl) { 
        discEl.classList.add('hidden'); 
    }
    
    document.getElementById('bill-total').innerText = totals.totalBeforeDiscount - disc;
};

// 📍 REAL GPS TRACKING LOGIC
window.requestHighAccuracyGPS = function() {
    if (!Auth.user) {
        if(typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast("Please login to use GPS", "error");
        }
        return;
    }
    
    if(typeof UI !== 'undefined' && UI.showToast) {
        UI.showToast("📡 Connecting to Satellite GPS...");
    }
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
                
                Cart.gpsLink = mapLink;
                localStorage.setItem('kavya_gps', mapLink);
                
                const cartAdd = document.getElementById('cart-address');
                if(cartAdd && cartAdd.value.trim() === '') {
                    cartAdd.value = "GPS Location Pinned. Please add House/Flat No.";
                }
                
                const badge = document.getElementById('gps-status-badge');
                if(badge) badge.style.display = 'block';
                
                if(typeof UI !== 'undefined' && UI.showToast) {
                    UI.showToast("📍 Location Locked! Map link generated for Admin.");
                }
            },
            (error) => {
                if(typeof UI !== 'undefined' && UI.showToast) {
                    UI.showToast("GPS Error: Please enable location permissions.", "error");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        if(typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast("GPS not supported on this device", "error");
        }
    }
};

// 🚀 FIREBASE ORDER PUSH, LIVE TRACKING & DIRECT UPI TRIGGER
window.placeOrder = async function(method) {
    // 🪑 QR TABLE: dine-in orders don't need a delivery address
    const addEl = document.getElementById('cart-address');
    const add = TableMode.active
        ? `Dine-in: Table ${TableMode.number}`
        : (addEl ? addEl.value : '');
    
    if (!TableMode.active && add.trim() === "") {
        if(typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast("Delivery Address is mandatory!", "error");
        }
        return;
    }
    
    // Only save a delivery address for real delivery orders
    if (!TableMode.active) {
        Cart.address = add;
        localStorage.setItem('kavya_address', add);
    }
    
    const totals = Cart.getTotals();
    let finalTotal = totals.totalBeforeDiscount;
    let coinsUsed = 0;

    if (document.getElementById('coins-check') && document.getElementById('coins-check').checked) {
        coinsUsed = Math.min(Auth.coins, Math.floor(totals.subtotal * 0.10));
        Auth.deductCoins(coinsUsed);
        finalTotal -= coinsUsed;
    }
    
    const orderId = 'ORD' + Math.floor(Math.random() * 900000 + 100000);

    // 🪑 QR TABLE: these two fields are what the Admin Panel reads
    //   Table QR scanned  -> orderType: 'Dine-in',  tableNumber: 5 (number)
    //   No table in URL   -> orderType: 'Delivery', tableNumber: null
    const orderType = TableMode.active ? 'Dine-in' : 'Delivery';
    const tableNumber = TableMode.dbValue();

    // Snapshot of the cart items (the cart is cleared below, after the save)
    const orderItems = JSON.parse(JSON.stringify(Cart.items));

    // 🔥 SAVE ACTIVE ORDER TO LOCALSTORAGE FOR PERSISTENT BANNER
    localStorage.setItem('kavya_active_order', JSON.stringify({
        id: orderId, 
        amount: finalTotal, 
        method: method,
        orderType: orderType,
        tableNumber: tableNumber
    }));

    // 🔥 Send to Firebase Database FIRST (before the UPI app opens),
    // so the Admin Panel always receives the order, even if the page gets unloaded.
    if (window.db && window.fbAddDoc) {
        try {
            await window.fbAddDoc(window.fbCollection(window.db, "orders"), {
                orderId: orderId,
                customer: Auth.user, 
                phone: Auth.phone,
                items: orderItems, 
                totalAmount: finalTotal, 
                paymentMethod: method,
                orderType: orderType,                 // 🪑 'Dine-in' or 'Delivery'
                tableNumber: tableNumber,             // 🪑 e.g. 5 (null for delivery)
                address: add, 
                gpsLink: TableMode.active ? 'Not Applicable (Dine-in)' : (Cart.gpsLink || 'Not Provided'),
                coinsRedeemed: coinsUsed,
                status: 'Preparing', 
                timestamp: window.fbServerTimestamp()
            });
        } catch(e) {
            console.error("Order Sync Failed, processing locally:", e);
        }
    }

    Cart.clearCart();
    const earned = Math.floor(Math.random() * 50) + 10;
    Auth.earnCoins(earned);
    
    closePage('cart-page'); 
    updateCartBadge(); 
    renderMenu();
    
    showActiveOrderBanner();
    launchLiveTracking(orderId);

    // ⚡ DIRECT UPI DEEP LINKING (runs last, after the order is safely saved)
    if (method === 'UPI') {
        if(typeof UI !== 'undefined' && UI.showToast) UI.showToast("Opening Payment App...");
        const upiId = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.upi_id) ? APP_CONFIG.upi_id : 'merchant@upi';
        const merchantName = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.restaurant_name) ? APP_CONFIG.restaurant_name : 'Kavya Restaurant';
        const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${finalTotal}&cu=INR&tn=Order_${orderId}`;
        setTimeout(() => { window.location.href = upiLink; }, 400);
    }
};

// ⏱️ REAL-TIME LIVE ORDER TRACKING SCREEN (SYNCED WITH FIREBASE)
window.launchLiveTracking = function(orderId) {
    let trackScreen = document.getElementById('live-tracking-screen');
    if(!trackScreen) {
        trackScreen = document.createElement('div');
        trackScreen.id = 'live-tracking-screen';
        trackScreen.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#050505; z-index:999999; overflow-y:auto; padding:20px; display:none; flex-direction:column;';
        document.body.appendChild(trackScreen);
    }
    
    trackScreen.style.display = 'flex';
    
    // Show Loading state while fetching real-time data
    trackScreen.innerHTML = `<div style="color:var(--z-gold); text-align:center; margin-top:100px; font-size:20px; font-weight:800;"><i class="fa-solid fa-circle-notch fa-spin"></i> Syncing Live Status...</div>`;

    if(window.db && window.fbQuery && window.fbOnSnapshot) {
        const q = window.fbQuery(window.fbCollection(window.db, "orders"), window.fbWhere("orderId", "==", orderId));
        
        window.fbOnSnapshot(q, (snapshot) => {
            if(!snapshot.empty) {
                const order = snapshot.docs[0].data();
                
                // Color Logic based on Real-Time Status
                let prepColor = (order.status === 'Preparing' || order.status === 'Out for Delivery' || order.status === 'Delivered') ? 'var(--z-gold)' : '#333';
                let outColor = (order.status === 'Out for Delivery' || order.status === 'Delivered') ? 'var(--z-gold)' : '#333';
                
                // Render Customer's Ordered Items
                let itemsHtml = '<div style="margin-top:15px; border-top:1px dashed #333; padding-top:15px;">';
                order.items.forEach(item => {
                    itemsHtml += `<div style="display:flex; justify-content:space-between; color:#ccc; font-size:13px; margin-bottom:8px; font-weight:700;"><span>${item.quantity}x ${item.name}</span><span style="color:#fff;">₹${item.price * item.quantity}</span></div>`;
                });
                itemsHtml += '</div>';

                // Auto Clean-up if Admin marks as Delivered
                if (order.status === 'Delivered') {
                    localStorage.removeItem('kavya_active_order');
                    const banner = document.getElementById('active-order-banner');
                    if(banner) banner.remove();
                }

                // 🪑 QR TABLE: show table number in the header for dine-in orders
                const hasTable = order.tableNumber !== null && order.tableNumber !== undefined;
                const tableHeaderTxt = hasTable ? ` • Table ${order.tableNumber}` : '';

                trackScreen.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <i class="fa-solid fa-arrow-left" style="color:#fff; font-size:24px; cursor:pointer;" onclick="document.getElementById('live-tracking-screen').style.display='none'"></i>
                        <span style="color:var(--z-gold); font-weight:800;">Order ${order.orderId}${tableHeaderTxt}</span>
                        <i class="fa-solid fa-headset" style="color:#fff; font-size:20px;"></i>
                    </div>
                    
                    <div style="text-align:center; margin-bottom:20px;">
                        <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80" style="width:100%; height:160px; object-fit:cover; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.8); margin-bottom:15px; border:2px solid #222;">
                        <h2 style="color:#fff; font-weight:900; margin:0;">${order.status === 'Delivered' ? 'Order Delivered! 🎉' : 'Track Your Order'}</h2>
                        <p style="color:var(--z-neon); font-size:14px; font-weight:700; margin-top:5px;">${order.status === 'Delivered' ? 'Enjoy your delicious meal!' : 'Status: ' + order.status}</p>
                    </div>
                    
                    <div style="background:#111; border-radius:20px; padding:20px; border:1px solid #222; margin-bottom:20px;">
                        <div style="display:flex; gap:15px;">
                            <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                                <div style="width:20px; height:20px; background:var(--z-green); border-radius:50%; display:flex; justify-content:center; align-items:center; color:#000; font-size:10px;"><i class="fa-solid fa-check"></i></div>
                                <div style="width:2px; height:30px; background:var(--z-green);"></div>
                                <div style="width:20px; height:20px; background:${prepColor}; border-radius:50%;"></div>
                                <div style="width:2px; height:30px; background:${prepColor === '#333' ? '#333' : 'var(--z-gold)'};"></div>
                                <div style="width:20px; height:20px; background:${outColor}; border-radius:50%;"></div>
                            </div>
                            <div style="display:flex; flex-direction:column; justify-content:space-between; padding-top:2px; padding-bottom:2px; width:100%;">
                                <div><h4 style="color:#fff; margin:0; font-size:15px;">Order Placed</h4></div>
                                <div style="margin-top:20px;"><h4 style="color:${prepColor === '#333' ? '#888' : '#fff'}; margin:0; font-size:15px;">Preparing</h4></div>
                                <div style="margin-top:20px;"><h4 style="color:${outColor === '#333' ? '#888' : '#fff'}; margin:0; font-size:15px;">On the Way</h4></div>
                            </div>
                        </div>
                        ${itemsHtml}
                    </div>
                    
                    <div style="margin-top:auto; background:#111; padding:20px; border-radius:20px; border:1px solid #222; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="color:#888; font-size:12px;">Total Paid (${order.paymentMethod})</span>
                            <h3 style="color:#fff; margin:0; font-size:20px;">₹${order.totalAmount}</h3>
                        </div>
                        <button style="background:${order.status === 'Delivered' ? 'var(--z-green)' : 'var(--z-red)'}; color:${order.status === 'Delivered' ? '#000' : '#fff'}; border:none; padding:12px 20px; border-radius:10px; font-weight:800;" onclick="document.getElementById('live-tracking-screen').style.display='none'; if('${order.status}' === 'Delivered') location.reload();">
                            ${order.status === 'Delivered' ? 'Done' : 'Close'}
                        </button>
                    </div>
                `;
            }
        });
    } else {
        // Fallback if Firebase hasn't loaded yet
        trackScreen.innerHTML = `<div style="padding:20px; color:#fff;">Status: Preparing...</div>`;
    }
};

window.openPage = function(id) {
    if (id === 'cart-page') {
        if (!Auth.user) { 
            if(typeof UI !== 'undefined' && UI.showToast) {
                UI.showToast("Login required to view cart!", "error"); 
            }
            return openPage('login-page'); 
        }
        renderCartSheet(); 
    }
    const p = document.getElementById(id);
    if (p) { 
        p.style.display = 'block'; 
        setTimeout(() => p.classList.add('open'), 10); 
    }
};

window.closePage = function(id) {
    const p = document.getElementById(id);
    if (p) { 
        p.classList.remove('open'); 
        setTimeout(() => p.style.display = 'none', 300); 
    }
};

// 👨‍👩‍👧‍👦 DINING RESERVATION SYSTEM (WITH FIREBASE & STATUS PENDING)
window.updateGuests = function(v) {
    tableGuests += v;
    if (tableGuests < 1) tableGuests = 1;
    if (tableGuests > 20) tableGuests = 20;
    
    const gc = document.getElementById('guest-count');
    if (gc) {
        gc.innerText = `${tableGuests} Guests`;
    }
};

window.reserveTable = async function() {
    if (!Auth.user) { 
        if(typeof UI !== 'undefined' && UI.showToast) UI.showToast("Login required for reservation!", "error"); 
        return openPage('login-page'); 
    }
    
    const timeInput = document.querySelector('input[type="time"]');
    const time = timeInput ? timeInput.value : "19:30";
    const resId = 'RES' + Math.floor(Math.random() * 90000 + 10000);
    
    // UI Feedback immediately
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Reserving...';
    btn.disabled = true;

    try {
        if (window.db && window.fbAddDoc) {
            await window.fbAddDoc(window.fbCollection(window.db, "reservations"), {
                reservationId: resId,
                customer: Auth.user,
                phone: Auth.phone,
                guests: tableGuests,
                time: time,
                status: 'Pending',
                timestamp: window.fbServerTimestamp()
            });
        }
        
        // Save to local storage to show status
        localStorage.setItem('kavya_dining_status', JSON.stringify({ id: resId, guests: tableGuests, time: time, status: 'Pending Confirmation ⏳' }));
        window.checkDiningStatus();
        
        if(typeof UI !== 'undefined' && UI.showToast) UI.showToast("Table request sent! Awaiting Admin approval.");
    } catch(e) {
        console.error("Reservation Error:", e);
        if(typeof UI !== 'undefined' && UI.showToast) UI.showToast("Network error. Could not book table.", "error");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

window.checkDiningStatus = function() {
    const resStr = localStorage.getItem('kavya_dining_status');
    const diningBody = document.querySelector('.z-dining-body');
    
    if (resStr && diningBody) {
        const res = JSON.parse(resStr);
        // Replace the booking form with a status card
        diningBody.innerHTML = `
            <h4 class="z-section-title" style="padding: 20px;">Your Reservation</h4>
            <div class="z-card" style="margin: 0 20px; background: rgba(212,175,55,0.1); border: 1px dashed var(--z-gold);">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="color:#888; font-size:12px;">Booking ID</span>
                    <span style="color:#fff; font-weight:800;">${res.id}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="color:#888; font-size:12px;">Guests & Time</span>
                    <span style="color:#fff; font-weight:800;">${res.guests} Guests at ${res.time}</span>
                </div>
                <div style="margin-top:20px; padding:15px; background:#111; border-radius:12px; text-align:center;">
                    <h3 style="color:var(--z-neon); margin:0; font-size:16px;">${res.status}</h3>
                    <p style="color:#888; font-size:12px; margin-top:5px;">We will notify you once confirmed by the restaurant.</p>
                </div>
                <button class="z-input mt-20" style="background:#222; border:none; font-weight:800; cursor:pointer;" onclick="cancelReservation()">Cancel Request</button>
            </div>
        `;
    }
};

window.cancelReservation = function() {
    localStorage.removeItem('kavya_dining_status');
    if(typeof UI !== 'undefined' && UI.showToast) UI.showToast("Reservation request cancelled.");
    location.reload(); // Reload to show the booking form again
};

function renderAuthPage() {
    const c = document.getElementById('auth-container');
    if (!c) return;
    
    if (Auth.user) {
        const progress = Math.min((Auth.coins/500)*100, 100);
        c.innerHTML = `
            <div style="text-align:center;">
                <div style="width:110px; height:110px; margin:0 auto 15px; position:relative;">
                    <img src="${Auth.profilePic}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid var(--z-neon);">
                </div>
                <h3 style="color:#fff; font-size:22px; font-weight:800;">${Auth.user}</h3>
                <p style="color:#888; font-size:13px; font-weight:600;">+91 ${Auth.phone}</p>
                
                <div style="background:linear-gradient(145deg, #111, #1a1a1a); border:1px solid #333; border-radius:24px; padding:25px; text-align:left; margin-top:25px; box-shadow:0 15px 35px rgba(0,0,0,0.6);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="color:var(--z-gold); margin:0; font-size:18px;"><i class="fa-solid fa-coins"></i> DineCoins</h4>
                        <span style="font-size:28px; color:var(--z-neon); font-weight:900;">${Auth.coins}</span>
                    </div>
                    <div style="background:#000; border-radius:10px; height:12px; width:100%; overflow:hidden; margin:18px 0 8px; border:1px solid #222;">
                        <div style="background:linear-gradient(90deg, var(--z-red), var(--z-neon)); height:100%; width:${progress}%"></div>
                    </div>
                    <p style="font-size:12px; color:#888; font-weight:600;">Reach 500 Coins for a FREE VIP Biryani!</p>
                </div>
                
                <button class="z-primary-btn mt-25" style="background:#1a1a1a; border:1px solid #333; color:#fff;" onclick="Auth.logout()">Logout Safely</button>
            </div>`;
    } else {
        c.innerHTML = `
            <div style="text-align:center; margin-bottom:50px; margin-top:30px;">
                <h1 class="z-brand-3d">KAVYA</h1>
                <p style="color:var(--z-neon); font-size:14px; font-weight:800; letter-spacing:2px; margin-top:5px;">VIP LOGIN REQUIRED</p>
            </div>
            <input type="text" id="user-name" class="z-input" placeholder="Enter Full Name">
            <input type="tel" id="user-phone" class="z-input" placeholder="Enter 10-Digit Mobile" maxlength="10">
            <button class="z-gold-btn mt-15" onclick="Auth.login(document.getElementById('user-name').value, document.getElementById('user-phone').value)">Authenticate & Enter</button>
        `;
    }
           }
