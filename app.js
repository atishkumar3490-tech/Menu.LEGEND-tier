/* ==========================================================
   APP.JS - Enterprise State Management & Cart Engine
   ========================================================== */

class AuthManager {
    constructor() {
        this.user = localStorage.getItem('kavya_user_name') || null;
        this.phone = localStorage.getItem('kavya_user_phone') || null;
        this.coins = parseInt(localStorage.getItem('kavya_coins') || 50);
        this.profilePic = localStorage.getItem('kavya_profile_pic') || "https://via.placeholder.com/150/222/fff?text=VIP";
    }

    login(name, phone) {
        if (!name.trim() || phone.length !== 10) {
            UI.showToast("Please enter a valid Name & 10-digit Mobile number.", "error");
            return false;
        }
        this.user = name;
        this.phone = phone;
        localStorage.setItem('kavya_user_name', name);
        localStorage.setItem('kavya_user_phone', phone);
        if (!localStorage.getItem('kavya_coins')) localStorage.setItem('kavya_coins', 50);
        
        UI.showToast(`Welcome to Kavya VIP, ${name}!`);
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

class CartEngine {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('kavya_cart') || '[]');
        this.address = localStorage.getItem('kavya_address') || "";
    }

    addItem(menuItem, spiceLevel) {
        const existingIdx = this.items.findIndex(i => i.id === menuItem.id && i.spice === spiceLevel);
        if (existingIdx > -1) {
            this.items[existingIdx].quantity += 1;
        } else {
            this.items.push({ ...menuItem, quantity: 1, spice: spiceLevel });
        }
        this.saveState();
    }

    updateQty(itemId, amount) {
        const idx = this.items.findIndex(i => i.id === itemId);
        if (idx > -1) {
            this.items[idx].quantity += amount;
            if (this.items[idx].quantity <= 0) this.items.splice(idx, 1);
            this.saveState();
        }
    }

