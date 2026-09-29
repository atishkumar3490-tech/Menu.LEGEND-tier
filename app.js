/* =========================================
   KAVYA LEGEND TIER - CORE LOGIC V3
   ========================================= */

let cart = [];
let userTokens = 0;
let currentOrderType = 'dine-in';
let isPuzzleSolved = false;
let isDiscountApplied = false;
let loggedInUser = null;
const RESTAURANT_UPI = "yourupi@okbank"; // BHAII YAHAN OWNER KI UPI ID DAALNA
const OWNER_WHATSAPP = "919876543210"; // YAHAN APNA NUMBER DAAL

document.addEventListener('DOMContentLoaded', () => {
    // Hide Loading Screen smoothly
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => { document.getElementById('loading-screen').style.display = 'none'; }, 500);
    }, 1500);

    checkTimeAndGreet();
    checkLoginStatus();
    updateCartUI();
});

// --- Dynamic Time Theme ---
function checkTimeAndGreet() {
    const hour = new Date().getHours();
    const banner = document.getElementById('time-greeting-banner');
    const text = document.getElementById('time-text');
    
    if (hour >= 5 && hour < 11) {
        text.innerText = "☀️ Good Morning! Fresh Breakfast is ready.";
        banner.style.background = "#2a1b12";
        banner.style.borderBottom = "1px solid #ff9966";
        text.style.color = "#ff9966";
    } else if (hour >= 11 && hour < 17) {
        text.innerText = "🍛 Lunch O'clock! Explore our Thalis.";
        banner.style.background = "#1a261a";
        banner.style.borderBottom = "1px solid #56ab2f";
        text.style.color = "#a8e063";
    } else {
        text.innerText = "🌙 Late Night Cravings? We're open!";
        banner.style.background = "#0f1626";
        banner.style.borderBottom = "1px solid #00E5FF";
        text.style.color = "#00E5FF";
    }
}

// --- Login & Wallet System ---
function checkLoginStatus() {
    const savedName = localStorage.getItem('kavya_user_name');
    let tokens = localStorage.getItem('kavya_user_tokens');
    
    if(savedName) {
        loggedInUser = savedName;
        userTokens = tokens ? parseInt(tokens) : 0;
        
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('token-display').classList.remove('hidden');
        document.getElementById('token-count').innerText = userTokens;
        
        const dynamicGreeting = document.getElementById('dynamic-greeting');
        dynamicGreeting.classList.remove('hidden');
        document.getElementById('greeting-text').innerText = `Hello ${savedName}, Welcome back to Kavya VIP.`;
        
        // Update wallet modal
        document.getElementById('wallet-balance').innerText = userTokens;
    } else {
        document.getElementById('login-btn').classList.remove('hidden');
        document.getElementById('token-display').classList.add('hidden');
        document.getElementById('dynamic-greeting').classList.add('hidden');
    }
}

function loginUser() {
    const nameInput = document.getElementById('user-name').value;
    const phoneInput = document.getElementById('user-phone').value;
    
    if(nameInput.trim() === "" || phoneInput.trim() === "") {
        alert("Enter details to continue.");
        return;
    }
    
    localStorage.setItem('kavya_user_name', nameInput);
    localStorage.setItem('kavya_user_phone', phoneInput);
    
    if(!localStorage.getItem('kavya_user_tokens')) {
        localStorage.setItem('kavya_user_tokens', 50);
    }
    
    closeModal('login-modal');
    checkLoginStatus();
}

function openTokenWallet() {
    document.getElementById('wallet-modal').classList.remove('hidden');
}

function logoutUser() {
    localStorage.removeItem('kavya_user_name');
    localStorage.removeItem('kavya_user_phone');
    loggedInUser = null;
    closeModal('wallet-modal');
    checkLoginStatus();
}

// --- Zomato Style Cart Engine ---
function addToCart(itemName, itemPrice, itemImg) {
    cart.push({ name: itemName, price: parseInt(itemPrice), quantity: 1, img: itemImg });
    updateCartUI();
    renderItemControls(itemName);
}

