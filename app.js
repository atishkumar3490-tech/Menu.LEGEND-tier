/* ==========================================================
   APP.JS - Enterprise State Management, Cart & Firebase Engine
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
        const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        const app = initializeApp(firebaseConfig);
        window.db = getFirestore(app);
        window.fbAddDoc = addDoc;
        window.fbCollection = collection;
        window.fbServerTimestamp = serverTimestamp;
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
    }

    updateQty(itemId, variant, spice, amount) {
        const idx = this.items.findIndex(i => i.id === itemId && i.variant === variant && i.spice === spice);
        if (idx > -1) {
            this.items[idx].quantity += amount;
            if (this.items[idx].quantity <= 0) this.items.splice(idx, 1);
            this.saveState();
        }
    }

    getTotals() {
        let subtotal = this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        
        // 5% GST and Delivery Logic
        let gst = Math.floor(subtotal * 0.05);
        let delivery = subtotal >= 199 ? 0 : 30;
        
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
    // Basic Inits
    setupTopHeader();
    
    try { 
        if(typeof categories !== 'undefined') renderCategories(); 
    } catch(e) { console.error(e); }
    
    try { 
        if(typeof menuItems !== 'undefined') renderMenu(); 
    } catch(e) { console.error(e); }

    updateCartBadge();
    renderAuthPage();

    // 🚀 AUTO SLIDER LOGIC (Properly integrated here)
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    if(slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.add('hidden-slide');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.remove('hidden-slide');
        }, 3500);
    }
});

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

function setCategory(id, el) {
    currentCategory = id;
    document.querySelectorAll('.z-cat-item').forEach(b => b.classList.remove('active'));
    if(el) el.classList.add('active');
    renderMenu();
}

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
        alert("Developer Alert: " + e.message);
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

function addDirectly(id) {
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
}

function updateQtyDirect(id) {
    if (!Auth.user) return;
    const item = Cart.items.find(i => i.id === id);
    if(item) {
        Cart.updateQty(item.id, item.variant, item.spice, 1);
        updateCartBadge();
        renderMenu();
    }
}

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
                <div class="z-spice-btn" onclick="selectSpice(this, 'Medium')" data-spice="Medium">Medium 🌶️️</div>
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
function renderCartSheet() {
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

    c.innerHTML += `
        <div style="background:#111; padding:20px; border-radius:16px; margin-top:25px; border:1px solid #222;">
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:12px;">
                <span>Item Total</span><span>₹${totals.subtotal}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:12px;">
                <span>Govt. Taxes (GST)</span><span>₹${totals.gst}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:18px;">
                <span>Delivery Fee</span>
                <span style="color:${totals.delivery === 0 ? 'var(--z-green)' : '#ccc'}; font-weight:700;">
                    ${totals.delivery === 0 ? 'FREE' : '₹'+totals.delivery}
                </span>
            </div>
            
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
            <button style="flex:1; background:#222; color:#fff; border:1px solid #444; padding:16px; border-radius:14px; font-weight:800;" onclick="placeOrder('COD')">Cash (COD)</button>
            <button style="flex:1.5; background:var(--z-red); color:#fff; border:none; padding:16px; border-radius:14px; font-weight:900; box-shadow:0 6px 15px rgba(226,55,68,0.4);" onclick="placeOrder('UPI')">Pay via UPI <i class="fa-solid fa-bolt" style="margin-left:5px;"></i></button>
        </div>`;
}

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

// 🚀 FIREBASE ORDER PUSH & LIVE TRACKING TRIGGER
window.placeOrder = async function(method) {
    const add = document.getElementById('cart-address').value;
    
    if (add.trim() === "") {
        if(typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast("Delivery Address is mandatory!", "error");
        }
        return;
    }
    
    Cart.address = add;
    localStorage.setItem('kavya_address', add);
    
    const totals = Cart.getTotals();
    let finalTotal = totals.totalBeforeDiscount;
    let coinsUsed = 0;

    if (document.getElementById('coins-check') && document.getElementById('coins-check').checked) {
        coinsUsed = Math.min(Auth.coins, Math.floor(totals.subtotal * 0.10));
        Auth.deductCoins(coinsUsed);
        finalTotal -= coinsUsed;
    }

    if (method === 'UPI') {
        if(typeof UI !== 'undefined' && UI.showToast) UI.showToast("Connecting to secure UPI gateway...");
    }
    
    const orderId = 'ORD' + Math.floor(Math.random() * 900000 + 100000);

    // 🔥 Send to Firebase Database
    if (window.db && window.fbAddDoc) {
        try {
            await window.fbAddDoc(window.fbCollection(window.db, "orders"), {
                orderId: orderId,
                customer: Auth.user, 
                phone: Auth.phone,
                items: Cart.items, 
                totalAmount: finalTotal, 
                paymentMethod: method,
                address: Cart.address, 
                gpsLink: Cart.gpsLink || 'Not Provided',
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
    
    launchLiveTracking(orderId, finalTotal, method);
};

// ⏱️ LIVE ORDER TRACKING SCREEN
function launchLiveTracking(orderId, amount, method) {
    let trackScreen = document.getElementById('live-tracking-screen');
    if(!trackScreen) {
        trackScreen = document.createElement('div');
        trackScreen.id = 'live-tracking-screen';
        trackScreen.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#050505; z-index:999999; overflow-y:auto; padding:20px; display:none; flex-direction:column;';
        document.body.appendChild(trackScreen);
    }
    
    const timeNow = new Date();
    timeNow.setMinutes(timeNow.getMinutes() + 30);
    const estTime = timeNow.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    trackScreen.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
            <i class="fa-solid fa-arrow-left" style="color:#fff; font-size:24px; cursor:pointer;" onclick="document.getElementById('live-tracking-screen').style.display='none'"></i>
            <span style="color:var(--z-gold); font-weight:800;">Order ${orderId}</span>
            <i class="fa-solid fa-headset" style="color:#fff; font-size:20px;"></i>
        </div>
        
        <div style="text-align:center; margin-bottom:30px;">
            <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80" style="width:100%; height:180px; object-fit:cover; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.8); margin-bottom:20px; border:2px solid #222;">
            <h2 style="color:#fff; font-weight:900; margin:0;">Preparing your food</h2>
            <p style="color:var(--z-neon); font-size:15px; font-weight:700; margin-top:5px;">Arriving by ${estTime}</p>
        </div>
        
        <div style="background:#111; border-radius:20px; padding:20px; border:1px solid #222;">
            <div style="display:flex; gap:15px; margin-bottom:25px;">
                <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                    <div style="width:20px; height:20px; background:var(--z-green); border-radius:50%; display:flex; justify-content:center; align-items:center; color:#000; font-size:10px;"><i class="fa-solid fa-check"></i></div>
                    <div style="width:2px; height:40px; background:var(--z-green);"></div>
                    <div style="width:20px; height:20px; background:var(--z-gold); border-radius:50%; box-shadow:0 0 10px var(--z-gold);"></div>
                    <div style="width:2px; height:40px; background:#333;"></div>
                    <div style="width:20px; height:20px; background:#333; border-radius:50%;"></div>
                </div>
                <div style="display:flex; flex-direction:column; justify-content:space-between; padding-top:2px; padding-bottom:2px;">
                    <div><h4 style="color:#fff; margin:0; font-size:16px;">Order Placed</h4><p style="color:#888; font-size:12px; margin:0;">We have received your order</p></div>
                    <div style="margin-top:28px;"><h4 style="color:var(--z-gold); margin:0; font-size:16px;">Preparing</h4><p style="color:#aaa; font-size:12px; margin:0;">The chef is cooking your food</p></div>
                    <div style="margin-top:28px;"><h4 style="color:#555; margin:0; font-size:16px;">On the Way</h4><p style="color:#444; font-size:12px; margin:0;">Delivery partner assigned</p></div>
                </div>
            </div>
        </div>
        
        <div style="margin-top:20px; background:#111; padding:20px; border-radius:20px; border:1px solid #222; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span style="color:#888; font-size:12px;">Total Paid (${method})</span>
                <h3 style="color:#fff; margin:0; font-size:20px;">₹${amount}</h3>
            </div>
            <button style="background:var(--z-red); color:#fff; border:none; padding:10px 20px; border-radius:10px; font-weight:800;" onclick="location.reload()">Back to Home</button>
        </div>
    `;
    
    trackScreen.style.display = 'flex';
}

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

// 👨‍👩‍👧‍👦 DINING GUEST BUTTON FIX (Fully Formatted)
window.updateGuests = function(v) {
    tableGuests += v;
    if (tableGuests < 1) tableGuests = 1;
    if (tableGuests > 20) tableGuests = 20;
    
    const gc = document.getElementById('guest-count');
    if (gc) {
        gc.innerText = `${tableGuests} Guests`;
    }
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
