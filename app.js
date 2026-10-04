/* =========================================
   KAVYA MAX TIER - LEGEND ENGINE
   ========================================= */

let cart = [];
let userLocation = null;
let loggedInUser = null;
let userPhone = null;
let userCoins = 0;
let currentCategory = 'All'; 
const RESTAURANT_UPI = "yourupi@okbank"; 

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-container');
    const msg = document.getElementById('toast-message');
    let icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation" style="color:var(--nonveg-red);"></i>' : '<i class="fa-solid fa-circle-check" style="color:var(--veg-green);"></i>';
    if(type === 'info') icon = '<i class="fa-solid fa-bell" style="color:var(--accent-neon);"></i>';
    msg.innerHTML = `${icon} ${message}`;
    toast.className = 'toast-hidden';
    if(type === 'error') toast.classList.add('error');
    if(type === 'success') toast.classList.add('success');
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 1. INIT & MANDATORY LOGIN
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    renderMenu();
    initCanvasCrossfade();
    initSearchAnimation();
    initSmartTaskbar();
});

function checkLoginStatus() {
    const name = localStorage.getItem('kavya_name');
    const phone = localStorage.getItem('kavya_phone');
    if(name && phone) {
        loggedInUser = name; userPhone = phone;
        userCoins = parseInt(localStorage.getItem('kavya_coins') || 0);
        document.getElementById('header-coin-balance').innerText = userCoins;
        requestLocation();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
    }
}

function saveUserLogin() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    if(name.trim() === "" || phone.length !== 10) { showToast("Enter valid details.", "error"); return; }
    localStorage.setItem('kavya_name', name);
    localStorage.setItem('kavya_phone', phone);
    if(!localStorage.getItem('kavya_coins')) localStorage.setItem('kavya_coins', 50);
    document.getElementById('login-screen').classList.add('hidden');
    checkLoginStatus();
    showToast(`Welcome VIP, ${name.split(" ")[0]}!`);
}

function requestLocation() {
    const locText = document.getElementById('user-location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLocation = `${pos.coords.latitude},${pos.coords.longitude}`;
                locText.innerHTML = `<span class="gps-pulse"></span> <span style="color:var(--veg-green);">Live Location Active</span>`;
            },
            () => { showToast("Allow location for delivery.", "error"); }
        );
    }
}

// 2. UI ANIMATIONS (Smart Taskbar, Canvas, Search)
function initSmartTaskbar() {
    let lastScrollY = window.scrollY;
    const taskbar = document.getElementById('smart-taskbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > lastScrollY && window.scrollY > 100) {
            taskbar.classList.add('hidden-taskbar');
        } else {
            taskbar.classList.remove('hidden-taskbar');
        }
        lastScrollY = window.scrollY;
    });
}

function initCanvasCrossfade() {
    const slides = document.querySelectorAll('.canvas-slide');
    if(slides.length < 2) return;
    let curr = 0;
    setInterval(() => {
        slides[curr].classList.remove('active');
        curr = (curr + 1) % slides.length;
        slides[curr].classList.add('active');
    }, 4000);
}

function initSearchAnimation() {
    const texts = ["Search for Biryani...", "Search for Rolls...", "Search for Paneer...", "Craving Sweets?"];
    let i = 0;
    setInterval(() => {
        document.getElementById('search-input').placeholder = texts[i];
        i = (i + 1) % texts.length;
    }, 2500);
}

