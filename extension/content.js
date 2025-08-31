
let popupInjected = false;
let blurOverlay;
let currentImgSrc = null;
let currentImgEl = null;
let escHandler = null;

// Show a one-time "What's new" banner after an update.
const CURRENT_VERSION = '1.2';
function showWhatsNewOnce() {
  try {
    const last = localStorage.getItem('soura_last_seen_version');
    if (last === CURRENT_VERSION) return;
    localStorage.setItem('soura_last_seen_version', CURRENT_VERSION);

    const banner = document.createElement('div');
    banner.id = 'soura-whats-new';
    banner.style.position = 'fixed';
    banner.style.right = '16px';
    banner.style.bottom = '16px';
    banner.style.zIndex = '10000';
    banner.style.background = '#0b84ff';
    banner.style.color = 'white';
    banner.style.padding = '12px 16px';
    banner.style.borderRadius = '8px';
    banner.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
    banner.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
    banner.innerHTML = `
      <div style="min-width:220px">
        <div style="font-weight:600;margin-bottom:6px">Soura updated</div>
        <div style="font-size:12px;opacity:0.95">What's new: one-time banner and small UX improvements.</div>
        <div style="margin-top:8px;text-align:right">
          <button id="soura-whats-new-open" style="margin-right:8px;background:#fff;color:#0b84ff;border:none;padding:6px 8px;border-radius:5px;cursor:pointer">View</button>
          <button id="soura-whats-new-close" style="background:transparent;border:1px solid rgba(255,255,255,0.25);color:#fff;padding:6px 8px;border-radius:5px;cursor:pointer">Dismiss</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('soura-whats-new-close').addEventListener('click', () => banner.remove());
    document.getElementById('soura-whats-new-open').addEventListener('click', () => {
      // open changelog in a small window/tab
      try { window.open(chrome.runtime.getURL('CHANGELOG.md'), '_blank'); } catch (e) { window.open('CHANGELOG.md', '_blank'); }
      banner.remove();
    });
  } catch (e) {
    // ignore storage errors
  }
}

function createBlurOverlay() {
  blurOverlay = document.createElement('div');
  blurOverlay.style.position = 'fixed';
  blurOverlay.style.top = '0';
  blurOverlay.style.left = '0';
  blurOverlay.style.width = '100vw';
  blurOverlay.style.height = '100vh';
  blurOverlay.style.zIndex = '9998';
  blurOverlay.style.backdropFilter = 'blur(8px)';
  blurOverlay.style.pointerEvents = 'none';
  document.body.appendChild(blurOverlay);
}

function removeBlurOverlay() {
  if (blurOverlay) blurOverlay.remove();
}

function injectPopup() {
  if (popupInjected) return;
  popupInjected = true;
  const container = document.createElement('div');
  container.id = 'img-drag-popup';
  container.innerHTML = `
    <div class="idp-inner">
      <h4 class="idp-title">Drop image here to download</h4>
  <div class="idp-drop" role="button" aria-label="Drop image here" tabindex="0"></div>
  <div class="idp-help">Click or drop to download. Press Esc to cancel.</div>
    </div>
  `;
  document.body.appendChild(container);

  const dropArea = container.querySelector('.idp-drop');
  const title = container.querySelector('.idp-title');

  async function triggerDownload() {
    if (!currentImgSrc) return;
    title.textContent = 'Starting download...';
    try {
      const prep = await resolveImageForDownload(currentImgEl, currentImgSrc);
      if (prep.error) { showError(prep.error); return; }
      chrome.runtime.sendMessage({ action: 'download', url: prep.url, filename: prep.name }, (resp) => {
        // Handle sleeping service worker or other runtime errors too
        if (chrome.runtime && chrome.runtime.lastError) {
          showError(chrome.runtime.lastError.message || 'Background unavailable');
          return;
        }
        if (resp && resp.success) {
          title.textContent = 'Download started';
          setTimeout(() => { removeBlurOverlay(); removePopup(); }, 900);
        } else {
          const err = (resp && resp.error) ? resp.error : 'Download failed';
          showError(err);
        }
      });
    } catch (e) {
      showError('Download failed');
    }
  }

  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    dropArea.classList.add('dragover');
  });
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
  });
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    triggerDownload();
  });

  dropArea.addEventListener('click', triggerDownload);

  dropArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerDownload();
    }
  });

  // Allow Esc to cancel
  escHandler = function(e) {
    if (e.key === 'Escape') {
      removeBlurOverlay();
      removePopup();
    }
  };
  document.addEventListener('keydown', escHandler);
}

function removePopup() {
  const node = document.getElementById('img-drag-popup');
  if (node) node.remove();
  popupInjected = false;
  if (escHandler) {
    document.removeEventListener('keydown', escHandler);
    escHandler = null;
  }
}

document.addEventListener('dragstart', function(e) {
  const t = e.target;
  if (t && t.tagName === 'IMG') {
  // Prefer a real URL over blob for better download reliability
  currentImgSrc = t.currentSrc || t.src || '';
  currentImgEl = t;
    createBlurOverlay();
    injectPopup();
  }
});

document.addEventListener('dragend', function(e) {
  removeBlurOverlay();
  removePopup();
  currentImgSrc = null;
  currentImgEl = null;
});

// Run the what's-new banner when the content script loads.
showWhatsNewOnce();

// Helpers
function showError(err) {
  const title = document.querySelector('#img-drag-popup .idp-title');
  if (title) title.textContent = 'Error: ' + err;
  const toast = document.createElement('div');
  toast.textContent = 'Soura: ' + err;
  toast.style.position = 'fixed';
  toast.style.left = '50%';
  toast.style.top = '20px';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#ff4d4f';
  toast.style.color = '#fff';
  toast.style.padding = '8px 12px';
  toast.style.borderRadius = '6px';
  toast.style.zIndex = '10001';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
  setTimeout(() => { removeBlurOverlay(); removePopup(); }, 1200);
}

function inferNameFromUrl(urlStr) {
  try {
    if (urlStr.startsWith('data:')) return `soura-${Date.now()}.png`;
    const url = new URL(urlStr);
    const name = url.pathname.split('/').filter(Boolean).pop();
    return name || `soura-${Date.now()}`;
  } catch {
    return `soura-${Date.now()}`;
  }
}

function resolveImageForDownload(imgEl, src) {
  return new Promise((resolve) => {
    if (!src) return resolve({ error: 'No image source' });
    // Try srcset/currentSrc again
    if (imgEl && imgEl.currentSrc && (imgEl.currentSrc.startsWith('http://') || imgEl.currentSrc.startsWith('https://'))) {
      return resolve({ url: imgEl.currentSrc, name: inferNameFromUrl(imgEl.currentSrc) });
    }
    // Try a wrapping anchor href if present
    if (imgEl && imgEl.closest) {
      const a = imgEl.closest('a[href]');
      if (a && (a.href.startsWith('http://') || a.href.startsWith('https://'))) {
        return resolve({ url: a.href, name: inferNameFromUrl(a.href) });
      }
    }
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return resolve({ url: src, name: inferNameFromUrl(src) });
    }
    if (src.startsWith('blob:') && imgEl) {
      try {
        const canvas = document.createElement('canvas');
        const w = imgEl.naturalWidth || imgEl.width || 0;
        const h = imgEl.naturalHeight || imgEl.height || 0;
        if (!w || !h) {
          return resolve({ error: 'Image not loaded yet' });
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgEl, 0, 0);
        try {
          const dataUrl = canvas.toDataURL('image/png');
          return resolve({ url: dataUrl, name: `soura-${Date.now()}.png` });
        } catch (e) {
          return resolve({ error: 'Blocked by cross-origin policy' });
        }
      } catch (e) {
        return resolve({ error: 'Unsupported image source' });
      }
    }
    return resolve({ error: 'Unsupported image source' });
  });
}
