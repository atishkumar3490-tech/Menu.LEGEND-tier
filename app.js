// --- GLOBAL DATA & STATE ---
let cart = [];
let loggedInUser = localStorage.getItem('kavya_user_name');
let userPhone = localStorage.getItem('kavya_user_phone');
let userCoins = parseInt(localStorage.getItem('kavya_coins') || 0);
let userAddress = localStorage.getItem('kavya_address') || "";
let userProfilePic = localStorage.getItem('kavya_profile_pic') || "https://via.placeholder.com/150/111/888?text=VIP";
let currentCategory = 'All'; 
let selectedItemIdForFlavor = null;
let currentSpice = 'Mild';

// Real HD Wide Images for Menu
const menuItems = [
    { id: 'b1', category: 'Biryani', name: 'Nawabi Chicken Biryani', price: 299, veg: false, meta: '⚡ 20-25 mins | 1.2 km', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&q=80' },
    { id: 'cu1', category: 'Curries', name: 'Shiva Chhappan Bhog (Chole Bhature)', price: 190, veg: true, meta: '⚡ 15-20 mins | 0.8 km', img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1000&q=80' },
    { id: 'c1', category: 'Curries', name: 'Paneer Butter Masala', price: 249, veg: true, meta: '⚡ 25-30 mins | 1.5 km', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=1000&q=80' },
    { id: 'r1', category: 'Rolls', name: 'Double Egg Chicken Roll', price: 120, veg: false, meta: '⚡ 10-15 mins | 0.5 km', img: 'https://images.unsplash.com/photo-1549110781-79b88f343f7a?w=1000&q=80' },
    { id: 'sw1', category: 'Sweets', name: 'Hot Gulab Jamun', price: 60, veg: true, meta: '⚡ 10-15 mins | 0.5 km', img: 'https://images.unsplash.com/photo-1596450514735-3b9ffef74c43?w=1000&q=80' }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) { splash.style.opacity = '0'; setTimeout(() => splash.style.display = 'none', 500); }
    }, 1500);

    // 2. Rotating Search Text
    const placeholders = ['Search "Biryani"...', 'Search "Chole Bhature"...', 'Search "Paneer"...', 'Craving Sweets?'];
    let pIdx = 0;
    setInterval(() => {
        document.querySelectorAll('.search-input-rotate').forEach(inp => inp.placeholder = placeholders[pIdx]);
        pIdx = (pIdx + 1) % placeholders.length;
    }, 2500);

    // 3. Bespoke Greeting Logic (Time based)
    const hours = new Date().getHours();
    let greeting = "Ready for a treat?";
    if(hours < 12) greeting = `Good Morning${loggedInUser ? ', '+loggedInUser : ''}! Perfect time for Breakfast.`;
    else if(hours < 16) greeting = `Hungry${loggedInUser ? ', '+loggedInUser : ''}? Grab a VIP Lunch!`;
    else greeting = `Rough day${loggedInUser ? ', '+loggedInUser : ''}? Your Comfort Dinner is ready.`;
    document.getElementById('dynamic-greeting').innerText = greeting;

    // 4. Update Profile Pic everywhere
    document.getElementById('nav-profile-pic').src = userProfilePic;

    renderAuthPage();
    renderMenu();
    updateCartUI();
});

