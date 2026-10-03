/* =========================================
   KAVYA MAX TIER - ZOMATO LEVEL MASTER LOGIC
   ========================================= */

let cart = [];
let userLocation = null;
let loggedInUser = null;
let userPhone = null;
let userCoins = 0;
let currentCategory = 'All'; 
let dineInTable = null;

const RESTAURANT_UPI = "yourupi@okbank"; 
const OWNER_WHATSAPP = "919876543210"; 

// 1. ZOMATO STYLE NATIVE TOAST (No default alerts)
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-container');
    const msg = document.getElementById('toast-message');
    
    let icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation" style="color:var(--nonveg-red);"></i>' : '<i class="fa-solid fa-circle-check" style="color:var(--veg-green);"></i>';
    if(type === 'info') icon = '<i class="fa-solid fa-bell" style="color:var(--accent-neon);"></i>';
    
    msg.innerHTML = `${icon} ${message}`;
    
    toast.className = 'toast-hidden'; // Reset classes
    if(type === 'error') toast.classList.add('error');
    if(type === 'success') toast.classList.add('success');
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 2. INITIALIZATION & MANDATORY LOGIN
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => { splash.style.display = 'none'; }, 800);
        }
    }, 1500);

    renderMenu();
    initAutoScroll();
    checkLoginStatus(); // Checks if logged in, else forces login
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
    showToast("Detecting your VIP location...", "info");
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = `${position.coords.latitude},${position.coords.longitude}`;
                locText.innerHTML = `<span class="gps-pulse"></span> <span style="color:var(--veg-green);">Live Location Active</span>`;
                showToast("Location successfully fetched!");
            },
            (error) => {
                showToast("Please allow location in settings.", "error");
            }
        );
    } else {
        showToast("GPS not supported.", "error");
    }
}

// 3. LOGIN & PROFILE LOGIC
function checkLoginStatus() {
    const name = localStorage.getItem('kavya_user_name');
    const phone = localStorage.getItem('kavya_user_phone');
    const coins = localStorage.getItem('kavya_user_coins');
    
    if(name && phone) {
        loggedInUser = name;
        userPhone = phone;
        userCoins = coins ? parseInt(coins) : 0;
        
        // Update UI
        document.getElementById('header-coin-balance').innerText = userCoins;
        requestLocation();
    } else {
        // Force Login
        document.getElementById('mandatory-overlay').classList.remove('hidden');
        document.getElementById('login-sheet').classList.add('open');
    }
}

function saveUserLogin() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    
    if(name.trim() === "" || phone.length !== 10) {
        showToast("Enter valid Name & 10-Digit Mobile.", "error");
        return;
    }
    
    localStorage.setItem('kavya_user_name', name);
    localStorage.setItem('kavya_user_phone', phone);
    // Give 50 welcome coins if new
    if(!localStorage.getItem('kavya_user_coins')) localStorage.setItem('kavya_user_coins', 50);
    
    document.getElementById('mandatory-overlay').classList.add('hidden');
    document.getElementById('login-sheet').classList.remove('open');
    
    checkLoginStatus();
    showToast(`Welcome to Kavya VIP, ${name.split(" ")[0]}!`);
}

function openProfileSheet() {
    document.getElementById('prof-name').innerText = loggedInUser;
    document.getElementById('prof-phone').innerText = `+91 ${userPhone}`;
    document.getElementById('prof-coins').innerText = userCoins;
    
    document.getElementById('sheet-overlay').classList.remove('hidden');
    document.getElementById('profile-sheet').classList.add('open');
}

function logoutUser() {
    localStorage.removeItem('kavya_user_name');
    localStorage.removeItem('kavya_user_phone');
    loggedInUser = null;
    closeAllSheets();
    showToast("Logged out successfully.", "info");
    setTimeout(() => location.reload(), 1500); // Reload forces login page
}

function closeAllSheets() {
    document.getElementById('sheet-overlay').classList.add('hidden');
    document.getElementById('profile-sheet').classList.remove('open');
    document.getElementById('checkout-sheet').classList.remove('open');
    document.getElementById('dining-sheet').classList.remove('open');
}

