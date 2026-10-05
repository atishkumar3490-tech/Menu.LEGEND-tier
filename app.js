/* =========================================
   APP.JS - Core Logic & State Management
   ========================================= */

// --- STATE ---
window.loggedInUser = localStorage.getItem('kavya_user_name');
let userPhone = localStorage.getItem('kavya_user_phone');
let userCoins = parseInt(localStorage.getItem('kavya_coins') || 0);
let userAddress = localStorage.getItem('kavya_address') || "";
let userProfilePic = localStorage.getItem('kavya_profile_pic') || "https://via.placeholder.com/150/222/fff?text=VIP";
let orderHistory = JSON.parse(localStorage.getItem('kavya_orders') || '[]');

let cart = [];
let currentCategory = 'All';
let selectedFlavorId = null;
let currentSpice = 'Mild';
let tableGuests = 2;

document.addEventListener('DOMContentLoaded', () => {
    initUI(); // From ui.js
    
    if(window.loggedInUser) {
        document.getElementById('nav-profile-pic').src = userProfilePic;
        document.getElementById('top-coin-bal').innerText = userCoins;
    }
    
    renderMenu();
    updateCartBadge();
    renderAuthPage();
});

// --- NAVIGATION ---
function openPage(pageId) {
    if(pageId === 'cart-page') {
        if(!window.loggedInUser) return showToast("Login Required for Checkout!", "error");
        if(cart.length === 0) return showToast("Your Cart is empty!", "error");
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
    if(!window.loggedInUser) {
        showToast("Please login first to setup location.", "error");
        return openPage('login-page');
    }
    const locText = document.getElementById('user-location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                showToast("GPS Location Captured!");
                if(locText) locText.innerHTML = `Location Set <i class="fa-solid fa-chevron-down text-xs"></i>`;
            },
            (error) => { showToast("Location Denied. Please enter manually.", "error"); }
        );
    }
}

// --- MENU & FLAVOR FILTERING ---
function setCategory(catId, el) {
    currentCategory = catId;
    document.querySelectorAll('.category-item').forEach(btn => btn.classList.remove('active'));
    el.classList.add('active');
    renderMenu();
}

function filterMenu() { renderMenu(); }

function renderMenu() {
    const search = document.getElementById('main-search').value.toLowerCase();
    const container = document.getElementById('menu-items-container');
    container.innerHTML = '';

    const filtered = menuItems.filter(i => (currentCategory === 'All' || i.category === currentCategory) && i.name.toLowerCase().includes(search));
    
    if(filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:50px 20px; color:#888;">No dishes found matching your criteria.</div>`;
        return;
    }

    filtered.forEach(item => {
        const cItem = cart.find(i => i.id === item.id);
        const vegClass = item.veg ? 'text-green' : 'text-red';
        const vegBg = item.veg ? 'var(--veg-green)' : 'var(--nonveg-red)';
        
        const btnHtml = cItem 
            ? `<div class="qty-control"><button onclick="updateQty('${item.id}', -1)">-</button><span style="color:#fff; font-weight:800;">${cItem.quantity}</span><button onclick="updateQty('${item.id}', 1)">+</button></div>`
            : `<button class="add-btn" onclick="openFlavorSelector('${item.id}')">ADD</button>`;

        container.innerHTML += `
        <div class="wide-food-card">
            <div class="wide-img-box">
                <img src="${item.img}" loading="lazy" alt="${item.name}">
                <div class="bookmark-icon" onclick="toggleBookmark(this)"><i class="fa-regular fa-bookmark"></i></div>
            </div>
            <div class="wide-info">
                <div class="food-title-col">
                    <div class="veg-tag" style="border: 1px solid ${vegBg}"><div class="veg-tag-inner" style="background:${vegBg}"></div></div>
                    <h3 class="food-name">${item.name}</h3>
                    <div class="text-xs text-muted font-weight-600">${item.meta}</div>
                    <div class="food-price">₹${item.price}</div>
                </div>
                <div>${btnHtml}</div>
            </div>
        </div>`;
    });
}

// --- FLAVOR SLIDER LOGIC ---
function openFlavorSelector(id) {
    if(!window.loggedInUser) {
        showToast("Login Required to Add Items!", "error");
        return openPage('login-page');
    }
    selectedFlavorId = id;
    openPopup('flavor-slider-modal');
}

function setSpice(el, level) {
    document.querySelectorAll('.spice-btn').forEach(btn => btn.classList.remove('active'));
    el.classList.add('active');
    currentSpice = level;
}

document.getElementById('confirm-flavor-btn').addEventListener('click', () => {
    closePopup('flavor-slider-modal');
    const item = menuItems.find(i => i.id === selectedFlavorId);
    cart.push({ ...item, quantity: 1, spice: currentSpice });
    updateCartBadge(); renderMenu();
    showToast(`Added to Cart (${currentSpice})`);
});