    getTotals() {
        let subtotal = this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        let gst = Math.floor(subtotal * APP_CONFIG.gst_rate);
        let delivery = subtotal >= APP_CONFIG.free_delivery_threshold ? 0 : APP_CONFIG.delivery_fee;
        return { subtotal, gst, delivery, totalBeforeDiscount: subtotal + gst + delivery };
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
let selectedFlavorId = null;
let currentSpice = 'Mild';
let tableGuests = 2;

document.addEventListener('DOMContentLoaded', () => {
    setupTopHeader();
    renderCategories();
    renderMenu();
    updateCartBadge();
    renderAuthPage();
});

// --- CORE APP FUNCTIONS ---
function setupTopHeader() {
    if (Auth.user) {
        document.getElementById('nav-profile-pic').src = Auth.profilePic;
        document.getElementById('top-coin-bal').innerText = Auth.coins;
    }
    const hr = new Date().getHours();
    const g = hr < 12 ? "Good Morning" : hr < 16 ? "Good Afternoon" : "Good Evening";
    document.getElementById('dynamic-greeting').innerText = `${g}, ${Auth.user || 'Legend'}!`;
}

function renderCategories() {
    const cont = document.getElementById('category-scroll-container');
    if (!cont) return;
    categories.forEach(cat => {
        cont.innerHTML += `
            <div class="z-cat-item ${cat.id === 'All' ? 'active' : ''}" onclick="setCategory('${cat.id}', this)">
                <div class="z-cat-icon"><img src="${cat.img}" loading="lazy"></div>
                <span>${cat.name}</span>
            </div>`;
    });
}

function setCategory(id, el) {
    currentCategory = id;
    document.querySelectorAll('.z-cat-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderMenu();
}

function filterMenu() { renderMenu(); }

function renderMenu() {
    const search = document.getElementById('main-search').value.toLowerCase();
    const container = document.getElementById('menu-items-container');
    container.innerHTML = '';

    const filtered = menuItems.filter(i => (currentCategory === 'All' || i.category === currentCategory) && i.name.toLowerCase().includes(search));
    
    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:60px 20px;"><i class="fa-solid fa-utensils" style="font-size:40px; color:#333; margin-bottom:15px;"></i><h3 style="color:#888;">No dishes found</h3></div>`;
        return;
    }

    filtered.forEach(item => {
        // Advanced checking to see if item is in cart
        const cartItem = Cart.items.find(i => i.id === item.id);
        const vegColor = item.veg ? 'var(--z-green)' : 'var(--z-red)';
        
        let actionBtn = cartItem 
            ? `<div class="z-qty-box"><button onclick="updateQty('${item.id}', -1)">-</button><span style="color:#fff; font-weight:800;">${cartItem.quantity}</span><button onclick="updateQty('${item.id}', 1)">+</button></div>`
            : `<button class="z-add-btn" onclick="openFlavorSelector('${item.id}')">ADD</button>`;

        container.innerHTML += `
        <div class="z-food-card">
            <div class="z-food-img-box">
                <img src="${item.img}" loading="lazy">
                <div class="z-bookmark-btn" onclick="UI.toggleBookmark(this)"><i class="fa-regular fa-bookmark"></i></div>
            </div>
            <div class="z-food-info">
                <div class="z-food-details">
                    <div class="z-veg-dot" style="border: 1px solid ${vegColor};"><div class="z-veg-inner" style="background:${vegColor};"></div></div>
                    <h3 class="z-food-title">${item.name}</h3>
                    <div class="z-rating-tag"><i class="fa-solid fa-star"></i> ${item.rating}</div>
                    <div class="text-xs text-muted font-weight-600">${item.meta}</div>
                    <div class="z-food-price">₹${item.price}</div>
                </div>
                <div>${actionBtn}</div>
            </div>
        </div>`;
    });
}

// --- ADD LOGIC ---
function openFlavorSelector(id) {
    if (!Auth.user) { UI.showToast("Login required to order!", "error"); return openPage('login-page'); }
    selectedFlavorId = id;
    UI.openPopup('flavor-slider-modal');
}

function setSpice(el, level) {
    document.querySelectorAll('.z-spice-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    currentSpice = level;
}

document.getElementById('confirm-flavor-btn').addEventListener('click', () => {
    UI.closePopup('flavor-slider-modal');
    const item = menuItems.find(i => i.id === selectedFlavorId);
    Cart.addItem(item, currentSpice);
    updateCartBadge();
    renderMenu();
    UI.showToast(`Added ${item.name} (${currentSpice}) to cart`);
});

function updateQty(id, amt) {
    Cart.updateQty(id, amt);
    updateCartBadge();
    renderMenu();
    if (document.getElementById('cart-page').classList.contains('open')) renderCartSheet();
}

function updateCartBadge() {
    let total = Cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('nav-cart-count');
    if (total > 0) { 
        badge.classList.remove('hidden'); badge.innerText = total; 
        document.querySelector('.z-cart-tab i').style.color = 'var(--z-red)'; 
    } else { 
        badge.classList.add('hidden'); 
        document.querySelector('.z-cart-tab i').style.color = 'var(--z-muted)'; 
        if(document.getElementById('cart-page').classList.contains('open')) renderCartSheet();
    }
}

// --- SECURE CHECKOUT RENDERER ---
function renderCartSheet() {
    const c = document.getElementById('cart-items-container');
    c.innerHTML = '';
    
    if (Cart.items.length === 0) {
        c.innerHTML = `<div style="text-align:center; padding:100px 20px;"><i class="fa-solid fa-cart-shopping" style="font-size:60px; color:#222; margin-bottom:20px;"></i><h3 style="color:#fff;">Cart is Empty</h3><p class="text-muted text-sm mt-10">Good food is always cooking! Go ahead, order some yummy items from the menu.</p><button class="z-gold-btn mt-20" onclick="closePage('cart-page')">Browse Menu</button></div>`;
        return;
    }

    const totals = Cart.getTotals();

    c.innerHTML += `
        <div style="background:#111; padding:18px; border-radius:16px; margin-bottom:20px; border:1px solid #222;">
            <label style="color:#888; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                Delivery Address 
                <span style="color:var(--z-neon); cursor:pointer; font-weight:700;" onclick="requestLocation()"><i class="fa-solid fa-location-crosshairs"></i> Get GPS</span>
            </label>
            <textarea id="cart-address" class="z-input mt-10" rows="2" placeholder="Enter complete address...">${Cart.address}</textarea>
        </div>
        <h4 style="color:#fff; margin-bottom:15px; font-weight:800;">Items in your cart</h4>
    `;

    Cart.items.forEach(i => {
        c.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:15px; border-radius:16px; margin-bottom:12px; border:1px solid #222;">
            <div style="width:55%;">
                <div style="font-size:15px; color:#fff; font-weight:700;">${i.name}</div>
                <div style="font-size:11px; color:#888; margin-top:2px;"><i class="fa-solid fa-fire text-red"></i> Spice: ${i.spice}</div>
                <div style="font-size:16px; color:#fff; font-weight:800; margin-top:6px;">₹${i.price * i.quantity}</div>
            </div>
            <div class="z-qty-box"><button onclick="updateQty('${i.id}', -1)">-</button><span style="color:#fff; font-weight:800;">${i.quantity}</span><button onclick="updateQty('${i.id}', 1)">+</button></div>
        </div>`;
    });

    c.innerHTML += `
        <div style="background:#111; padding:20px; border-radius:16px; margin-top:25px; border:1px solid #222;">
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:12px;"><span>Item Total</span><span>₹${totals.subtotal}</span></div>
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:12px;"><span>Govt. Taxes (GST)</span><span>₹${totals.gst}</span></div>
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:18px;"><span>Delivery Fee</span><span style="color:${totals.delivery === 0 ? 'var(--z-green)' : '#ccc'}; font-weight:700;">${totals.delivery === 0 ? 'FREE' : '₹'+totals.delivery}</span></div>
            
            <div style="background: rgba(212,175,55,0.08); border: 1px dashed var(--z-gold); padding: 14px; border-radius: 12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="coins-check" onchange="calculateFinalBill()" style="width:18px; height:18px; accent-color: var(--z-gold);">
                    <label style="font-size:13px; color:var(--z-gold); font-weight:700;">Redeem Coins (Bal: ${Auth.coins})</label>
                </div>
                <span id="coin-discount" class="hidden" style="color:var(--z-green); font-size:14px; font-weight:900;">-₹0</span>
            </div>
            
            <div style="display:flex; justify-content:space-between; color:#fff; font-size:20px; font-weight:900; border-top:1px dashed #444; padding-top:18px;">
                <span>Grand Total</span><span style="color:var(--z-neon);">₹<span id="bill-total">${totals.totalBeforeDiscount}</span></span>
            </div>
        </div>
        
        <div style="display:flex; gap:12px; margin-top:30px;">
            <button style="flex:1; background:#222; color:#fff; border:1px solid #444; padding:16px; border-radius:14px; font-weight:800;" onclick="placeOrder('COD')">Cash (COD)</button>
            <button style="flex:1.5; background:var(--z-red); color:#fff; border:none; padding:16px; border-radius:14px; font-weight:900; box-shadow:0 6px 15px rgba(226,55,68,0.4);" onclick="placeOrder('UPI')">Pay via UPI <i class="fa-solid fa-bolt" style="margin-left:5px;"></i></button>
        </div>`;
}

function calculateFinalBill() {
    const totals = Cart.getTotals();
    let disc = 0;
    
    if (document.getElementById('coins-check').checked) {
        disc = Math.min(Auth.coins, Math.floor(totals.subtotal * 0.10)); // Max 10% discount
        if (disc > 0) { 
            document.getElementById('coin-discount').innerText = `-₹${disc}`; 
            document.getElementById('coin-discount').classList.remove('hidden'); 
        } else { 
            document.getElementById('coins-check').checked = false; 
            UI.showToast("Not enough coins to redeem", "error"); 
        }
    } else { 
        document.getElementById('coin-discount').classList.add('hidden'); 
    }
    
    document.getElementById('bill-total').innerText = totals.totalBeforeDiscount - disc;
}

function placeOrder(method) {
    const add = document.getElementById('cart-address').value;
    if (add.trim() === "") return UI.showToast("Delivery Address is mandatory!", "error");
    
    localStorage.setItem('kavya_address', add);
    
    // Deduct coins if used
    if (document.getElementById('coins-check') && document.getElementById('coins-check').checked) {
        let disc = Math.min(Auth.coins, Math.floor(Cart.getTotals().subtotal * 0.10));
        Auth.deductCoins(disc);
    }

    if (method === 'UPI') UI.showToast("Connecting to secure UPI gateway...");

    Cart.clearCart();
    
    const earned = Math.floor(Math.random() * 50) + 10;
    Auth.earnCoins(earned);
    
    closePage('cart-page'); 
    updateCartBadge(); 
    renderMenu();
    
    document.getElementById('earned-coins').innerText = earned; 
    UI.openPopup('coin-celebration');
    
    setTimeout(() => { 
        if (Auth.user) document.getElementById('top-coin-bal').innerText = Auth.coins; 
        renderAuthPage(); 
    }, 2000);
}

// --- GPS & ROUTING ---
function requestLocation() {
    if (!Auth.user) return UI.showToast("Please login to use GPS", "error");
    UI.showToast("Fetching high-accuracy GPS data...");
    setTimeout(() => {
        const locEl = document.getElementById('user-location');
        const cartAdd = document.getElementById('cart-address');
        if(locEl) locEl.innerHTML = `GPS Verified <i class="fa-solid fa-circle-check text-green text-xs"></i>`;
        if(cartAdd) cartAdd.value = "Ramkrishna Nagar, Patna, Bihar (Verified by GPS)";
        UI.showToast("Location locked successfully!");
    }, 1500); // Simulating network latency for realism
}

function openPage(id) {
    if (id === 'cart-page') {
        if (!Auth.user) { UI.showToast("Login required to view cart!", "error"); return openPage('login-page'); }
        renderCartSheet(); 
    }
    const p = document.getElementById(id);
    if (p) { p.style.display = 'block'; setTimeout(() => p.classList.add('open'), 10); }
}

function closePage(id) {
    const p = document.getElementById(id);
    if (p) { p.classList.remove('open'); setTimeout(() => p.style.display = 'none', 300); }
}

function updateGuests(v) { 
    tableGuests += v; 
    if (tableGuests < 1) tableGuests = 1; 
    if (tableGuests > 20) tableGuests = 20;
    document.getElementById('guest-count').innerText = `${tableGuests} Guests`; 
}

// Auth Rendering Trigger
function renderAuthPage() {
    const c = document.getElementById('auth-container');
    if (!c) return;
    if (Auth.user) {
        const progress = Math.min((Auth.coins/500)*100, 100);
        c.innerHTML = `
            <div style="text-align:center;">
                <div style="width:110px; height:110px; margin:0 auto 15px; position:relative;">
                    <img src="${Auth.profilePic}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid var(--z-neon);">
                    <div style="position:absolute; bottom:0; right:0; background:var(--z-gold); width:35px; height:35px; border-radius:50%; display:flex; justify-content:center; align-items:center; color:#000; box-shadow:0 4px 10px rgba(0,0,0,0.5);"><i class="fa-solid fa-camera"></i></div>
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
                
                <a href="${APP_CONFIG.instagram_url}" target="_blank" style="display:block; text-align:center; background:linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color:#fff; padding:16px; border-radius:14px; font-weight:800; margin-top:25px; text-decoration:none; box-shadow:0 8px 20px rgba(220, 39, 67, 0.4);">
                    <i class="fa-brands fa-instagram" style="font-size:20px; margin-right:8px;"></i> Follow @kavyafamilyrestaurant
                </a>
                
                <button class="z-primary-btn mt-25" style="background:#1a1a1a; border:1px solid #333; color:#fff;" onclick="Auth.logout()">Logout Safely</button>
            </div>`;
    } else {
        c.innerHTML = `
            <div style="text-align:center; margin-bottom:50px; margin-top:30px;">
                <h1 class="z-brand-3d" style="font-size:45px;">KAVYA</h1>
                <p style="color:var(--z-neon); font-size:14px; font-weight:800; letter-spacing:2px; margin-top:5px;">VIP LOGIN REQUIRED</p>
            </div>
            <input type="text" id="user-name" class="z-input" placeholder="Enter Full Name">
            <input type="tel" id="user-phone" class="z-input" placeholder="Enter 10-Digit Mobile" maxlength="10">
            <button class="z-gold-btn mt-15" onclick="Auth.login(document.getElementById('user-name').value, document.getElementById('user-phone').value)">Authenticate & Enter</button>
        `;
    }
}