// 3. MENU DATA (Proper Sequence & Unsplash HQ Images for Dishes)
const menuItems = [
    { id: 's1', category: 'Starters', name: 'Crispy Chilli Potato', price: 149, veg: true, rating: '4.5', badge: '🔥 BESTSELLER', stock: true, img: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&q=80', desc: 'Crispy fried potatoes tossed in spicy sauce.' },
    { id: 's2', category: 'Starters', name: 'Chicken Tikka Kebab', price: 349, veg: false, rating: '4.9', badge: '', stock: true, img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=600&q=80', desc: 'Smoky, charcoal-grilled chicken.' },
    { id: 'p1', category: 'Paneer', name: 'Paneer Tikka Dry', price: 220, veg: true, rating: '4.7', badge: '', stock: true, img: 'https://images.unsplash.com/photo-1567158442358-8687a41209b5?w=600&q=80', desc: 'Tandoori marinated soft paneer cubes.' },
    { id: 'r1', category: 'Rolls', name: 'Double Egg Chicken Roll', price: 120, veg: false, rating: '4.7', badge: '🔥 BESTSELLER', stock: true, img: 'https://images.unsplash.com/photo-1549110781-79b88f343f7a?w=600&q=80', desc: 'Crispy paratha with spicy chicken.' },
    { id: 'r2', category: 'Rolls', name: 'Paneer Kathi Roll', price: 100, veg: true, rating: '4.4', badge: '', stock: false, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80', desc: 'Tangy paneer filling with mint chutney.' },
    { id: 'c1', category: 'Chicken', name: 'Butter Chicken', price: 320, veg: false, rating: '4.8', badge: '', stock: true, img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80', desc: 'Creamy tomato gravy.' },
    { id: 'b1', category: 'Biryani', name: 'Special Chicken Biryani', price: 299, veg: false, rating: '4.8', badge: '🔥 BESTSELLER', stock: true, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', desc: 'Premium Basmati Rice.' },
    { id: 'cu1', category: 'Curries', name: 'Paneer Butter Masala', price: 249, veg: true, rating: '4.5', badge: '', stock: true, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600&q=80', desc: 'Rich malai paneer gravy.' },
    { id: 'br1', category: 'Breads', name: 'Butter Naan', price: 70, veg: true, rating: '4.6', badge: '', stock: true, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', desc: 'Hot crispy tandoori naan.' },
    { id: 'sw1', category: 'Sweets', name: 'Gulab Jamun (2 Pcs)', price: 60, veg: true, rating: '4.9', badge: '', stock: true, img: 'https://images.unsplash.com/photo-1596450514735-3b9ffef74c43?w=600&q=80', desc: 'Hot milk dumplings.' },
    { id: 'bv1', category: 'Beverages', name: 'Punjabi Lassi', price: 99, veg: true, rating: '4.7', badge: '', stock: true, img: 'https://images.unsplash.com/photo-1571115177098-24de444bb27b?w=600&q=80', desc: 'Chilled sweet yogurt.' }
];

// Fixed Order for "All" Tab
const categoryOrder = ['Starters', 'Paneer', 'Rolls', 'Chicken', 'Biryani', 'Curries', 'Breads', 'Sweets', 'Beverages'];

function setCategory(cat, el) {
    currentCategory = cat;
    document.querySelectorAll('.category-item').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    filterMenu();
}

function filterMenu() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const container = document.getElementById('menu-items');
    container.innerHTML = ''; 

    // Sort items so 'All' displays in perfect sequence
    let sortedItems = [...menuItems].sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));

    const filtered = sortedItems.filter(item => {
        const matchCat = currentCategory === 'All' || item.category === currentCategory;
        const matchSearch = item.name.toLowerCase().includes(search);
        return matchCat && matchSearch;
    });

    if(filtered.length === 0) { container.innerHTML = `<div class="no-results">No dishes found.</div>`; return; }

    filtered.forEach(item => {
        let badgeHTML = !item.stock ? `<div class="badge-out">Out of Stock</div>` : (item.badge ? `<div class="badge-fire">${item.badge}</div>` : '');
        let buttonHTML = !item.stock ? `<button class="glass-btn btn-disabled" disabled>ADD</button>` : '';
        
        if(item.stock) {
            const cItem = cart.find(i => i.id === item.id);
            buttonHTML = cItem 
                ? `<div class="qty-controls"><button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button><div class="qty-count">${cItem.quantity}</div><button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button></div>`
                : `<button class="glass-btn" onclick="addToCart('${item.id}')">ADD</button>`;
        }

        container.innerHTML += `
        <div class="premium-food-card">
            <div class="food-image-wrapper"><img src="${item.img}" loading="lazy">${badgeHTML}</div>
            <div class="food-info">
                <div class="food-header">
                    <div><div class="veg-nonveg ${item.veg ? 'veg' : 'non-veg'}"></div><h3 class="food-title">${item.name}</h3><p class="food-rating">⭐ 4.5</p></div>
                    ${buttonHTML}
                </div>
                <div class="food-price">₹${item.price}</div>
                <p class="food-desc">${item.desc}</p>
            </div>
        </div>`;
    });
}

// 4. CART & BILLING
function addToCart(id) {
    cart.push({ ...menuItems.find(i => i.id === id), quantity: 1 });
    updateCartUI(); filterMenu(); showToast(`Added to cart!`);
}
function updateQty(id, amt) {
    const idx = cart.findIndex(i => i.id === id);
    if(idx > -1) { cart[idx].quantity += amt; if(cart[idx].quantity <= 0) cart.splice(idx, 1); }
    updateCartUI(); filterMenu();
    if(document.getElementById('checkout-sheet').classList.contains('open')) renderCartSheet();
}
function updateCartUI() {
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('nav-cart-count');
    if(total > 0) { badge.classList.remove('hidden'); badge.innerText = total; document.querySelector('.cart-nav i').style.color = 'var(--accent-neon)'; } 
    else { badge.classList.add('hidden'); document.querySelector('.cart-nav i').style.color = '#777'; if(document.getElementById('checkout-sheet').classList.contains('open')) closeAllSheets(); }
}

function openCartSheet() {
    if(cart.length === 0) return showToast("Cart is empty!", "error");
    renderCartSheet();
    document.getElementById('checkout-sheet').classList.add('open');
}

function renderCartSheet() {
    const c = document.getElementById('cart-items-container'); c.innerHTML = '';
    cart.forEach(i => { c.innerHTML += `<div class="cart-row"><div><div class="cart-row-title">${i.name}</div><div class="cart-row-price">₹${i.price * i.quantity}</div></div><div class="qty-controls" style="height:28px;"><button class="qty-btn" onclick="updateQty('${i.id}', -1)">-</button><div class="qty-count">${i.quantity}</div><button class="qty-btn" onclick="updateQty('${i.id}', 1)">+</button></div></div>`; });
    calculateFinalBill();
}

function calculateFinalBill() {
    const sub = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    document.getElementById('bill-subtotal').innerText = sub;
    let disc = 0;
    if(document.getElementById('use-coins-check').checked) {
        disc = Math.min(userCoins, Math.floor(sub * 0.10));
        if(disc > 0) { document.getElementById('coin-discount-row').classList.remove('hidden'); document.getElementById('bill-discount').innerText = disc; }
        else { showToast("Not enough coins.", "error"); document.getElementById('use-coins-check').checked = false; }
    } else { document.getElementById('coin-discount-row').classList.add('hidden'); }
    document.getElementById('bill-total').innerText = sub - disc;
}

// 5. FULL SCREEN SHEETS & ACTIONS
function closeAllSheets() { document.querySelectorAll('.full-screen-sheet').forEach(s => s.classList.remove('open')); }
function openProfileSheet() { document.getElementById('prof-name').innerText = loggedInUser; document.getElementById('prof-phone').innerText = `+91 ${userPhone}`; document.getElementById('prof-coins').innerText = userCoins; document.getElementById('profile-sheet').classList.add('open'); }
function logoutUser() { localStorage.clear(); location.reload(); }
function openDiningSheet() { document.getElementById('dining-sheet').classList.add('open'); document.getElementById('booking-form').classList.add('hidden'); }
function openBookingForm(t) { document.getElementById('selected-table-name').innerText = `Selected: ${t}`; document.getElementById('booking-form').classList.remove('hidden'); }
function submitBooking() { showToast("Booking request sent to Admin!", "success"); closeAllSheets(); }

function processCheckout(method) {
    if(!userLocation) return requestLocation();
    const sub = parseInt(document.getElementById('bill-subtotal').innerText);
    const disc = document.getElementById('use-coins-check').checked ? parseInt(document.getElementById('bill-discount').innerText) : 0;
    
    document.getElementById('loading-overlay').classList.remove('hidden');
    
    setTimeout(() => {
        document.getElementById('loading-overlay').classList.add('hidden');
        if(method === 'COD') { showToast("Order placed via COD!", "success"); closeAllSheets(); cart=[]; updateCartUI(); filterMenu(); }
        else {
            window.location.href = `upi://pay?pa=${RESTAURANT_UPI}&pn=Kavya%20VIP&am=${sub - disc}&cu=INR`;
            setTimeout(() => { if(confirm("If UPI failed, send via WhatsApp?")) { window.open(`https://wa.me/919876543210?text=VIP%20Order`, '_blank'); closeAllSheets(); cart=[]; updateCartUI(); filterMenu(); } }, 2000);
        }
    }, 2000);
}
 
