// Extracted from index.html <script>
// Year
    document.getElementById('year').textContent = new Date().getFullYear();

// Drag-to-dock demo
const dock = document.getElementById('dock');
const counterEl = document.getElementById('counter');
let count = 0;

// Allow dragging the demo thumbnails
document.querySelectorAll('.thumb').forEach((t, i) => {
    t.addEventListener('dragstart', (e) => {
        const img = t.querySelector('img');
        e.dataTransfer.setData('text/uri-list', img.currentSrc || img.src);
        e.dataTransfer.setDragImage(img, img.width/2, img.height/2);
    });
});

// Dock behavior
const preventDefaults = (e) => { e.preventDefault(); e.stopPropagation(); };
['dragenter', 'dragover'].forEach(evt => dock.addEventListener(evt, (e) => {
    preventDefaults(e);
    dock.classList.add('dragover');
}));
;['dragleave', 'drop'].forEach(evt => dock.addEventListener(evt, (e) => {
    preventDefaults(e);
    if (evt === 'drop') handleDrop(e);
    dock.classList.remove('dragover');
}));

async function handleDrop(e){
    const dt = e.dataTransfer;
    const files = [...(dt.files || [])].filter(f => f.type.startsWith('image/'));
    const urls = dt.getData('text/uri-list')?.split('\n').filter(Boolean) || [];

    // Prefer dropped files (safe), else attempt to use provided URLs (same-origin likely).
    const toDownload = files.map(f => ({ name: f.name, blob: f }))
        .concat(urls.map((u, idx) => ({ url: u, name: `image-${Date.now()}-${idx}.png` })));

    if (toDownload.length === 0) {
        // Fallback: if user dragged a demo tile, count it.
        bump();
        return;
    }

    for (const item of toDownload) {
        try {
            if (item.blob) {
                triggerDownload(URL.createObjectURL(item.blob), item.name);
            } else if (item.url) {
                // Try to fetch; if CORS blocks, just count it without download.
                try {
                    const res = await fetch(item.url, { mode: 'cors' });
                    const blob = await res.blob();
                    const ext = blob.type.split('/')[1] || 'png';
                    triggerDownload(URL.createObjectURL(blob), item.name.replace(/\.png$/, '.'+ext));
                } catch { bump(); }
            }
        } catch {
            bump();
        }
    }
    bump(toDownload.length);
    dock.classList.add('pulse');
    setTimeout(() => dock.classList.remove('pulse'), 400);
}

function triggerDownload(href, name){
    const a = document.createElement('a');
    a.href = href; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    // do not revokeObjectURL immediately; allow browser to start download
    setTimeout(() => URL.revokeObjectURL(href), 5000);
}

function bump(n = 1){ count += n; counterEl.textContent = String(count); }

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
