const RESTAURANT_UPI = "yourupi@okbank"; 
const OWNER_WHATSAPP = "919876543210"; 

let cart = [];
let userLocation = null;
let loggedInUser = localStorage.getItem('kavya_user_name');
let userPhone = localStorage.getItem('kavya_user_phone');
let userCoins = parseInt(localStorage.getItem('kavya_coins') || 0);
let userAddress = localStorage.getItem('kavya_address') || "";
let orderHistory = JSON.parse(localStorage.getItem('kavya_orders') || '[]');
let currentCategory = 'All'; 

const categoryOrder = ['Starters', 'Rolls', 'Paneer', 'Chicken', 'Biryani', 'Curries', 'Sweets', 'Beverages'];
const menuItems = [
    { id: 's1', category: 'Starters', name: 'Crispy Chilli Potato', price: 149, veg: true, rating: '4.3', img: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&q=80' },
    { id: 'r1', category: 'Rolls', name: 'Double Egg Chicken Roll', price: 120, veg: false, rating: '4.7', img: 'https://images.unsplash.com/photo-1549110781-79b88f343f7a?w=600&q=80' },
    { id: 'p1', category: 'Paneer', name: 'Paneer Butter Masala', price: 249, veg: true, rating: '4.5', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600&q=80' },
    { id: 'c1', category: 'Chicken', name: 'Chicken Tikka Kebab', price: 349, veg: false, rating: '4.9', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=600&q=80' },
    { id: 'b1', category: 'Biryani', name: 'Special Chicken Biryani', price: 299, veg: false, rating: '4.8', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80' },
    { id: 'sw1', category: 'Sweets', name: 'Gulab Jamun (2 Pcs)', price: 60, veg: true, rating: '4.9', img: 'https://images.unsplash.com/photo-1596450514735-3b9ffef74c43?w=600&q=80' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Splash Screen Logic
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) { splash.style.opacity = '0'; setTimeout(() => splash.style.display = 'none', 500); }
    }, 1500);

    injectDynamicPages();
    if(loggedInUser) document.getElementById('login-page').innerHTML = getProfileDashboardHTML();
    renderMenu();
    updateCartUI();
});

function injectDynamicPages() {
    const ordersPage = document.createElement('div');
    ordersPage.id = 'orders-page';
    ordersPage.className = 'app-page right-slide-page';
    ordersPage.innerHTML = `<div class="page-header"><i class="fa-solid fa-arrow-left back-btn" onclick="closePage('orders-page')"></i><h2>My Orders</h2><div style="width:24px;"></div></div><div class="page-scroll-content" id="order-history-container" style="padding: 20px;"></div>`;
    document.body.appendChild(ordersPage);
    const taskbar = document.getElementById('smart-taskbar');
    if(taskbar && !document.getElementById('nav-orders-btn')) {
        const orderBtn = document.createElement('div');
        orderBtn.className = 'nav-item'; orderBtn.id = 'nav-orders-btn';
        orderBtn.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i><span>Orders</span>';
        orderBtn.onclick = () => openOrdersPage();
        taskbar.insertBefore(orderBtn, taskbar.children[2]);
    }
}

function showToast(message, type="success") {
    const toast = document.getElementById('toast-container');
    document.getElementById('toast-message').innerHTML = type === "error" ? `⚠️ ${message}` : `✅ ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function openPage(pageId) {
    if(pageId === 'cart-page') {
        if(!loggedInUser) { showToast("Login required to view cart!", "error"); return openPage('login-page'); }
        if(cart.length === 0) return showToast("Cart is empty!", "error");
        renderCartSheet();
    }
    const page = document.getElementById(pageId);
    if(page) { page.style.display = 'block'; setTimeout(() => page.classList.add('open'), 10); }
}

function closePage(pageId) {
    const page = document.getElementById(pageId);
    if(page) { page.classList.remove('open'); setTimeout(() => page.style.display = 'none', 350); }
}

function saveUserLogin() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    if(name.trim() === "" || phone.length !== 10) return showToast("Enter valid Name & 10-Digit Mobile.", "error");
    loggedInUser = name; userPhone = phone; userCoins = 50;
    localStorage.setItem('kavya_user_name', name); localStorage.setItem('kavya_user_phone', phone);
    if(!localStorage.getItem('kavya_coins')) localStorage.setItem('kavya_coins', userCoins);
    document.getElementById('login-page').innerHTML = getProfileDashboardHTML();
    showToast(`Welcome ${name}!`); closePage('login-page');
}

function logoutUser() {
    if(confirm("Logout from Kavya VIP?")) { localStorage.clear(); location.reload(); }
}

function getProfileDashboardHTML() {
    return `<div class="page-header"><i class="fa-solid fa-arrow-left back-btn" onclick="closePage('login-page')"></i><h2>My Profile</h2><div style="width:24px;"></div></div>
    <div class="page-scroll-content" style="padding: 20px; text-align:center;">
        <div style="width:80px; height:80px; background:#111; border-radius:50%; margin:0 auto 10px; display:flex; justify-content:center; align-items:center; border:2px solid var(--accent-neon);"><i class="fa-solid fa-user" style="font-size:30px; color:var(--text-muted);"></i></div>
        <h3 style="color:#fff; margin:0;">${loggedInUser}</h3><p style="color:var(--text-muted); font-size:12px;">+91 ${userPhone}</p>
        <div style="background:#111; border:1px solid #222; border-radius:15px; padding:20px; margin:20px 0;">
            <h4 style="color:var(--liquid-gold); margin:0;"><i class="fa-solid fa-coins"></i> Kavya Coins: <span style="font-size:22px; color:var(--accent-neon);"> ${userCoins}</span></h4>
        </div>
        <button style="width:100%; background:#222; color:#fff; padding:12px; border-radius:8px; font-weight:800; border:1px solid #444;" onclick="logoutUser()">Logout</button>
    </div>`;
}

function setCategory(cat, el) {
    currentCategory = cat;
    document.querySelectorAll('.category-item').forEach(e => e.classList.remove('active'));
    el.classList.add('active'); filterMenu();
}

function filterMenu() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const container = document.getElementById('menu-items');
    container.innerHTML = ''; 
    let sorted = [...menuItems].sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
    const filtered = sorted.filter(i => (currentCategory === 'All' || i.category === currentCategory) && i.name.toLowerCase().includes(search));
    
    if(filtered.length === 0) { container.innerHTML = `<div style="grid-column: span 2; text-align:center; padding:40px; color:#888;">No dishes found.</div>`; return; }

    filtered.forEach(item => {
        const cItem = cart.find(i => i.id === item.id);
        const btn = cItem 
            ? `<div style="display:flex; justify-content:space-between; align-items:center; background:#111; border:1px solid var(--zomato-red); border-radius:6px; padding:2px;"><button style="background:transparent; color:var(--zomato-red); border:none; padding:0 10px; font-size:16px; font-weight:900;" onclick="updateQty('${item.id}', -1)">-</button><div style="color:#fff; font-size:12px; font-weight:800;">${cItem.quantity}</div><button style="background:transparent; color:var(--zomato-red); border:none; padding:0 10px; font-size:16px; font-weight:900;" onclick="updateQty('${item.id}', 1)">+</button></div>`
            : `<button style="width:100%; background:rgba(226,55,68,0.1); color:var(--zomato-red); border:1px solid var(--zomato-red); padding:6px; border-radius:6px; font-weight:800; font-size:12px;" onclick="addToCart('${item.id}')">ADD</button>`;

        container.innerHTML += `
        <div class="premium-food-card">
            <div class="food-image-wrapper"><img src="${item.img}" loading="lazy"></div>
            <div class="food-info">
                <div style="width:10px; height:10px; border:1px solid ${item.veg ? 'var(--veg-green)' : 'var(--nonveg-red)'}; display:flex; justify-content:center; align-items:center; margin-bottom:5px;"><div style="width:4px; height:4px; border-radius:50%; background:${item.veg ? 'var(--veg-green)' : 'var(--nonveg-red)'};"></div></div>
                <h3 style="margin:0 0 2px 0; font-size:13px; color:#fff; font-weight:600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h3>
                <div style="font-size:13px; font-weight:800; color:#fff; margin-bottom:8px;">₹${item.price}</div>
                ${btn}
            </div>
        </div>`;
    });
}

function addToCart(id) { 
    if(!loggedInUser) { showToast("Login Required to Add Items!", "error"); return openPage('login-page'); }
    cart.push({ ...menuItems.find(i => i.id === id), quantity: 1 }); 
    updateCartUI(); filterMenu(); showToast("Added to Cart"); 
}

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
        else { badge.classList.add('hidden'); document.querySelector('.cart-nav i').style.color = 'var(--text-muted)'; closePage('cart-page'); }
    }
}

function renderCartSheet() {
    const c = document.getElementById('cart-items-container'); c.innerHTML = '';
    let subtotal = 0;
    cart.forEach(i => { 
        subtotal += (i.price * i.quantity);
        c.innerHTML += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#111; padding:12px; border-radius:8px;">
            <div style="width:50%;"><div style="font-size:13px; color:#fff;">${i.name}</div></div>
            <div style="color:#fff; font-weight:800;">₹${i.price * i.quantity}</div>
        </div>`; 
    });
    c.innerHTML += `<div style="margin-top:20px; border-top:1px dashed #444; padding-top:15px; display:flex; justify-content:space-between; color:#fff; font-size:18px; font-weight:800;"><span>Total to Pay</span><span style="color:var(--zomato-red);">₹${subtotal + 30}</span></div>`;
    c.innerHTML += `<button style="width:100%; background:var(--zomato-red); color:#fff; padding:14px; border-radius:8px; font-weight:800; border:none; margin-top:20px; font-size:15px;" onclick="alert('Order Placed Successfully! (Demo Mode)')">Place Order</button>`;
}

function openOrdersPage() { openPage('orders-page'); }

// Scroll Shrink Magic
let scrollTimeout;
window.addEventListener('scroll', () => {
    const taskbar = document.getElementById('smart-taskbar');
    if(taskbar) { taskbar.classList.add('shrink'); clearTimeout(scrollTimeout); scrollTimeout = setTimeout(() => taskbar.classList.remove('shrink'), 200); }
    const header = document.getElementById('main-header');
    if(header) { if(window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled'); }
}, {passive: true});
