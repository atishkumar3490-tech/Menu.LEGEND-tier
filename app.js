/* =========================================
   KAVYA LEGEND TIER - CORE LOGIC (ENGINE)
   ========================================= */

// --- 1. Global Variables & Initialization ---
let cart = [];
let cartTotal = 0;
let discountAmt = 0;
let userTokens = 0;
let currentOrderType = 'dine-in'; // Default to dine-in
let isPuzzleSolved = false;
let loggedInUser = null;

// Page Load hote hi ye sab functions chalenge
document.addEventListener('DOMContentLoaded', () => {
    checkTimeAndGreet();
    checkLoginStatus();
    updateCartUI();
    
    // Hide welcome popup after 3 seconds
    setTimeout(() => {
        const popup = document.getElementById('welcome-popup');
        if(popup) {
            popup.style.opacity = '0';
            setTimeout(() => popup.style.display = 'none', 800);
        }
    }, 3000);
});


// --- 2. Dynamic Time-Based Greeting System ---
function checkTimeAndGreet() {
    const hour = new Date().getHours();
    const banner = document.getElementById('time-greeting-banner');
    const text = document.getElementById('time-text');
    
    if(!banner || !text) return;

    if (hour >= 6 && hour < 11) {
        text.innerText = "☕ Good Morning! Breakfast Specials are here.";
        banner.style.background = "linear-gradient(90deg, #ff9966, #ff5e62)";
    } else if (hour >= 11 && hour < 17) {
        text.innerText = "🍛 Lunch O'clock! Try our Premium Thalis.";
        banner.style.background = "linear-gradient(90deg, #56ab2f, #a8e063)";
    } else if (hour >= 17 && hour < 22) {
        text.innerText = "🍲 Dinner Plans? Treat yourself.";
        banner.style.background = "linear-gradient(90deg, #2b1055, #7597de)";
    } else {
        text.innerText = "🌙 Late Night Cravings? We deliver till 2 AM!";
        banner.style.background = "linear-gradient(90deg, #0f2027, #203a43, #2c5364)";
    }
}


// --- 3. Login & Legend Tokens System ---
function checkLoginStatus() {
    const savedName = localStorage.getItem('kavya_user_name');
    const savedTokens = localStorage.getItem('kavya_user_tokens');
    
    if(savedName) {
        loggedInUser = savedName;
        userTokens = savedTokens ? parseInt(savedTokens) : 0;
        
        // Update Greeting in Popup
        const greetingText = document.getElementById('greeting-text');
        if(greetingText) greetingText.innerText = `Hello ${savedName}, Welcome back!`;
        
        // Show Tokens, Hide Login Button
        document.getElementById('login-btn').style.display = 'none';
        const tokenDisplay = document.getElementById('token-display');
        tokenDisplay.style.display = 'block';
        document.getElementById('token-count').innerText = userTokens;
    }
}

function openLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function loginUser() {
    const nameInput = document.getElementById('user-name').value;
    const phoneInput = document.getElementById('user-phone').value;
    
    if(nameInput.trim() === "" || phoneInput.trim() === "") {
        alert("Please enter both Name and WhatsApp Number.");
        return;
    }
    
    // Save to LocalStorage (Browser Memory)
    localStorage.setItem('kavya_user_name', nameInput);
    localStorage.setItem('kavya_user_phone', phoneInput);
    
    // Give 50 Welcome Tokens to New Users
    let tokens = localStorage.getItem('kavya_user_tokens');
    if(!tokens) {
        localStorage.setItem('kavya_user_tokens', 50);
        alert("Welcome to the Legend Tier! You got 50 💎 bonus tokens.");
    }
    
    closeModal('login-modal');
    checkLoginStatus();
}


// --- 4. Add to Food Cart Engine ---
function addToCart(itemName, itemPrice) {
    // Check if item already in cart
    const existingItem = cart.find(i => i.name === itemName);
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemName, price: parseInt(itemPrice), quantity: 1 });
    }
    
    updateCartUI();
    
    // Simple visual feedback on button
    event.target.innerText = "Added ✔";
    event.target.style.background = "#25D366";
    event.target.style.color = "#000";
    setTimeout(() => {
        event.target.innerText = "Add to Food Cart";
        event.target.style.background = "rgba(37, 211, 102, 0.1)";
        event.target.style.color = "#25D366";
    }, 1500);
}

function updateCartUI() {
    const floatingCart = document.getElementById('floating-cart');
    const itemCountSpan = document.getElementById('cart-item-count');
    const totalAmountSpan = document.getElementById('cart-total-amount');
    
    let totalItems = 0;
    cartTotal = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        cartTotal += (item.price * item.quantity);
    });
    
    if(totalItems > 0) {
        floatingCart.classList.remove('hidden');
        itemCountSpan.innerText = `${totalItems} Item${totalItems > 1 ? 's' : ''}`;
        totalAmountSpan.innerText = cartTotal;
    } else {
        floatingCart.classList.add('hidden');
    }
}


