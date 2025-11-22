// Extracted from index.html <script>
// Year
    document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    // Initialize theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Set default to light theme if no preference saved
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation effect
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 400);
    });
}

// Animated demo progress indicators
const progressDots = document.querySelectorAll('.progress-dot');
if (progressDots.length > 0) {
    let currentStep = 0;
    setInterval(() => {
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentStep);
        });
        currentStep = (currentStep + 1) % progressDots.length;
    }, 2000); // 8s animation / 4 steps = 2s per step
}

// Auto-hide dock on scroll
const dock = document.querySelector('.floating-dock');
if (dock) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling down - hide dock
                    dock.classList.add('dock-hidden');
                } else {
                    // Scrolling up - show dock
                    dock.classList.remove('dock-hidden');
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Overscroll stretch effect: gently scale key sections when user scrolls beyond the page limits
const stretchTargets = document.querySelectorAll('.stretchable');
let y0 = 0, isTouching = false, overscroll = 0, raf = null, decayId = null;

const atTop = () => (window.scrollY || document.documentElement.scrollTop) <= 0;
const atBottom = () => (window.innerHeight + (window.scrollY || document.documentElement.scrollTop) >= document.documentElement.scrollHeight - 1);

function applyStretch(){
    const amt = Math.min(0.15, Math.abs(overscroll) / 600); // max 15%
    const scaleY = 1 + amt;
    const translateY = overscroll < 0 ? amt * 6 : -amt * 6; // tiny shift toward pull
    stretchTargets.forEach(el => {
        el.style.transform = `translateY(${translateY}px) scaleY(${scaleY})`;
    });
}

function release(){
    cancelAnimationFrame(raf);
    if (decayId) cancelAnimationFrame(decayId);
    function decay(){
        overscroll *= 0.78;
        if (Math.abs(overscroll) < 0.5){ overscroll = 0; }
        applyStretch();
        if (overscroll !== 0){ decayId = requestAnimationFrame(decay); }
        else {
            stretchTargets.forEach(el => { el.style.transform = 'none'; });
        }
    }
    decayId = requestAnimationFrame(decay);
}

// Wheel (desktop)
window.addEventListener('wheel', (e) => {
    const dy = e.deltaY;
    if ((dy < 0 && atTop()) || (dy > 0 && atBottom())){
        overscroll += dy * 0.25;
        overscroll = Math.max(-180, Math.min(180, overscroll));
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(applyStretch);
        clearTimeout(window.__relTimer);
        window.__relTimer = setTimeout(release, 60);
    }
}, { passive: true });

// Touch (mobile)
window.addEventListener('touchstart', (e) => { isTouching = true; y0 = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    const dy = e.touches[0].clientY - y0; // positive when pulling down
    if ((dy > 0 && atTop()) || (dy < 0 && atBottom())){
        overscroll = dy * 0.6;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(applyStretch);
    }
}, { passive: true });
window.addEventListener('touchend', () => { isTouching = false; release(); }, { passive: true });