function changeQuantity(itemName, amount) {
    const itemIndex = cart.findIndex(i => i.name === itemName);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += amount;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            resetItemButton(itemName);
        } else {
            renderItemControls(itemName); // Update number on menu
        }
    }
    updateCartUI();
    
    if(cart.length > 0 && !document.getElementById('checkout-modal').classList.contains('hidden')) {
        renderCheckoutList(); // Update checkout list if open
    } else if (cart.length === 0) {
        closeModal('checkout-modal');
    }
}

// Swaps the 'ADD' button with '[ - ] 1 [ + ]'
function renderItemControls(itemName) {
    // Extract first word to find the wrapper ID (Simplified matching for demo)
    const shortName = itemName.split(' ')[0]; 
    const wrapper = document.getElementById(`add-wrapper-${shortName}`);
    if(!wrapper) return; // For items without mapped IDs yet
    
    const item = cart.find(i => i.name === itemName);
    if(item) {
        wrapper.innerHTML = `
        <div class="qty-control">
            <button class="qty-btn" onclick="changeQuantity('${itemName}', -1)">-</button>
            <div class="qty-count">${item.quantity}</div>
            <button class="qty-btn" onclick="changeQuantity('${itemName}', 1)">+</button>
        </div>`;
    }
}

function resetItemButton(itemName) {
    const shortName = itemName.split(' ')[0];
    const wrapper = document.getElementById(`add-wrapper-${shortName}`);
    if(wrapper) {
        // Need original price, getting it from DOM is complex, passing a standard fix
        const itemObj = document.querySelector(`[onclick*="${itemName}"]`);
        if(itemObj) {
            const originalHTML = `<button class="add-btn" onclick="${itemObj.getAttribute('onclick')}">ADD</button>`;
            wrapper.innerHTML = originalHTML;
        }
    }
}

function updateCartUI() {
    const floatingCart = document.getElementById('floating-cart');
    let totalItems = 0;
    let cartTotal = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        cartTotal += (item.price * item.quantity);
    });
    
    if(totalItems > 0) {
        floatingCart.classList.remove('hidden');
        document.getElementById('cart-item-count').innerText = `${totalItems} Item${totalItems > 1 ? 's' : ''}`;
        document.getElementById('cart-total-amount').innerText = cartTotal;
    } else {
        floatingCart.classList.add('hidden');
        isDiscountApplied = false; // Reset discount
    }
}

