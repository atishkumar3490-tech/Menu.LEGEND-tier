/* =========================================
   UI.JS - Interface & Animations Engine
   ========================================= */

function initUI() {
    // 1. Golden Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) {
            splash.classList.add('fade-out');
            setTimeout(() => splash.style.display = 'none', 800);
        }
    }, 1500);

    // 2. Render Categories (GitHub Images)
    const catContainer = document.getElementById('category-scroll-container');
    if(catContainer) {
        catContainer.innerHTML = '';
        categories.forEach(cat => {
            const isActive = cat.id === 'All' ? 'active' : '';
            catContainer.innerHTML += `
                <div class="category-item ${isActive}" onclick="setCategory('${cat.id}', this)">
                    <div class="cat-icon"><img src="${cat.img}" alt="${cat.name}"></div>
                    <span>${cat.name}</span>
                </div>
            `;
        });
    }

    // 3. Apple Style Scroll Magic (Header & Menu)
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        const catMenu = document.getElementById('category-menu');
        if(window.scrollY > 40) {
            if(header) header.classList.add('scrolled');
            if(catMenu) catMenu.classList.add('scrolled');
        } else {
            if(header) header.classList.remove('scrolled');
            if(catMenu) catMenu.classList.remove('scrolled');
        }
    }, {passive: true});

    // 4. Smart Rotating Search
    const searchKeywords = ['Search "Chicken Tikka"...', 'Search "Butter Naan"...', 'Search "Paneer"...', 'Craving Kebab?'];
    let searchIdx = 0;
    setInterval(() => {
        const searchInput = document.getElementById('main-search');
        if(searchInput) {
            searchInput.placeholder = searchKeywords[searchIdx];
            searchIdx = (searchIdx + 1) % searchKeywords.length;
        }
    }, 2500);

    // 5. Bespoke Greeting
    updateGreeting();
}

function updateGreeting() {
    const hours = new Date().getHours();
    const name = window.loggedInUser || 'Legend';
    let greeting = "";
    if(hours < 12) greeting = `Good Morning, ${name}!`;
    else if(hours < 16) greeting = `Good Afternoon, ${name}!`;
    else greeting = `Good Evening, ${name}!`;
    
    const greetEl = document.getElementById('dynamic-greeting');
    if(greetEl) greetEl.innerText = greeting;
}

function showToast(message, type="success") {
    const toast = document.getElementById('toast-container');
    const msg = document.getElementById('toast-message');
    const icon = document.getElementById('toast-icon');
    
    msg.innerText = message;
    if(type === 'error') {
        icon.className = 'fa-solid fa-triangle-exclamation';
        icon.style.color = 'var(--nonveg-red)';
    } else {
        icon.className = 'fa-solid fa-circle-check';
        icon.style.color = 'var(--veg-green)';
    }
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function openPopup(id) {
    const popup = document.getElementById(id);
    if(popup) popup.classList.remove('hidden');
}

function closePopup(id) {
    const popup = document.getElementById(id);
    if(popup) popup.classList.add('hidden');
}

// Apple Bookmark Logic
window.toggleBookmark = function(btn) {
    btn.classList.toggle('bookmarked');
    if(btn.classList.contains('bookmarked')) {
        btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
        showToast("Saved to Favorites!");
    } else {
        btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
        showToast("Removed from Favorites");
    }
}