// 4. MENU DATA (12 Items, Fire Bestseller, Out of stock feature)
const menuItems = [
    { id: 'start1', category: 'Starters', name: 'Crispy Chilli Potato', price: 149, oldPrice: 199, veg: true, rating: '4.5', badge: '🔥 BESTSELLER', inStock: true, img: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&q=80', desc: 'Crispy fried potatoes tossed in spicy honey chilli sauce.' },
    { id: 'start2', category: 'Starters', name: 'Chicken Tikka Kebab', price: 349, oldPrice: 499, veg: false, rating: '4.9', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1599487405270-45ab10e96bf7?w=600&q=80', desc: 'Smoky, charcoal-grilled tender chicken pieces.' },
    { id: 'roll1', category: 'Rolls', name: 'Double Egg Chicken Roll', price: 120, oldPrice: 150, veg: false, rating: '4.7', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1549110781-79b88f343f7a?w=600&q=80', desc: 'Crispy paratha wrapped with spicy chicken chunks.' },
    { id: 'roll2', category: 'Rolls', name: 'Paneer Kathi Roll', price: 100, oldPrice: 130, veg: true, rating: '4.4', badge: '', inStock: false, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80', desc: 'Tangy paneer filling with fresh onions and mint chutney.' }, // OUT OF STOCK EXAMPLE
    { id: 'chic1', category: 'Chicken', name: 'Butter Chicken', price: 320, oldPrice: 400, veg: false, rating: '4.8', badge: '🔥 BESTSELLER', inStock: true, img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80', desc: 'Creamy tomato gravy with roasted chicken.' },
    { id: 'bir1', category: 'Biryani', name: 'Special Chicken Biryani', price: 299, oldPrice: 450, veg: false, rating: '4.8', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', desc: 'Premium long-grain Basmati Rice cooked with spices.' },
    { id: 'cur1', category: 'Curries', name: 'Paneer Butter Masala', price: 249, oldPrice: 350, veg: true, rating: '4.5', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600&q=80', desc: 'Rich, creamy tomato gravy with soft malai paneer.' },
    { id: 'cur2', category: 'Curries', name: 'Dal Makhani', price: 199, oldPrice: 250, veg: true, rating: '4.2', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', desc: 'Slow-cooked black lentils with fresh cream.' },
    { id: 'cur3', category: 'Chicken', name: 'Mutton Rogan Josh', price: 450, oldPrice: 550, veg: false, rating: '4.8', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80', desc: 'Tender mutton chunks cooked in Kashmiri spices.' },
    { id: 'brd1', category: 'Breads', name: 'Butter Naan (2 Pcs)', price: 70, oldPrice: '', veg: true, rating: '4.6', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', desc: 'Hot and crispy tandoori naan dripping with butter.' },
    { id: 'swt1', category: 'Sweets', name: 'Gulab Jamun (2 Pcs)', price: 60, oldPrice: '', veg: true, rating: '4.9', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1596450514735-3b9ffef74c43?w=600&q=80', desc: 'Hot, soft milk dumplings soaked in cardamom sugar syrup.' },
    { id: 'bev1', category: 'Beverages', name: 'Punjabi Sweet Lassi', price: 99, oldPrice: '', veg: true, rating: '4.7', badge: '', inStock: true, img: 'https://images.unsplash.com/photo-1571115177098-24de444bb27b?w=600&q=80', desc: 'Thick, chilled sweet yogurt drink topped with malai.' }
];

// 5. FILTER & RENDER ENGINE
function setCategory(categoryName, element) {
    currentCategory = categoryName;
    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    filterMenu();
}

function filterMenu() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = ''; 

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = currentCategory === 'All' || item.category === currentCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchInput);
        return matchesCategory && matchesSearch;
    });

    if(filteredItems.length === 0) {
        menuContainer.innerHTML = `<div class="no-results"><i class="fa-solid fa-face-frown" style="font-size:30px; margin-bottom:10px;"></i><br>Oops! No dishes found.</div>`;
        return;
    }

    filteredItems.forEach(item => {
        const vegClass = item.veg ? 'veg' : 'non-veg';
        let badgeHTML = '';
        if(!item.inStock) badgeHTML = `<div class="badge-out">Out of Stock</div>`;
        else if(item.badge) badgeHTML = `<div class="badge-fire">${item.badge}</div>`;
        
        const oldPriceHTML = item.oldPrice ? `<span class="old-price">₹${item.oldPrice}</span>` : '';
        
        // Button Logic (In stock vs out of stock)
        let buttonHTML = '';
        if(!item.inStock) {
            buttonHTML = `<button class="glass-btn btn-disabled" disabled>ADD</button>`;
        } else {
            const cartItem = cart.find(i => i.id === item.id);
            buttonHTML = cartItem 
                ? `<div class="qty-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <div class="qty-count">${cartItem.quantity}</div>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                   </div>`
                : `<button class="glass-btn add-btn" onclick="addToCart('${item.id}')">ADD</button>`;
        }

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
                        <p class="food-rating">⭐⭐⭐⭐½ <span style="color:var(--text-muted);">(${item.rating})</span></p>
                    </div>
                    <div class="add-wrapper">
                        ${buttonHTML}
                    </div>
                </div>
                <div class="food-price">₹${item.price} ${oldPriceHTML}</div>
                <p class="food-desc">${item.desc}</p>
            </div>
        </div>
        `;
    });
}

function renderMenu() { filterMenu(); }

// 6. CART LOGIC
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    cart.push({ ...item, quantity: 1 });
    updateCartUI();
    filterMenu();
    showToast(`Added to cart!`, 'success');
}

function updateQuantity(itemId, amount) {
    const itemIndex = cart.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += amount;
        if (cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1);
    }
    updateCartUI();
    filterMenu(); 
    if(document.getElementById('checkout-sheet').classList.contains('open')) renderCartSheet();
}

function updateCartUI() {
    let totalItems = 0;
    cart.forEach(item => totalItems += item.quantity);
    const cartBadge = document.getElementById('nav-cart-count');
    
    if(totalItems > 0) {
        cartBadge.classList.remove('hidden');
        cartBadge.innerText = totalItems;
        document.querySelector('.cart-nav i').style.color = 'var(--accent-neon)';
    } else {
        cartBadge.classList.add('hidden');
        document.querySelector('.cart-nav i').style.color = 'var(--text-muted)';
        if(document.getElementById('checkout-sheet').classList.contains('open')) closeAllSheets();
    }
}

// 7. CHECKOUT & COIN LOGIC
function openCartSheet() {
    if(cart.length === 0) {
        showToast("Your cart is empty!", "error");
        return;
    }
    renderCartSheet();
    document.getElementById('sheet-overlay').classList.remove('hidden');
    document.getElementById('checkout-sheet').classList.add('open');
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

    calculateFinalBill();
}

function calculateFinalBill() {
    const subtotal = getCartTotal();
    document.getElementById('bill-subtotal').innerText = subtotal;
    
    let discount = 0;
    const useCoins = document.getElementById('use-coins-check').checked;
    
    if(useCoins) {
        // Max 10% discount using coins
        const maxDiscountAllowed = Math.floor(subtotal * 0.10);
        discount = Math.min(userCoins, maxDiscountAllowed);
        
        if(discount > 0) {
            document.getElementById('coin-discount-row').classList.remove('hidden');
            document.getElementById('bill-discount').innerText = discount;
        } else {
            showToast("You don't have enough coins.", "error");
            document.getElementById('use-coins-check').checked = false;
        }
    } else {
        document.getElementById('coin-discount-row').classList.add('hidden');
    }
    
    const grandTotal = subtotal - discount;
    document.getElementById('bill-total').innerText = grandTotal;
}

// 8. DINE-IN LOGIC
function openDiningSheet() {
    document.getElementById('sheet-overlay').classList.remove('hidden');
    document.getElementById('dining-sheet').classList.add('open');
    document.getElementById('booking-form').classList.add('hidden');
}

function openBookingForm(tableName) {
    dineInTable = tableName;
    document.getElementById('selected-table-name').innerText = `Selected: ${tableName}`;
    document.getElementById('booking-form').classList.remove('hidden');
}

function submitBooking() {
    const guests = document.getElementById('guest-count').value;
    const time = document.getElementById('booking-time').value;
    const preOrder = document.getElementById('pre-order-check').checked;
    
    if(!guests || !time) {
        showToast("Please enter guests and select time.", "error");
        return;
    }
    
    let msg = `Table Booked! ${tableName} for ${guests} at ${time}.`;
    if(preOrder && cart.length > 0) msg += " Pre-order attached.";
    else if(preOrder) showToast("Cart empty. Pre-order ignored.", "info");
    
    showToast(msg, "success");
    closeAllSheets();
    
    // In Phase 3, this sends details to Admin Panel.
}

// 9. FINAL PAYMENT
function processCheckout() {
    if(!userLocation) {
        showToast("Please allow location first.", "error");
        requestLocation();
        return;
    }

    const subtotal = getCartTotal();
    const discount = document.getElementById('use-coins-check').checked ? parseInt(document.getElementById('bill-discount').innerText) : 0;
    const grandTotal = subtotal - discount;
    
    // Earn 1% coins
    const earnedCoins = Math.floor(grandTotal / 100);
    
    const upiLink = `upi://pay?pa=${RESTAURANT_UPI}&pn=Kavya%20VIP&am=${grandTotal}&cu=INR&tn=VIP%20Order`;
    window.location.href = upiLink;
    
    setTimeout(() => {
        if(confirm("If UPI didn't open, place order via WhatsApp?")) {
            // Update coins (Temporary logic until Phase 3)
            if(discount > 0) localStorage.setItem('kavya_user_coins', userCoins - discount + earnedCoins);
            else localStorage.setItem('kavya_user_coins', userCoins + earnedCoins);
            
            let text = `*VIP ORDER* 🚀\n*Name:* ${loggedInUser}\n*Phone:* ${userPhone}\n*GPS:* https://maps.google.com/?q=${userLocation}\n\n*Items:*`;
            cart.forEach(item => { text += `\n▪ ${item.quantity}x ${item.name}`; });
            text += `\n\n*Subtotal:* ₹${subtotal}`;
            if(discount > 0) text += `\n*Coins Used:* -₹${discount}`;
            text += `\n*Grand Total:* ₹${grandTotal}`;

            window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
            closeAllSheets();
        }
    }, 2000);
}

