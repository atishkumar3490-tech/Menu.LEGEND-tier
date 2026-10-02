/* =========================================
   KAVYA MAX TIER - VIP CORE LOGIC V2
   ========================================= */

let cart = [];

// 1. SPLASH SCREEN FIX
document.addEventListener('DOMContentLoaded', () => {
    // Fade out splash screen after 1.5 seconds
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => { splash.style.display = 'none'; }, 800);
        }
    }, 1500);

    // Load the menu
    renderMenu();
});

// 2. THE MENU DATA (All 11 Items extracted from your old code)
const menuItems = [
    { id: 'biryani', name: 'Special Chicken Biryani', price: 299, oldPrice: 450, veg: false, rating: '4.8', badge: '33% OFF', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', desc: 'Served with Raita & spicy Salan. Premium long-grain Basmati Rice.' },
    { id: 'paneer', name: 'Paneer Butter Masala', price: 249, oldPrice: 350, veg: true, rating: '4.5', badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600&q=80', desc: 'Rich, creamy tomato gravy with soft malai paneer cubes. A Kavya specialty.' },
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

// 3. AUTO-GENERATE MENU HTML
function renderMenu() {
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = ''; // Clears the container

    menuItems.forEach(item => {
        // Check if Veg or Non-Veg
        const vegClass = item.veg ? 'veg' : 'non-veg';
        // Generate Badge if exists
        const badgeHTML = item.badge ? `<div class="badge ${item.badge.includes('OFF') ? 'discount-badge' : 'bestseller-badge'}">${item.badge}</div>` : '';
        // Generate Old Price if exists
        const oldPriceHTML = item.oldPrice ? `<span class="old-price">₹${item.oldPrice}</span>` : '';

        // Inject the exact Glassmorphism HTML we built in CSS
        menuContainer.innerHTML += `
        <div class="premium-food-card glass-panel">
            <div class="food-image-wrapper">
                <img src="${item.img}" alt="${item.name}">
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

// 4. BASIC CART LOGIC (Connects to Neon Taskbar)
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    
    // Check if item is already in cart
    const existingItem = cart.find(i => i.id === itemId);
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    // In the next step, we will change the "ADD" button to a [-] 1 [+] button here.
}

function updateCartUI() {
    let totalItems = 0;
    cart.forEach(item => totalItems += item.quantity);
    
    const cartBadge = document.getElementById('nav-cart-count');
    
    if(totalItems > 0) {
        cartBadge.classList.remove('hidden');
        cartBadge.innerText = totalItems;
        // Make the cart icon glow neon when items are added
        document.querySelector('.cart-nav i').style.textShadow = '0 0 15px rgba(0, 229, 255, 0.8)';
        document.querySelector('.cart-nav i').style.color = '#00E5FF';
    } else {
        cartBadge.classList.add('hidden');
        document.querySelector('.cart-nav i').style.textShadow = 'none';
        document.querySelector('.cart-nav i').style.color = 'var(--text-muted)';
    }
}