// --- Checkout Modal ---
function openCheckout() {
    if(cart.length === 0) return;
    renderCheckoutList();
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function renderCheckoutList() {
    const checkoutList = document.getElementById('checkout-items-list');
    checkoutList.innerHTML = '';
    
    cart.forEach(item => {
        checkoutList.innerHTML += `
        <div class="cart-item-row">
            <img src="${item.img}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="qty-control" style="border-color:#333; background:#111;">
                <button class="qty-btn" style="background:#111; color:#fff;" onclick="changeQuantity('${item.name}', -1)">-</button>
                <div class="qty-count" style="color:#fff;">${item.quantity}</div>
                <button class="qty-btn" style="background:#111; color:#fff;" onclick="changeQuantity('${item.name}', 1)">+</button>
            </div>
            <div style="width: 20%; text-align:right; font-weight:bold; color:#fff;">₹${item.price * item.quantity}</div>
        </div>`;
    });
    
    updateBillSummary();
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateBillSummary() {
    const cartTotal = getCartTotal();
    document.getElementById('bill-subtotal').innerText = cartTotal;
    
    let grandTotal = cartTotal;
    
    if(isDiscountApplied) {
        const discountAmt = Math.round(cartTotal * 0.10);
        grandTotal = cartTotal - discountAmt;
        document.getElementById('discount-row').classList.remove('hidden');
        document.getElementById('bill-discount').innerText = discountAmt;
        document.getElementById('apply-discount-btn').innerText = "Applied ✔";
        document.getElementById('apply-discount-btn').classList.add('applied');
    } else {
        document.getElementById('discount-row').classList.add('hidden');
        document.getElementById('apply-discount-btn').innerText = "Apply";
        document.getElementById('apply-discount-btn').classList.remove('applied');
    }
    
    document.getElementById('bill-total').innerText = grandTotal;
}

function toggleDiscount() {
    if(cart.length === 0) return;
    
    if(!isPuzzleSolved) {
        alert("Play the Puzzle game on the menu to unlock this coupon!");
        closeModal('checkout-modal');
        return;
    }
    
    isDiscountApplied = !isDiscountApplied;
    updateBillSummary();
}

// --- Order Type Toggle ---
function setOrderType(type) {
    currentOrderType = type;
    document.getElementById('dine-in-btn').classList.toggle('active', type === 'dine-in');
    document.getElementById('delivery-btn').classList.toggle('active', type === 'delivery');
    document.getElementById('dine-in-form').classList.toggle('hidden', type !== 'dine-in');
    document.getElementById('delivery-form').classList.toggle('hidden', type !== 'delivery');
}

// --- Modals Global ---
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// --- Game Logic (In-App) ---
function openGameModal() {
    if(isPuzzleSolved) {
        alert("You have already won the discount for this session!");
        return;
    }
    document.getElementById('game-answer').value = "";
    document.getElementById('game-error').classList.add('hidden');
    openModal('game-modal');
}

function checkGameAnswer() {
    const ans = document.getElementById('game-answer').value.toUpperCase().trim();
    if(ans === "KAVYA") {
        closeModal('game-modal');
        isPuzzleSolved = true;
        document.getElementById('game-section').classList.add('game-locked');
        document.querySelector('.play-btn').innerText = "UNLOCKED ✔";
        openModal('success-modal');
        
        // Auto apply if cart is open
        document.getElementById('coupon-msg').innerText = "Coupon unlocked! Tap apply.";
        document.getElementById('coupon-msg').style.color = "#00E5FF";
    } else {
        document.getElementById('game-error').classList.remove('hidden');
    }
}

// --- Checkout Integrations ---
function getFinalBillDetails() {
    const cartTotal = getCartTotal();
    const discountAmt = isDiscountApplied ? Math.round(cartTotal * 0.10) : 0;
    return {
        subtotal: cartTotal,
        discount: discountAmt,
        grandTotal: cartTotal - discountAmt
    };
}

function payViaUPI() {
    const details = getFinalBillDetails();
    if(details.grandTotal <= 0) return;
    
    // Direct UPI Deep-link
    const upiLink = `upi://pay?pa=${RESTAURANT_UPI}&pn=Kavya%20VIP%20Menu&am=${details.grandTotal}&cu=INR&tn=Order%20Payment`;
    window.location.href = upiLink;
    
    // Fallback if UPI app not found (Wait 1.5s, then trigger whatsapp)
    setTimeout(() => {
        if(confirm("If UPI app didn't open, proceed to WhatsApp to place order?")) {
            sendOrderToWhatsApp();
        }
    }, 1500);
}

function sendOrderToWhatsApp() {
    const custName = loggedInUser || 'VIP Customer';
    const custPhone = localStorage.getItem('kavya_user_phone') || '';
    const details = getFinalBillDetails();
    
    let text = `*NEW VIP ORDER* 🚀\n\n*Name:* ${custName}\n*Phone:* ${custPhone}\n\n*Items:*`;
    cart.forEach(item => { text += `\n▪ ${item.quantity}x ${item.name} (₹${item.price * item.quantity})`; });
    
    text += `\n\n*Subtotal:* ₹${details.subtotal}`;
    if(isDiscountApplied) text += `\n*Coupon Applied:* -₹${details.discount}`;
    text += `\n*Grand Total:* ₹${details.grandTotal}`;
    
    if(currentOrderType === 'dine-in') {
        const tNo = document.getElementById('table-no').value;
        text += `\n\n*Order Type:* Dine-In 🍽️\n*Table No:* ${tNo || 'Not provided'}`;
    } else {
        const h = document.getElementById('address-house').value;
        const s = document.getElementById('address-street').value;
        text += `\n\n*Order Type:* Delivery 🛵\n*Address:* ${h}, ${s}`;
    }
    
    const tokensEarned = Math.floor(details.grandTotal / 100) * 10;
    if(loggedInUser) {
        localStorage.setItem('kavya_user_tokens', userTokens + tokensEarned);
        text += `\n\n_Customer earned ${tokensEarned} 💎 on this order._`;
        checkLoginStatus(); // Update token UI silently
    }

    const whatsappURL = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');
}
