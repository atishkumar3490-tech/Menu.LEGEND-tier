/* =========================================
   KAVYA MAX TIER - ENTERPRISE LEVEL JS
   ========================================= */

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
let useCoins = false;
let useCoupon = false;

const categoryOrder = ['Starters', 'Rolls', 'Paneer', 'Chicken', 'Biryani', 'Curries', 'Sweets', 'Beverages'];

const menuItems = [
    { id: 's1', category: 'Starters', name: 'Crispy Chilli Potato', price: 149, oldPrice: 199, veg: true, rating: '4.3', badge: '', img: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&q=80', desc: 'Crispy fried potatoes tossed in spicy honey chilli sauce.' },
    { id: 's2', category: 'Starters', name: 'Veg Hakka Noodles', price: 179, oldPrice: '', veg: true, rating: '4.4', badge: '', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80', desc: 'Classic wok-tossed noodles with fresh crunchy veggies.' },
    { id: 'r1', category: 'Rolls', name: 'Double Egg Chicken Roll', price: 120, oldPrice: '', veg: false, rating: '4.7', badge: '🔥 BESTSELLER', img: 'https://images.unsplash.com/photo-1549110781-79b88f343f7a?w=600&q=80', desc: 'Crispy paratha with spicy chicken filling.' },
    { id: 'p1', category: 'Paneer', name: 'Paneer Butter Masala', price: 249, oldPrice: 350, veg: true, rating: '4.5', badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600&q=80', desc: 'Rich, creamy tomato gravy with soft malai paneer cubes.' },
    { id: 'c1', category: 'Chicken', name: 'Chicken Tikka Kebab', price: 349, oldPrice: 499, veg: false, rating: '4.9', badge: 'Must Try', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=600&q=80', desc: 'Smoky, charcoal-grilled tender chicken pieces.' },
    { id: 'c2', category: 'Chicken', name: 'Mutton Rogan Josh', price: 450, oldPrice: 550, veg: false, rating: '4.8', badge: 'Spicy', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80', desc: 'Tender mutton chunks cooked in Kashmiri spices.' },
    { id: 'b1', category: 'Biryani', name: 'Special Chicken Biryani', price: 299, oldPrice: 450, veg: false, rating: '4.8', badge: '33% OFF', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', desc: 'Served with Raita & spicy Salan. Premium long-grain Basmati Rice.' },
    { id: 'cu1', category: 'Curries', name: 'Dal Makhani', price: 199, oldPrice: 250, veg: true, rating: '4.2', badge: '', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', desc: 'Slow-cooked black lentils with fresh cream.' },
    { id: 'cu2', category: 'Curries', name: 'Butter Naan (2 Pcs)', price: 70, oldPrice: '', veg: true, rating: '4.6', badge: '', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', desc: 'Hot and crispy tandoori naan dripping with butter.' },
    { id: 'sw1', category: 'Sweets', name: 'Gulab Jamun (2 Pcs)', price: 60, oldPrice: '', veg: true, rating: '4.9', badge: 'Dessert', img: 'https://images.unsplash.com/photo-1596450514735-3b9ffef74c43?w=600&q=80', desc: 'Hot, soft milk dumplings soaked in cardamom sugar syrup.' },
    { id: 'bv1', category: 'Beverages', name: 'Punjabi Sweet Lassi', price: 99, oldPrice: '', veg: true, rating: '4.7', badge: 'Chilled', img: 'https://images.unsplash.com/photo-1571115177098-24de444bb27b?w=600&q=80', desc: 'Thick, chilled sweet yogurt drink topped with malai.' },
    { id: 'bv2', category: 'Beverages', name: 'Fresh Lime Soda', price: 79, oldPrice: '', veg: true, rating: '4.5', badge: '', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80', desc: 'Refreshing summer drink with sweet and salt mix.' }
];

document.addEventListener('DOMContentLoaded', () => {
    injectDynamicPages();
    if(loggedInUser) {
        document.getElementById('login-page').innerHTML = getProfileDashboardHTML();
    }
    const searchTexts = ["Search 'Biryani'...", "Search 'Rolls'...", "Search 'Paneer'...", "Craving Sweets?"];
    let sIdx = 0;
    setInterval(() => {
        const searchInp = document.getElementById('search-input');
        if(searchInp) searchInp.placeholder = searchTexts[sIdx = (sIdx + 1) % searchTexts.length];
    }, 2500);

    requestLocation();
    renderMenu();
    updateCartUI();
});

function injectDynamicPages() {
    const ordersPage = document.createElement('div');
    ordersPage.id = 'orders-page';
    ordersPage.className = 'app-page right-slide-page';
    ordersPage.innerHTML = `
        <div class="page-header"><i class="fa-solid fa-arrow-left back-btn" onclick="closePage('orders-page')"></i><h2>My Orders</h2><div style="width:24px;"></div></div>
        <div class="page-scroll-content" id="order-history-container" style="padding: 20px;"></div>
    `;
    document.body.appendChild(ordersPage);

    const taskbar = document.getElementById('smart-taskbar');
    if(taskbar && !document.getElementById('nav-orders-btn')) {
        const orderBtn = document.createElement('div');
        orderBtn.className = 'nav-item';
        orderBtn.id = 'nav-orders-btn';
        orderBtn.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i><span>Orders</span>';
        orderBtn.onclick = () => openOrdersPage();
        taskbar.insertBefore(orderBtn, taskbar.children[2]);
    }
}

function showToast(message, type="success") {
    const toast = document.getElementById('toast-container');
    const msg = document.getElementById('toast-message');
    msg.innerHTML = type === "error" ? `<i class="fa-solid fa-circle-exclamation" style="color:var(--nonveg-red);"></i> ${message}` : `<i class="fa-solid fa-circle-check" style="color:var(--veg-green);"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function openPage(pageId) {
    if(pageId === 'cart-page') {
        if(cart.length === 0) return showToast("Cart is empty!", "error");
        renderCartSheet();
    }
    const page = document.getElementById(pageId);
    if(page) {
        page.style.display = 'block';
        setTimeout(() => page.classList.add('open'), 10);
    }
}

function closePage(pageId) {
    const page = document.getElementById(pageId);
    if(page) {
        page.classList.remove('open');
        setTimeout(() => page.style.display = 'none', 350);
    }
}

function closeAllSheets() {
    document.querySelectorAll('.right-slide-page').forEach(p => closePage(p.id));
}

function requestLocation() {
    const locText = document.getElementById('user-location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLocation = `${pos.coords.latitude},${pos.coords.longitude}`;
                if(locText) locText.innerHTML = `Live Location Set <i class="fa-solid fa-chevron-down" style="font-size: 10px;"></i>`;
            },
            (error) => {
                if(locText) locText.innerHTML = `Location Required <i class="fa-solid fa-chevron-down" style="font-size: 10px;"></i>`;
            }
        );
    }
}

function saveUserLogin() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    if(name.trim() === "" || phone.length !== 10) { showToast("Enter valid Name & 10-Digit Mobile.", "error"); return; }
    
    loggedInUser = name; userPhone = phone; userCoins = 50;
    localStorage.setItem('kavya_user_name', name);
    localStorage.setItem('kavya_user_phone', phone);
    if(!localStorage.getItem('kavya_coins')) localStorage.setItem('kavya_coins', userCoins);
    
    document.getElementById('login-page').innerHTML = getProfileDashboardHTML();
    showToast(`Welcome to Kavya VIP, ${name}!`);
    closePage('login-page');
}

function saveAddress() {
    const add = document.getElementById('delivery-address').value;
    if(add.trim() !== "") {
        userAddress = add;
        localStorage.setItem('kavya_address', add);
        showToast("Address saved!");
    }
}

function logoutUser() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.clear(); location.reload();
    }
}

function getProfileDashboardHTML() {
    return `
        <div class="page-header"><i class="fa-solid fa-arrow-left back-btn" onclick="closePage('login-page')"></i><h2>My Profile</h2><div style="width:24px;"></div></div>
        <div class="page-scroll-content" style="padding: 20px;">
            <div style="text-align:center; margin-bottom:20px;">
                <div style="width:80px; height:80px; background:#111; border-radius:50%; margin:0 auto 10px; display:flex; justify-content:center; align-items:center; border:2px solid var(--accent-neon);">
                    <i class="fa-solid fa-user" style="font-size:30px; color:var(--text-muted);"></i>
                </div>
                <h3 style="color:#fff; margin:0;">${loggedInUser}</h3>
                <p style="color:var(--text-muted); font-size:12px;">+91 ${userPhone}</p>
            </div>
            <div style="background:#111; border:1px solid #222; border-radius:15px; padding:20px; margin-bottom:20px;">
                <h4 style="color:var(--liquid-gold); margin:0 0 10px 0;"><i class="fa-solid fa-coins"></i> Kavya Coins: <span style="font-size:22px; color:var(--accent-neon);">${userCoins}</span></h4>
                <div style="font-size:12px; color:var(--text-muted); line-height:1.5;"><b>How it works:</b><br>• Earn 1 Coin for every ₹100 spent.<br>• 1 Coin = ₹1.<br>• Use up to 10% of bill value on every order.</div>
            </div>
            <h4 style="color:#fff; margin-bottom:10px;">Delivery Address</h4>
            <textarea id="profile-address" style="width:100%; background:#111; color:#fff; padding:10px; border:1px solid #333; border-radius:8px; margin-bottom:10px;" rows="2">${userAddress}</textarea>
            <button style="width:100%; background:var(--accent-neon); color:#000; border:none; padding:10px; border-radius:8px; font-weight:800; margin-bottom:20px;" onclick="localStorage.setItem('kavya_address', document.getElementById('profile-address').value); userAddress=document.getElementById('profile-address').value; showToast('Address Updated!');">Save Address</button>
            <a href="https://www.instagram.com/kavyafamilyrestaurant?stkn=MWNxZ3hjMzR1eGJ0eQ==" target="_blank" style="display:block; text-align:center; background: linear-gradient(45deg, #f09433, #bc1888); color:#fff; padding:10px; border-radius:8px; font-weight:800; margin-bottom:10px; text-decoration:none;"><i class="fa-brands fa-instagram"></i> Follow for Updates</a>
            <button style="width:100%; background:#111; color:var(--text-muted); border:1px solid #333; padding:10px; border-radius:8px; font-weight:800;" onclick="logoutUser()">Logout Account</button>
        </div>
    `;
}

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
    let sortedItems = [...menuItems].sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
    const filtered = sortedItems.filter(item => { return (currentCategory === 'All' || item.category === currentCategory) && item.name.toLowerCase().includes(search); });
    if(filtered.length === 0) { container.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-muted);">No dishes found.</div>`; return; }

    filtered.forEach(item => {
        const cItem = cart.find(i => i.id === item.id);
        const oldPriceHTML = item.oldPrice ? `<span style="text-decoration:line-through; color:var(--text-muted); font-size:12px; margin-left:5px;">₹${item.oldPrice}</span>` : '';
        const badgeHTML = item.badge ? `<div style="position:absolute; top:12px; left:12px; background:linear-gradient(45deg, #ff4b1f, #ff9068); padding:4px 10px; border-radius:6px; font-size:10px; font-weight:900; color:#fff; box-shadow:0 4px 10px rgba(255,75,31,0.4);">${item.badge}</div>` : '';
        const btn = cItem 
            ? `<div style="display:flex; align-items:center; background:rgba(0,229,255,0.1); border:1px solid var(--accent-neon); border-radius:8px; height:34px;"><button style="background:transparent; color:var(--accent-neon); border:none; padding:0 14px; font-size:18px; font-weight:900;" onclick="updateQty('${item.id}', -1)">-</button><div style="color:#fff; font-size:14px; font-weight:800; width:24px; text-align:center;">${cItem.quantity}</div><button style="background:transparent; color:var(--accent-neon); border:none; padding:0 14px; font-size:18px; font-weight:900;" onclick="updateQty('${item.id}', 1)">+</button></div>`
            : `<button style="background:var(--accent-neon); color:#000; border:none; padding:8px 24px; border-radius:8px; font-weight:800; font-size:13px;" onclick="addToCart('${item.id}')">ADD</button>`;

        container.innerHTML += `
        <div class="premium-food-card">
            <div class="food-image-wrapper"><img src="${item.img}" loading="lazy">${badgeHTML}</div>
            <div class="food-info">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="width: 70%;">
                        <div style="width:12px; height:12px; border:1px solid ${item.veg ? 'var(--veg-green)' : 'var(--nonveg-red)'}; border-radius:3px; display:flex; justify-content:center; align-items:center; margin-bottom:5px;"><div style="width:6px; height:6px; border-radius:50%; background:${item.veg ? 'var(--veg-green)' : 'var(--nonveg-red)'};"></div></div>
                        <h3 style="margin:0 0 4px 0; font-size:16px; color:#fff; font-weight:600;">${item.name}</h3>
                        <div style="font-size:11px; color:#f39c12; margin-bottom:5px;">⭐ ${item.rating}</div>
                        <div style="font-size:15px; font-weight:800; color:#fff; margin-bottom:6px;">₹${item.price} ${oldPriceHTML}</div>
                    </div>
                    <div>${btn}</div>
                </div>
                <p style="margin:0; font-size:12px; color:var(--text-muted); line-height:1.4;">${item.desc}</p>
            </div>
        </div>`;
    });
}
function renderMenu() { filterMenu(); }

function addToCart(id) { cart.push({ ...menuItems.find(i => i.id === id), quantity: 1 }); updateCartUI(); filterMenu(); showToast("Added to Cart"); }
function updateQty(id, amt) { const idx = cart.findIndex(i => i.id === id); if(idx > -1) { cart[idx].quantity += amt; if(cart[idx].quantity <= 0) cart.splice(idx, 1); } updateCartUI(); filterMenu(); if(document.getElementById('cart-page').classList.contains('open')) renderCartSheet(); }
function updateCartUI() {
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('nav-cart-count');
    if(badge) {
        if(total > 0) { badge.classList.remove('hidden'); badge.innerText = total; document.querySelector('.cart-nav i').style.color = '#ff5252'; } 
        else { badge.classList.add('hidden'); document.querySelector('.cart-nav i').style.color = 'var(--text-muted)'; closePage('cart-page'); }
    }
}

function renderCartSheet() {
    const c = document.getElementById('cart-items-container'); c.innerHTML = '';
    cart.forEach(i => { 
        c.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#111; padding:12px 15px; border-radius:12px;">
            <div style="width:60%;"><div style="font-size:14px; font-weight:600; color:#fff;">${i.name}</div><div style="font-size:12px; color:var(--text-muted);">₹${i.price} x ${i.quantity}</div></div>
            <div style="display:flex; align-items:center; background:rgba(0,229,255,0.1); border:1px solid var(--accent-neon); border-radius:8px; height:30px;"><button style="background:transparent; color:var(--accent-neon); border:none; padding:0 10px; font-size:16px; font-weight:900;" onclick="updateQty('${i.id}', -1)">-</button><div style="color:#fff; font-size:12px; font-weight:800; width:20px; text-align:center;">${i.quantity}</div><button style="background:transparent; color:var(--accent-neon); border:none; padding:0 10px; font-size:16px; font-weight:900;" onclick="updateQty('${i.id}', 1)">+</button></div>
            <div style="font-weight:800; color:#fff;">₹${i.price * i.quantity}</div>
        </div>`; 
    });

    const billingHTML = `
        <h4 style="color:#fff; margin:20px 0 10px;">Delivery Details</h4>
        <textarea id="delivery-address" style="width:100%; background:#111; color:#fff; padding:10px; border:1px solid #333; border-radius:8px; margin-bottom:15px; font-size:13px; outline:none;" rows="2" placeholder="Enter Delivery Address..." onchange="saveAddress()">${userAddress}</textarea>
        <div style="margin-top:10px; background:#111; padding:15px; border-radius:12px; border:1px solid #222;">
            <div style="display:flex; justify-content:space-between; font-weight:600; font-size:14px; margin-bottom:12px; color:#ccc;"><span>Subtotal</span><span>₹<span id="bill-subtotal">0</span></span></div>
            <div style="display:flex; justify-content:space-between; font-weight:600; font-size:12px; margin-bottom:12px; color:#ccc;"><span>GST (5%)</span><span>₹<span id="bill-gst">0</span></span></div>
            <div style="display:flex; justify-content:space-between; font-weight:600; font-size:12px; margin-bottom:12px; color:#ccc;"><span>Delivery</span><span>₹30</span></div>
            <div id="discount-row" class="hidden" style="display:flex; justify-content:space-between; font-weight:600; font-size:14px; margin-bottom:12px; color:var(--veg-green);"><span>Discount Applied</span><span>-₹<span id="bill-discount">0</span></span></div>
            
            <div id="coupon-container" class="hidden" style="margin: 15px 0; background: rgba(0,229,255,0.05); border: 1px dashed var(--accent-neon); padding: 12px; border-radius: 8px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div><b style="color:var(--accent-neon);">LEGEND15</b><p style="margin:0; font-size:10px; color:#aaa;">Flat 15% OFF on VIP Orders</p></div>
                    <input type="checkbox" id="coupon-check" onchange="toggleDiscounts('coupon')" style="width:18px; height:18px;">
                </div>
            </div>

            <div style="margin:15px 0 20px; background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.2); padding:12px; border-radius:10px; display:flex; align-items:center; gap:10px;">
                <input type="checkbox" id="coins-check" onchange="toggleDiscounts('coins')" style="width:16px; height:16px;"> 
                <label style="font-size:12px; color:var(--liquid-gold); font-weight:600;">Use Kavya Coins (Bal: ${userCoins})</label>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:800; border-top:1px dashed #444; padding-top:15px; color:#fff;"><span>Grand Total</span><span style="color:var(--accent-neon); font-size:22px;">₹<span id="bill-total">0</span></span></div>
            <div style="display:flex; gap:10px; margin-top:25px;">
                <button style="flex:1; background:#222; color:#fff; border:none; padding:10px; border-radius:8px; font-weight:800;" onclick="processCheckout('COD')">COD</button>
                <button style="flex:2; display:flex; justify-content:center; align-items:center; gap:8px; background:var(--accent-neon); color:#000; border:none; padding:10px; border-radius:8px; font-weight:800;" onclick="processCheckout('UPI')">Pay UPI <i class="fa-solid fa-bolt"></i></button>
            </div>
        </div>
    `;
    if(!document.getElementById('delivery-address')) { c.insertAdjacentHTML('afterend', `<div id="billing-wrapper">${billingHTML}</div>`); }
    calculateFinalBill();
}

function toggleDiscounts(source) {
    if(source === 'coupon' && document.getElementById('coupon-check').checked) { document.getElementById('coins-check').checked = false; useCoupon = true; useCoins = false; }
    else if(source === 'coins' && document.getElementById('coins-check').checked) { if(document.getElementById('coupon-check')) document.getElementById('coupon-check').checked = false; useCoins = true; useCoupon = false; }
    else { useCoins = false; useCoupon = false; }
    calculateFinalBill();
}

function calculateFinalBill() {
    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    document.getElementById('bill-subtotal').innerText = subtotal;
    const gst = Math.floor(subtotal * 0.05);
    document.getElementById('bill-gst').innerText = gst;
    const couponBox = document.getElementById('coupon-container');
    if(couponBox) {
        if(subtotal >= 2000) couponBox.classList.remove('hidden');
        else { couponBox.classList.add('hidden'); useCoupon = false; if(document.getElementById('coupon-check')) document.getElementById('coupon-check').checked = false; }
    }
    let discount = 0;
    if(useCoupon && subtotal >= 2000) discount = Math.floor(subtotal * 0.15);
    else if(useCoins) {
        let maxAllowed = Math.floor(subtotal * 0.10);
        discount = Math.min(userCoins, maxAllowed);
        if(discount === 0) { showToast("Not enough coins to apply.", "error"); document.getElementById('coins-check').checked = false; useCoins = false;}
    }
    if(discount > 0) { document.getElementById('discount-row').classList.remove('hidden'); document.getElementById('bill-discount').innerText = discount; }
    else { document.getElementById('discount-row').classList.add('hidden'); }
    document.getElementById('bill-total').innerText = subtotal + gst + 30 - discount;
}

function processCheckout(method) {
    if(!userLocation) return requestLocation();
    if(!loggedInUser) return openPage('login-page');
    const address = document.getElementById('delivery-address').value;
    if(address.trim() === "") return showToast("Delivery Address is required!", "error");
    saveAddress(); 
    const finalAmt = document.getElementById('bill-total').innerText;
    const orderObj = { id: 'KVY' + Math.floor(Math.random()*90000+10000), date: new Date().toLocaleString(), total: finalAmt, items: cart.map(i => `${i.quantity}x ${i.name}`), method: method };
    orderHistory.unshift(orderObj);
    localStorage.setItem('kavya_orders', JSON.stringify(orderHistory));
    const earn = Math.floor(cart.reduce((s, i) => s + (i.price * i.quantity), 0) * 0.01);
    if(!useCoins) { userCoins += earn; localStorage.setItem('kavya_coins', userCoins); }
    closeAllSheets();
    if(method === 'COD') { showToast("Order Placed Successfully!"); cart = []; updateCartUI(); filterMenu(); }
    else {
        const upiLink = `upi://pay?pa=${RESTAURANT_UPI}&pn=Kavya%20VIP&am=${finalAmt}&cu=INR&tn=VIP%20Order`;
        window.location.href = upiLink;
        setTimeout(() => {
            if(confirm("If UPI failed to open, send order details via WhatsApp?")) {
                let text = `*NEW VIP ORDER* 🚀\n\n*Name:* ${loggedInUser}\n*Phone:* ${userPhone}\n*Address:* ${userAddress}\n*GPS:* https://maps.google.com/?q=${userLocation}\n\n*Items:*`;
                cart.forEach(item => { text += `\n▪ ${item.quantity}x ${item.name}`; });
                text += `\n\n*Grand Total:* ₹${finalAmt}`;
                window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
            }
            cart = []; updateCartUI(); filterMenu();
        }, 2500);
    }
}

function openOrdersPage() {
    const c = document.getElementById('order-history-container'); c.innerHTML = '';
    if(orderHistory.length === 0) { c.innerHTML = '<p style="color:var(--text-muted); text-align:center;">No past orders found.</p>'; }
    else {
        orderHistory.forEach(o => {
            c.innerHTML += `
            <div style="background:#111; border:1px solid #222; padding:15px; border-radius:12px; margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding-bottom:8px; margin-bottom:8px;">
                    <span style="color:#fff; font-weight:800;">Order #${o.id}</span>
                    <span style="color:var(--veg-green); font-size:12px; font-weight:600;">${o.method}</span>
                </div>
                <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">${o.date}</div>
                <div style="font-size:12px; color:#ccc; margin-bottom:10px; line-height:1.4;">${o.items.join('<br>')}</div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--accent-neon); font-size:16px; font-weight:800;">₹${o.total}</span>
                    <button style="background:var(--accent-neon); color:#000; border:none; padding:6px 15px; border-radius:8px; font-weight:800; font-size:11px;" onclick="openPage('home-page')">Reorder</button>
                </div>
            </div>`;
        });
    }
    openPage('orders-page');
}

let scrollTimeout;
window.addEventListener('scroll', () => {
    const taskbar = document.getElementById('smart-taskbar');
    if(taskbar) {
        taskbar.classList.add('shrink'); 
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { taskbar.classList.remove('shrink'); }, 200); 
    }
}, {passive: true});
