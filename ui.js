/* ==========================================================
   UI.JS - Enterprise UI Engine, Touch Physics & Observers
   ========================================================== */

class UIController {
    constructor() {
        this.toastQueue = [];
        this.isToastShowing = false;
        this.initSplash();
        this.initScrollEngine();
        this.initSmartSearch();
        this.initBottomSheetPhysics();
    }

    // 1. Cinematic Splash Screen
    initSplash() {
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.classList.add('fade-out');
                setTimeout(() => splash.style.display = 'none', 850);
            }
        }, 1800);
    }

    // 2. Heavy Scroll Observer (Zomato Style Lazy Fade-in)
    initScrollEngine() {
        const header = document.getElementById('main-header');
        const catMenu = document.getElementById('category-menu');
        
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y > 50) {
                header?.classList.add('scrolled');
                catMenu?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
                catMenu?.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 3. Debounced Smart Search Placeholder (Memory Optimized)
    initSmartSearch() {
        const keywords = ['Search "Chicken Tikka"...', 'Search "Butter Naan"...', 'Search "Paneer"...', 'Craving Biryani?'];
        let idx = 0;
        this.searchInterval = setInterval(() => {
            const searchInput = document.getElementById('main-search');
            if (searchInput) {
                searchInput.style.opacity = 0;
                setTimeout(() => {
                    searchInput.placeholder = keywords[idx = (idx + 1) % keywords.length];
                    searchInput.style.opacity = 1;
                }, 300);
            }
        }, 3000);
    }

    // 4. Apple-Style Toast Notification Queue System
    showToast(message, type = "success") {
        this.toastQueue.push({ message, type });
        this.processToastQueue();
    }

    processToastQueue() {
        if (this.isToastShowing || this.toastQueue.length === 0) return;
        this.isToastShowing = true;

        const { message, type } = this.toastQueue.shift();
        const toast = document.getElementById('toast-container');
        const msgEl = document.getElementById('toast-message');
        const iconEl = document.getElementById('toast-icon');

        msgEl.innerText = message;
        iconEl.className = type === 'error' ? 'fa-solid fa-triangle-exclamation text-red' : 'fa-solid fa-circle-check text-green';
        
        toast.classList.add('show');
        
        // Haptic Feedback for Mobile (if supported)
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(type === 'error' ? [50, 50, 50] : 50);
        }

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                this.isToastShowing = false;
                this.processToastQueue(); // Process next in queue
            }, 400);
        }, 3000);
    }

    // 5. Popup Managers
    openPopup(id) { 
        const el = document.getElementById(id);
        if(el) el.classList.remove('hidden'); 
    }
    
    closePopup(id) { 
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden'); 
    }

    // 6. Apple iOS Style Drag-to-Dismiss Bottom Sheet Physics
    initBottomSheetPhysics() {
        const sheet = document.querySelector('.z-bottom-sheet');
        if(!sheet) return;

        let startY, currentY, isDragging = false;

        sheet.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
            sheet.style.transition = 'none';
        }, { passive: true });

        sheet.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            if (diff > 0) { // Only allow dragging downwards
                sheet.style.transform = `translateY(${diff}px)`;
            }
        }, { passive: true });

        sheet.addEventListener('touchend', (e) => {
            isDragging = false;
            sheet.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            const diff = currentY - startY;
            
            if (diff > 100) {
                // User swiped down hard enough, close it
                this.closePopup('flavor-slider-modal');
                setTimeout(() => sheet.style.transform = '', 300);
            } else {
                // Snap back
                sheet.style.transform = 'translateY(0)';
            }
        });
    }

    // Bookmark Toggle Animation
    toggleBookmark(btn) {
        btn.classList.toggle('bookmarked');
        if (btn.classList.contains('bookmarked')) {
            btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
            this.showToast("Saved to Favorites!");
        } else {
            btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
            this.showToast("Removed from Favorites");
        }
    }
}

// Initialize UI Engine Globally
window.UI = new UIController();