// --- CART & BILLING ---
function updateQty(id, amt) {
    const idx = cart.findIndex(i => i.id === id);
    if(idx > -1) {
        cart[idx].quantity += amt;
        if(cart[idx].quantity <= 0) cart.splice(idx, 1);
    }
    updateCartBadge(); renderMenu();
    if(document.getElementById('cart-page').classList.contains('open')) renderCartSheet();
}

function updateCartBadge() {
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('nav-cart-count');
    if(total > 0) {
        badge.classList.remove('hidden'); badge.innerText = total;
        document.querySelector('.cart-nav i').style.color = 'var(--zomato-red)';
    } else {
        badge.classList.add('hidden');
        document.querySelector('.cart-nav i').style.color = 'var(--text-muted)';
        closePage('cart-page');
    }
}

function renderCartSheet() {
    const c = document.getElementById('cart-items-container');
    c.innerHTML = '';
    let subtotal = 0;

    // Delivery Address Bar
    c.innerHTML += `
        <div style="background:#111; padding:15px; border-radius:12px; margin-bottom:20px; border:1px solid #222;">
            <label style="color:#888; font-size:12px;">Delivery Address (Required)</label>
            <textarea id="cart-address" class="custom-input mt-5" rows="2" placeholder="Enter Full Address...">${userAddress}</textarea>
        </div>
        <h4 style="color:#fff; margin-bottom:15px;">Your Order</h4>
    `;

    cart.forEach(i => {
        subtotal += (i.price * i.quantity);
        c.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:15px; border-radius:12px; margin-bottom:10px; border:1px solid #222;">
            <div style="width: 50%;">
                <div style="font-size:14px; color:#fff; font-weight:700;">${i.name}</div>
                <div style="font-size:11px; color:#888;">Spice: ${i.spice}</div>
                <div style="font-size:15px; color:#fff; font-weight:800; margin-top:5px;">₹${i.price * i.quantity}</div>
            </div>
            <div class="qty-control"><button onclick="updateQty('${i.id}', -1)">-</button><span style="color:#fff; font-weight:800;">${i.quantity}</span><button onclick="updateQty('${i.id}', 1)">+</button></div>
        </div>`;
    });

    // Bill & Coins
    c.innerHTML += `
        <div style="background:#111; padding:20px; border-radius:12px; margin-top:20px; border:1px solid #222;">
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:10px;"><span>Subtotal</span><span>₹${subtotal}</span></div>
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#ccc; margin-bottom:15px;"><span>Delivery Fee</span><span>₹30</span></div>
            
            <div style="background: rgba(212,175,55,0.05); border: 1px dashed var(--liquid-gold); padding: 12px; border-radius: 10px; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="coins-check" onchange="calculateBill()" style="width:18px; height:18px; accent-color: var(--liquid-gold);">
                    <label style="font-size:12px; color:var(--liquid-gold); font-weight:700;">Use Coins (Bal: ${userCoins})</label>
                </div>
                <span id="coin-discount" class="hidden" style="color:var(--veg-green); font-size:13px; font-weight:800;">-₹0</span>
            </div>

            <div style="display:flex; justify-content:space-between; color:#fff; font-size:18px; font-weight:900; border-top:1px dashed #444; padding-top:15px;">
                <span>Grand Total</span><span style="color:var(--accent-neon);">₹<span id="bill-total">${subtotal + 30}</span></span>
            </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:25px;">
            <button style="flex:1; background:#222; color:#fff; border:1px solid #444; padding:15px; border-radius:12px; font-weight:800;" onclick="placeOrder('COD')">COD</button>
            <button style="flex:1.5; background:var(--zomato-red); color:#fff; border:none; padding:15px; border-radius:12px; font-weight:900;" onclick="placeOrder('UPI')">Pay via UPI <i class="fa-solid fa-bolt"></i></button>
        </div>
    `;
}

function calculateBill() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    const chk = document.getElementById('coins-check');
    const discEl = document.getElementById('coin-discount');

    if(chk && chk.checked) {
        discount = Math.min(userCoins, Math.floor(subtotal * 0.10));
        if(discount === 0) { showToast("Not enough coins.", "error"); chk.checked = false; }
        else { discEl.innerText = `-₹${discount}`; discEl.classList.remove('hidden'); }
    } else {
        discEl.classList.add('hidden');
    }
    document.getElementById('bill-total').innerText = subtotal + 30 - discount;
}

function placeOrder(method) {
    const add = document.getElementById('cart-address').value;
    if(add.trim() === "") return showToast("Address is required!", "error");
    
    // Deduct coins if used
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const chk = document.getElementById('coins-check');
    if(chk && chk.checked) userCoins -= Math.min(userCoins, Math.floor(subtotal * 0.10));

    // Save Address
    userAddress = add; localStorage.setItem('kavya_address', userAddress);

    // Boom! Earn new coins
    const earned = Math.floor(Math.random() * 40) + 10;
    userCoins += earned;
    localStorage.setItem('kavya_coins', userCoins);
    
    closePage('cart-page');
    cart = []; updateCartBadge(); renderMenu();

    // Show 3D Coin Celebration
    document.getElementById('earned-coins').innerText = earned;
    document.getElementById('top-coin-bal').innerText = userCoins;
    openPopup('coin-celebration');
    
    setTimeout(() => { renderAuthPage(); }, 2000);
}

// --- AUTH & PROFILE DASHBOARD ---
function renderAuthPage() {
    const container = document.getElementById('auth-container');
    if(!container) return;

    if(window.loggedInUser) {
        const progress = Math.min((userCoins / 500) * 100, 100);
        container.innerHTML = `
            <div style="text-align:center;">
                <div class="profile-upload-wrapper" style="position:relative; width:100px; height:100px; margin:0 auto 15px;">
                    <img id="dashboard-pic" src="${userProfilePic}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid var(--accent-neon);">
                    <div style="position:absolute; bottom:0; right:0; background:var(--liquid-gold); width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; color:#000; cursor:pointer;" onclick="document.getElementById('pic-upload').click()"><i class="fa-solid fa-camera"></i></div>
                    <input type="file" id="pic-upload" accept="image/*" hidden onchange="uploadPic(event)">
                </div>
                <h3 style="color:#fff;">${window.loggedInUser}</h3>
                <p style="color:#888; font-size:12px;">+91 ${userPhone}</p>
                
                <div class="profile-card mt-20">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="color:var(--liquid-gold); margin:0;"><i class="fa-solid fa-coins"></i> Kavya Coins</h4>
                        <span style="font-size:24px; color:var(--accent-neon); font-weight:900;">${userCoins}</span>
                    </div>
                    <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
                    <p style="font-size:11px; color:#888;">Reach 500 Coins for a FREE Biryani!</p>
                </div>

                <div class="profile-card mt-15" style="padding:15px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                    <div style="color:#fff; font-weight:700;"><i class="fa-solid fa-clock-rotate-left" style="color:var(--text-muted); margin-right:10px;"></i> Order History</div>
                    <i class="fa-solid fa-chevron-right" style="color:#555;"></i>
                </div>

                <!-- INSTAGRAM LINK (Footer) -->
                <a href="${INSTAGRAM_LINK}" target="_blank" style="display:block; text-align:center; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color:#fff; padding:15px; border-radius:12px; font-weight:800; margin-top:20px; text-decoration:none; box-shadow: 0 4px 15px rgba(220, 39, 67, 0.4);">
                    <i class="fa-brands fa-instagram" style="font-size:18px; margin-right:5px;"></i> Follow @kavyafamilyrestaurant
                </a>
                <p style="text-align:center; color:#555; font-size:10px; margin-top:10px; font-weight:800; letter-spacing:2px;">POWERED BY LEGEND</p>

                <button class="primary-btn mt-20" style="background:#222; color:#fff; border:1px solid #444;" onclick="logout()">Logout Securely</button>
            </div>`;
    } else {
        container.innerHTML = `
            <div style="text-align:center; margin-bottom: 40px; margin-top:20px;">
                <h1 class="brand-title-3d" style="font-size:40px;">KAVYA</h1>
                <p style="color: var(--accent-neon); letter-spacing: 2px; font-size: 12px; font-weight:800;">LOGIN REQUIRED</p>
            </div>
            <input type="text" id="user-name" class="custom-input" placeholder="Full Name (Required)">
            <input type="tel" id="user-phone" class="custom-input" placeholder="10-Digit Mobile (Required)" maxlength="10">
            <button class="gold-gradient-btn mt-15" onclick="login()">Enter VIP Portal</button>
        `;
    }
}

function login() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    if(name.trim() === "" || phone.length !== 10) return showToast("Enter valid Name & 10-Digit Mobile.", "error");
    
    window.loggedInUser = name; userPhone = phone; 
    if(!localStorage.getItem('kavya_coins')) { userCoins = 50; localStorage.setItem('kavya_coins', userCoins); }
    localStorage.setItem('kavya_user_name', name); localStorage.setItem('kavya_user_phone', phone);
    
    showToast(`Welcome to Kavya, ${name}!`);
    setTimeout(() => location.reload(), 800); 
}

function logout() { if(confirm("Logout from Kavya VIP?")) { localStorage.clear(); location.reload(); } }

function uploadPic(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            userProfilePic = ev.target.result;
            localStorage.setItem('kavya_profile_pic', userProfilePic);
            document.getElementById('dashboard-pic').src = userProfilePic;
            document.getElementById('nav-profile-pic').src = userProfilePic;
            showToast("Profile Picture Updated!");
        };
        reader.readAsDataURL(file);
    }
}

// --- DINING GUESTS ---
function updateGuests(val) {
    tableGuests += val;
    if(tableGuests < 1) tableGuests = 1;
    if(tableGuests > 20) tableGuests = 20;
    document.getElementById('guest-count').innerText = `${tableGuests} Guests`;
}
