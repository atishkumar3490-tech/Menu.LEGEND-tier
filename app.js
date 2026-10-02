/* =========================================
   KAVYA MAX TIER - COMPLETE LOGIC
   ========================================= */

let cart = [];
let userLocation = null;
let loggedInUser = null;
const RESTAURANT_UPI = "yourupi@okbank"; 
const OWNER_WHATSAPP = "919876543210"; 

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => { splash.style.display = 'none'; }, 800);
        }
    }, 1500);

    renderMenu();
    requestLocation();
    checkLoginStatus();
    initAutoScroll();
});

function initAutoScroll() {
    const carousel = document.getElementById('offer-scroll');
    if(!carousel) return;
    
    setInterval(() => {
        if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 10)) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
        }
    }, 3500); 
}

function requestLocation() {
    const locText = document.getElementById('user-location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = `${position.coords.latitude},${position.coords.longitude}`;
                locText.innerHTML = `<span class="gps-pulse"></span> <span style="color:var(--veg-green);">Live Location Active</span>`;
            },
            (error) => {
                locText.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--nonveg-red);"></i> <span style="color:var(--nonveg-red);">Location Required</span>`;
            }
        );
    } else {
        locText.innerText = "GPS Not Supported";
    }
}

function checkLoginStatus() {
    const savedName = localStorage.getItem('kavya_user_name');
    if(savedName) {
        loggedInUser = savedName;
        document.getElementById('nav-profile-text').innerText = savedName.split(" ")[0]; 
    }
}

function openLoginSheet() {
    document.getElementById('sheet-overlay').classList.remove('hidden');
    document.getElementById('login-sheet').classList.add('open');
}

function closeLoginSheet() {
    document.getElementById('sheet-overlay').classList.add('hidden');
    document.getElementById('login-sheet').classList.remove('open');
}

function closeAllSheets() {
    document.getElementById('sheet-overlay').classList.add('hidden');
    document.getElementById('checkout-sheet').classList.remove('open');
    document.getElementById('login-sheet').classList.remove('open');
}

function saveUserLogin() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    
    if(name.trim() === "" || phone.length < 10) {
        alert("Enter valid Name and 10-Digit Mobile Number.");
        return;
    }
    
    localStorage.setItem('kavya_user_name', name);
    localStorage.setItem('kavya_user_phone', phone);
    
    closeLoginSheet();
    checkLoginStatus();
    alert(`Welcome to Kavya VIP, ${name}!`);
}