// --- 5. Checkout & Modals Logic ---
function openCheckout() {
    if(cart.length === 0) return;
    
    const checkoutList = document.getElementById('checkout-items-list');
    checkoutList.innerHTML = '';
    
    cart.forEach(item => {
        checkoutList.innerHTML += `<p style="display:flex; justify-content:space-between; color:#ddd; margin:5px 0;">
            <span>${item.quantity}x ${item.name}</span>
            <span>₹${item.price * item.quantity}</span>
        </p>`;
    });
    
    updateBillSummary();
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function updateBillSummary() {
    document.getElementById('bill-subtotal').innerText = cartTotal;
    
    let grandTotal = cartTotal;
    
    // Apply puzzle discount if solved (e.g., 10% off)
    if(isPuzzleSolved) {
        discountAmt = Math.round(cartTotal * 0.10);
        grandTotal = cartTotal - discountAmt;
        document.getElementById('discount-row').classList.remove('hidden');
        document.getElementById('bill-discount').innerText = discountAmt;
    }
    
    document.getElementById('bill-total').innerText = grandTotal;
}


// --- 6. Smart Dine-In / Delivery Toggle ---
function setOrderType(type) {
    currentOrderType = type;
    
    const dineInBtn = document.getElementById('dine-in-btn');
    const deliveryBtn = document.getElementById('delivery-btn');
    const dineInForm = document.getElementById('dine-in-form');
    const deliveryForm = document.getElementById('delivery-form');
    
    if(type === 'dine-in') {
        dineInBtn.classList.add('active');
        deliveryBtn.classList.remove('active');
        dineInForm.classList.remove('hidden');
        deliveryForm.classList.add('hidden');
    } else {
        deliveryBtn.classList.add('active');
        dineInBtn.classList.remove('active');
        deliveryForm.classList.remove('hidden');
        dineInForm.classList.add('hidden');
    }
}


// --- 7. WhatsApp Order Generation ---
function sendOrderToWhatsApp() {
    // 1. Get Customer Details (If logged in)
    const custName = loggedInUser ? loggedInUser : 'Valued Customer';
    const custPhone = localStorage.getItem('kavya_user_phone') || '';
    
    // 2. Build the Items List
    let orderText = `*NEW VIP ORDER* 🚀\n\n*Name:* ${custName}\n*Phone:* ${custPhone}\n\n*Items:*`;
    
    cart.forEach(item => {
        orderText += `\n▪ ${item.quantity}x ${item.name} (₹${item.price * item.quantity})`;
    });
    
    // 3. Build Bill Info
    orderText += `\n\n*Subtotal:* ₹${cartTotal}`;
    if(isPuzzleSolved) orderText += `\n*Puzzle Discount:* -₹${discountAmt}`;
    orderText += `\n*Grand Total:* ₹${cartTotal - discountAmt}`;
    
    // 4. Add Address / Table No
    if(currentOrderType === 'dine-in') {
        const tableNo = document.getElementById('table-no').value;
        orderText += `\n\n*Order Type:* Dine-In 🍽️`;
        orderText += `\n*Table No:* ${tableNo ? tableNo : 'Not provided'}`;
    } else {
        const house = document.getElementById('address-house').value;
        const street = document.getElementById('address-street').value;
        const landmark = document.getElementById('address-landmark').value;
        orderText += `\n\n*Order Type:* Home Delivery 🛵`;
        orderText += `\n*Address:* ${house}, ${street}, Landmark: ${landmark}`;
    }
    
    // 5. Reward Tokens Calculation (Give 10 tokens per 100 Rs spent)
    const tokensEarned = Math.floor((cartTotal - discountAmt) / 100) * 10;
    if(loggedInUser) {
        let currentTokens = parseInt(localStorage.getItem('kavya_user_tokens')) || 0;
        localStorage.setItem('kavya_user_tokens', currentTokens + tokensEarned);
        orderText += `\n\n_Customer earned ${tokensEarned} 💎 on this order._`;
    }

    // 6. Send via WhatsApp (Encode for URL)
    const ownerNumber = "919876543210"; // <--- BHAII YAHAN APNA NUMBER DAAL TEST KARNE KE LIYE
    const whatsappURL = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(orderText)}`;
    
    window.open(whatsappURL, '_blank');
}


// --- 8. Puzzle Game Logic (Basic Placeholder) ---
function openPuzzle() {
    // Isko hum baad me ek proper modal game se replace karenge
    const answer = prompt("🧩 Solve this to win 10% OFF!\n\nRearrange: Y A K V A\n(Hint: Restaurant Name)");
    
    if(answer && answer.toUpperCase() === "KAVYA") {
        alert("🎉 CORRECT! 10% Discount will be applied to your cart.");
        isPuzzleSolved = true;
        updateBillSummary();
        document.querySelector('.gamification-section').style.display = 'none'; // Hide puzzle after winning
    } else if (answer) {
        alert("❌ Oops! Try again later.");
    }
}