// --- CORE FUNCTIONS ---
function showToast(message, type="success") {
    const toast = document.getElementById('toast-container');
    document.getElementById('toast-message').innerHTML = type === "error" ? `⚠️ ${message}` : `✅ ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function openPage(pageId) {
    if(pageId === 'cart-page') {
        if(!loggedInUser) { showToast("Login Required for Checkout!", "error"); return openPage('login-page'); }
        if(cart.length === 0) return showToast("Cart is empty!", "error");
        renderCartSheet();
    }
    const page = document.getElementById(pageId);
    if(page) { page.style.display = 'block'; setTimeout(() => page.classList.add('open'), 10); }
}

function closePage(pageId) {
    const page = document.getElementById(pageId);
    if(page) { page.classList.remove('open'); setTimeout(() => page.style.display = 'none', 300); }
}

// --- GPS LOCATION ---
function requestLocation() {
    const locText = document.getElementById('user-location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                showToast("GPS Location Captured!");
                if(locText) locText.innerHTML = `Live Location Set <i class="fa-solid fa-chevron-down" style="font-size: 10px;"></i>`;
            },
            (error) => { showToast("Location Denied. Using Default.", "error"); }
        );
    }
}

// --- PROFILE & AUTH ---
function renderAuthPage() {
    const container = document.getElementById('login-form-container');
    if(loggedInUser) {
        const progress = Math.min((userCoins / 500) * 100, 100);
        container.innerHTML = `
            <div style="text-align:center;">
                <div class="profile-upload-wrapper">
                    <img id="dashboard-pic" src="${userProfilePic}">
                    <div class="edit-badge" onclick="document.getElementById('pic-upload').click()"><i class="fa-solid fa-camera"></i></div>
                    <input type="file" id="pic-upload" accept="image/*" hidden onchange="uploadProfilePic(event)">
                </div>
                <h3 style="color:#fff; margin-top:10px;">${loggedInUser}</h3>
                <p style="color:#888; font-size:12px;">+91 ${userPhone}</p>
                
                <div style="background:#111; border:1px solid #333; border-radius:15px; padding:20px; margin:20px 0; text-align:left;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <h4 style="color:var(--liquid-gold); margin:0;"><i class="fa-solid fa-coins"></i> Kavya Coins</h4>
                        <span style="font-size:22px; color:var(--accent-neon); font-weight:800;">${userCoins}</span>
                    </div>
                    <div class="progress-bar-container"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
                    <p style="font-size:11px; color:#888; margin-top:5px;">Reach 500 Coins for a FREE Biryani!</p>
                </div>
                <button class="primary-btn" style="background:#222; color:#fff; border:1px solid #444;" onclick="logoutUser()">Logout</button>
            </div>`;
    } else {
        container.innerHTML = `
            <div style="text-align:center; margin-bottom: 30px;">
                <h1 style="color: var(--liquid-gold); font-size: 35px; font-weight: 900; margin: 0;">KAVYA</h1>
                <p style="color: var(--accent-neon); letter-spacing: 2px; font-size: 12px;">LOGIN REQUIRED</p>
            </div>
            <input type="text" id="user-name" class="custom-input" placeholder="Full Name (Required)">
            <input type="tel" id="user-phone" class="custom-input" placeholder="10-Digit Mobile (Required)" maxlength="10">
            <button class="primary-btn" onclick="saveUserLogin()">Continue Securely</button>`;
    }
}

function saveUserLogin() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    if(name.trim() === "" || phone.length !== 10) return showToast("Enter valid Name & Mobile.", "error");
    loggedInUser = name; userPhone = phone; userCoins = 50;
    localStorage.setItem('kavya_user_name', name); localStorage.setItem('kavya_user_phone', phone);
    if(!localStorage.getItem('kavya_coins')) localStorage.setItem('kavya_coins', userCoins);
    renderAuthPage(); showToast(`Welcome ${name}!`); closePage('login-page');
    setTimeout(() => location.reload(), 1000); // Reload to update greetings
}

function logoutUser() { if(confirm("Logout from Kavya VIP?")) { localStorage.clear(); location.reload(); } }

function uploadProfilePic(event) {
    const file = event.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userProfilePic = e.target.result;
            localStorage.setItem('kavya_profile_pic', userProfilePic);
            document.getElementById('dashboard-pic').src = userProfilePic;
            document.getElementById('nav-profile-pic').src = userProfilePic;
            showToast("Profile Picture Updated!");
        };
        reader.readAsDataURL(file);
    }
}

// --- MENU & FLAVOR SLIDER ---
function setCategory(cat, el) {
    currentCategory = cat;
    document.querySelectorAll('.category-item').forEach(e => e.classList.remove('active'));
    el.classList.add('active'); filterMenu();
}

function filterMenu() {
    const search = document.querySelector('.search-input').value.toLowerCase();
    const container = document.getElementById('menu-items');
    container.innerHTML = ''; 
    const filtered = menuItems.filter(i => (currentCategory === 'All' || i.category === currentCategory) && i.name.toLowerCase().includes(search));
    
    if(filtered.length === 0) { container.innerHTML = `<div style="text-align:center; padding:40px; color:#888;">No dishes found.</div>`; return; }

    filtered.forEach(item => {
        const cItem = cart.find(i => i.id === item.id);
        const vegColor = item.veg ? 'var(--veg-green)' : 'var(--nonveg-red)';
        const btn = cItem 
            ? `<div class="qty-btn-group"><button onclick="updateQty('${item.id}', -1)">-</button><div style="color:#fff; font-size:14px; font-weight:800;">${cItem.quantity}</div><button onclick="updateQty('${item.id}', 1)">+</button></div>`
            : `<button style="background:rgba(226,55,68,0.1); color:var(--zomato-red); border:1px solid var(--zomato-red); padding:8px 25px; border-radius:8px; font-weight:800; font-size:14px;" onclick="openFlavorSlider('${item.id}')">ADD</button>`;

        container.innerHTML += `
        <div class="wide-food-card">
            <div class="wide-img-box"><img src="${item.img}" loading="lazy"><div class="bookmark-icon"><i class="fa-regular fa-bookmark"></i></div></div>
            <div class="wide-info">
                <div style="width: 65%;">
                    <div style="width:14px; height:14px; border:1px solid ${vegColor}; display:flex; justify-content:center; align-items:center; margin-bottom:8px; border-radius:3px;"><div style="width:6px; height:6px; border-radius:50%; background:${vegColor};"></div></div>
                    <h3>${item.name}</h3>
                    <div class="meta-text">${item.meta}</div>
                    <div class="price-text">₹${item.price}</div>
                </div>
                <div>${btn}</div>
            </div>
        </div>`;
    });
}

function openFlavorSlider(id) {
    if(!loggedInUser) { showToast("Login Required to Add Items!", "error"); return openPage('login-page'); }
    selectedItemIdForFlavor = id;
    document.getElementById('flavor-slider-modal').classList.remove('hidden');
}

function setSpice(el, level) {
    document.querySelectorAll('.spice-btn').forEach(btn => btn.classList.remove('active'));
    el.classList.add('active');
    currentSpice = level;
}

document.getElementById('confirm-flavor-btn').addEventListener('click', () => {
    document.getElementById('flavor-slider-modal').classList.add('hidden');
    const item = menuItems.find(i => i.id === selectedItemIdForFlavor);
    cart.push({ ...item, quantity: 1, spice: currentSpice }); 
    updateCartUI(); filterMenu(); showToast(`Added to Cart (${currentSpice})`); 
});

// --- CART & CHECKOUT ---
function updateQty(id, amt) { 
    const idx = cart.findIndex(i => i.id === id); 
    if(idx > -1) { cart[idx].quantity += amt; if(cart[idx].quantity <= 0) cart.splice(idx, 1); } 
    updateCartUI(); filterMenu(); 
    if(document.getElementById('cart-page').classList.contains('open')) renderCartSheet(); 
}

function updateCartUI() {
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('nav-cart-count');
    if(badge) {
        if(total > 0) { badge.classList.remove('hidden'); badge.innerText = total; document.querySelector('.cart-nav i').style.color = 'var(--zomato-red)'; } 
        else { badge.classList.add('hidden'); document.querySelector('.cart-nav i').style.color = '#888'; closePage('cart-page'); }
    }
}

function renderCartSheet() {
    const c = document.getElementById('cart-items-container'); c.innerHTML = '';
    let subtotal = 0;
    
    // Delivery Address Bar
    c.innerHTML += `
        <h4 style="color:#fff; margin-bottom:10px;">Delivery Address</h4>
        <input type="text" id="cart-address" class="custom-input" placeholder="Enter Full Address..." value="${userAddress}" onchange="localStorage.setItem('kavya_address', this.value); userAddress=this.value;">
        <h4 style="color:#fff; margin:20px 0 10px;">Your Items</h4>
    `;

    // Cart Items with Thumbnails
    cart.forEach(i => { 
        subtotal += (i.price * i.quantity);
        const vegColor = i.veg ? 'var(--veg-green)' : 'var(--nonveg-red)';
        c.innerHTML += `
        <div class="cart-item-row">
            <img src="${i.img}" class="cart-thumb">
            <div class="cart-item-info">
                <div style="display:flex; align-items:center; gap:5px; margin-bottom:3px;">
                    <div style="width:10px; height:10px; border:1px solid ${vegColor}; display:flex; justify-content:center; align-items:center; border-radius:2px;"><div style="width:4px; height:4px; border-radius:50%; background:${vegColor};"></div></div>
                    <span style="font-size:13px; color:#fff; font-weight:600;">${i.name}</span>
                </div>
                <div style="font-size:11px; color:#888;">Spice: ${i.spice}</div>
                <div style="color:#fff; font-weight:800; font-size:14px; margin-top:5px;">₹${i.price * i.quantity}</div>
            </div>
            <div class="qty-btn-group"><button onclick="updateQty('${i.id}', -1)">-</button><div style="color:#fff; font-size:14px; font-weight:800;">${i.quantity}</div><button onclick="updateQty('${i.id}', 1)">+</button></div>
        </div>`; 
    });

    // Bill Breakdown & Payment Buttons
    c.innerHTML += `
        <div style="margin-top:20px; border-top:1px solid #333; padding-top:15px;">
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:10px;"><span>Subtotal</span><span>₹${subtotal}</span></div>
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:10px;"><span>Delivery Fee</span><span>₹30</span></div>
            <div style="display:flex; justify-content:space-between; color:#fff; font-size:18px; font-weight:900; margin-top:15px; border-top:1px dashed #444; padding-top:15px;"><span>Grand Total</span><span style="color:var(--accent-neon);">₹${subtotal + 30}</span></div>
        </div>
        <div style="display:flex; gap:10px; margin-top:25px;">
            <button style="flex:1; background:#222; color:#fff; border:1px solid #444; padding:15px; border-radius:8px; font-weight:800;" onclick="placeOrderFinal('COD')">Pay on Delivery</button>
            <button style="flex:1.5; background:var(--zomato-red); color:#fff; border:none; padding:15px; border-radius:8px; font-weight:900;" onclick="placeOrderFinal('UPI')">Pay via UPI <i class="fa-solid fa-bolt"></i></button>
        </div>`;
}

function placeOrderFinal(method) {
    if(document.getElementById('cart-address').value.trim() === "") return showToast("Address is required!", "error");
    
    closePage('cart-page');
    cart = []; updateCartUI(); filterMenu();
    
    // Kavya Coin Gamification
    const earned = Math.floor(Math.random() * 30) + 10; 
    userCoins += earned;
    localStorage.setItem('kavya_coins', userCoins);
    
    document.getElementById('earned-coins').innerText = earned;
    document.getElementById('coin-celebration').classList.remove('hidden');
    
    setTimeout(() => { renderAuthPage(); }, 2000); // Update dashboard behind the scenes
}

// Top Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if(header) { if(window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled'); }
}, {passive: true});