// YAHAN PAR NAYA MENU ADD KAREGA FUTURE MEIN (Only edit this array)
const menuItems = [
    { id: 'biryani', name: 'Special Chicken Biryani', price: 299, oldPrice: 450, veg: false, rating: '4.8', badge: '33% OFF', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', desc: 'Served with Raita & spicy Salan. Premium long-grain Basmati Rice.' },
    { id: 'paneer', name: 'Paneer Butter Masala', price: 249, oldPrice: 350, veg: true, rating: '4.5', badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600&q=80', desc: 'Rich, creamy tomato gravy with soft malai paneer cubes.' },
    { id: 'kebab', name: 'Chicken Tikka Kebab', price: 349, oldPrice: 499, veg: false, rating: '4.9', badge: 'Must Try', img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=600&q=80', desc: 'Smoky, charcoal-grilled tender chicken pieces.' },
    { id: 'dal', name: 'Dal Makhani', price: 199, oldPrice: 250, veg: true, rating: '4.2', badge: '', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', desc: 'Slow-cooked black lentils with fresh cream.' },
    { id: 'naan', name: 'Butter Naan (2 Pcs)', price: 70, oldPrice: '', veg: true, rating: '4.6', badge: '', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', desc: 'Hot and crispy tandoori naan dripping with butter.' },
    { id: 'lassi', name: 'Punjabi Sweet Lassi', price: 99, oldPrice: '', veg: true, rating: '4.7', badge: 'Chilled', img: 'https://images.unsplash.com/photo-1571115177098-24de444bb27b?w=600&q=80', desc: 'Thick, chilled sweet yogurt drink topped with malai.' },
    { id: 'mutton', name: 'Mutton Rogan Josh', price: 450, oldPrice: 550, veg: false, rating: '4.8', badge: 'Spicy', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80', desc: 'Tender mutton chunks cooked in Kashmiri spices.' },
    { id: 'potato', name: 'Crispy Chilli Potato', price: 149, oldPrice: '', veg: true, rating: '4.3', badge: '', img: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&q=80', desc: 'Crispy fried potatoes tossed in spicy honey chilli sauce.' },
    { id: 'noodles', name: 'Veg Hakka Noodles', price: 179, oldPrice: '', veg: true, rating: '4.4', badge: '', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80', desc: 'Classic wok-tossed noodles with fresh crunchy veggies.' },
    { id: 'jamun', name: 'Gulab Jamun (2 Pcs)', price: 60, oldPrice: '', veg: true, rating: '4.9', badge: 'Dessert', img: 'https://images.unsplash.com/photo-1596450514735-3b9ffef74c43?w=600&q=80', desc: 'Hot, soft milk dumplings soaked in cardamom sugar syrup.' },
    { id: 'soda', name: 'Fresh Lime Soda', price: 79, oldPrice: '', veg: true, rating: '4.5', badge: '', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80', desc: 'Refreshing summer drink with sweet and salt mix.' }
];

function renderMenu() {
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = ''; 

    menuItems.forEach(item => {
        const vegClass = item.veg ? 'veg' : 'non-veg';
        const badgeHTML = item.badge ? `<div class="badge ${item.badge.includes('OFF') ? 'discount-badge' : 'bestseller-badge'}">${item.badge}</div>` : '';
        const oldPriceHTML = item.oldPrice ? `<span class="old-price">₹${item.oldPrice}</span>` : '';

        menuContainer.innerHTML += `
        <div class="premium-food-card glass-panel">
            <div class="food-image-wrapper">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                ${badgeHTML}
            </div>
            <div class="food-info">
                <div class="food-header">
                    <div>
                        <div class="veg-nonveg ${vegClass}"></div>
                        <h3 class="food-title">${item.name}</h3>
                        <p class="food-rating">⭐⭐⭐⭐½ <span class="rating-count">(${item.rating})</span></p>
                    </div>
                    <div class="add-wrapper" id="add-wrapper-${item.id}">
                        <button class="glass-btn add-btn" onclick="addToCart('${item.id}')">ADD</button>
                    </div>
                </div>
                <div class="food-price">₹${item.price} ${oldPriceHTML}</div>
                <p class="food-desc">${item.desc}</p>
            </div>
        </div>
        `;
    });
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if(existingItem) existingItem.quantity += 1;
    else cart.push({ ...item, quantity: 1 });
    
    updateCartUI();
    renderItemControls(itemId);
}

function updateQuantity(itemId, amount) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += amount;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            resetAddButton(itemId);
        } else {
            renderItemControls(itemId);
        }
    }
    updateCartUI();
    if(document.getElementById('checkout-sheet').classList.contains('open')) renderCartSheet();
}

function renderItemControls(itemId) {
    const wrapper = document.getElementById(`add-wrapper-${itemId}`);
    const item = cart.find(i => i.id === itemId);
    
    if(item && wrapper) {
        wrapper.innerHTML = `
        <div class="qty-controls">
            <button class="qty-btn" onclick="updateQuantity('${itemId}', -1)">-</button>
            <div class="qty-count">${item.quantity}</div>
            <button class="qty-btn" onclick="updateQuantity('${itemId}', 1)">+</button>
        </div>`;
    }
}

function resetAddButton(itemId) {
    const wrapper = document.getElementById(`add-wrapper-${itemId}`);
    if(wrapper) wrapper.innerHTML = `<button class="glass-btn add-btn" onclick="addToCart('${itemId}')">ADD</button>`;
}

function updateCartUI() {
    let totalItems = 0;
    cart.forEach(item => totalItems += item.quantity);
    const cartBadge = document.getElementById('nav-cart-count');
    
    if(totalItems > 0) {
        cartBadge.classList.remove('hidden');
        cartBadge.innerText = totalItems;
        document.querySelector('.cart-nav i').style.textShadow = '0 0 15px rgba(0, 229, 255, 0.8)';
        document.querySelector('.cart-nav i').style.color = 'var(--accent-neon)';
    } else {
        cartBadge.classList.add('hidden');
        document.querySelector('.cart-nav i').style.textShadow = 'none';
        document.querySelector('.cart-nav i').style.color = 'var(--text-muted)';
        if(document.getElementById('checkout-sheet').classList.contains('open')) toggleCartSheet();
    }
}

function toggleCartSheet() {
    const sheet = document.getElementById('checkout-sheet');
    const overlay = document.getElementById('sheet-overlay');
    
    if(cart.length === 0 && !sheet.classList.contains('open')) {
        alert("Your cart is empty!");
        return;
    }
    
    if(!sheet.classList.contains('open')) {
        renderCartSheet();
        overlay.classList.remove('hidden');
        sheet.classList.add('open');
    } else {
        overlay.classList.add('hidden');
        sheet.classList.remove('open');
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCartSheet() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    
    cart.forEach(item => {
        container.innerHTML += `
        <div class="cart-row">
            <div>
                <div class="cart-row-title">${item.name}</div>
                <div class="cart-row-price">₹${item.price * item.quantity}</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <div class="qty-count">${item.quantity}</div>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
        </div>`;
    });

    document.getElementById('bill-total').innerText = `₹${getCartTotal()}`;
}

function processCheckout() {
    if(!userLocation) {
        alert("GPS Location is required for delivery! Please allow location.");
        requestLocation();
        return;
    }
    if(!loggedInUser) {
        alert("Please login to proceed with your VIP order.");
        closeAllSheets();
        openLoginSheet();
        return;
    }

    const totalAmt = getCartTotal();
    const upiLink = `upi://pay?pa=${RESTAURANT_UPI}&pn=Kavya%20VIP&am=${totalAmt}&cu=INR&tn=VIP%20Order`;
    window.location.href = upiLink;
    
    setTimeout(() => {
        if(confirm("If your UPI app didn't open, place order via WhatsApp?")) {
            sendToWhatsApp(totalAmt);
        }
    }, 2000);
}

function sendToWhatsApp(totalAmt) {
    const phone = localStorage.getItem('kavya_user_phone');
    let text = `*NEW VIP ORDER* 🚀\n\n*Name:* ${loggedInUser}\n*Phone:* ${phone}\n*GPS:* https://maps.google.com/?q=${userLocation}\n\n*Items:*`;
    
    cart.forEach(item => { text += `\n▪ ${item.quantity}x ${item.name} (₹${item.price * item.quantity})`; });
    text += `\n\n*Grand Total:* ₹${totalAmt}`;

    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
}

