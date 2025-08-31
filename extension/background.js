
function dbg() {
  try { console.log('[Soura]', ...arguments); } catch {}
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'download' && msg.url) {
    // determine filename option using saved folder (relative to Downloads)
  const storageLocal = (chrome && chrome.storage && chrome.storage.local) ? chrome.storage.local : null;
  const proceed = async (res) => {
      const sanitizeSegment = (s) => (s || '').replace(/[\\:*?"<>|]/g, '').replace(/^\.+$/,'').trim();
      const sanitizePath = (p) => (p || '')
        .split('/')
        .map(seg => sanitizeSegment(seg))
        .filter(Boolean)
        .join('/');
      const hasKnownImageExt = (name) => /\.(avif|bmp|gif|heic|heif|ico|jpe?g|png|svg|tiff?|webp)$/i.test(name || '');
      const extFromContentType = (ctRaw) => {
        const ct = (ctRaw || '').toLowerCase().split(';')[0].trim();
        if (!ct) return '';
        if (ct === 'image/jpeg' || ct === 'image/pjpeg') return 'jpg';
        if (ct === 'image/png') return 'png';
        if (ct === 'image/gif') return 'gif';
        if (ct === 'image/webp') return 'webp';
        if (ct === 'image/bmp' || ct === 'image/x-bmp') return 'bmp';
        if (ct === 'image/svg+xml') return 'svg';
        if (ct === 'image/avif') return 'avif';
        if (ct === 'image/tiff') return 'tif';
        if (ct === 'image/x-icon' || ct === 'image/vnd.microsoft.icon') return 'ico';
        if (ct === 'image/heic') return 'heic';
        if (ct === 'image/heif') return 'heif';
        return '';
      };
      const parseContentDispositionFilename = (cd) => {
        if (!cd) return '';
        // Try RFC 5987 filename*
        const mStar = cd.match(/filename\*=([^;]+)/i);
        if (mStar) {
          try {
            const v = mStar[1].trim();
            // format: UTF-8''encoded-name
            const parts = v.split("''");
            const encName = parts.pop();
            const decoded = decodeURIComponent(encName.replace(/^\"|\"$/g, ''));
            return decoded;
          } catch {}
        }
        // Fallback: filename="..." or filename=...
        const m = cd.match(/filename\s*=\s*\"([^\"]+)\"/i) || cd.match(/filename\s*=\s*([^;]+)/i);
        if (m) return m[1].trim();
        return '';
      };
  const folder = sanitizePath(res && res.soura_folder ? res.soura_folder.trim() : '');
  dbg('download request', { url: msg.url, reqFilename: msg.filename, folder });
      // build a safe filename using URL path or timestamp fallback
      try {
        const url = new URL(msg.url);
        const scheme = url.protocol.replace(':','');
        if (scheme !== 'http' && scheme !== 'https' && scheme !== 'data') {
          sendResponse({ success: false, error: `Unsupported URL scheme: ${scheme}` });
          return;
        }
        const pathname = url.pathname.split('/').filter(Boolean).pop() || '';
    const rawName = (msg.filename && typeof msg.filename === 'string' && msg.filename.trim()) || pathname || `soura-${Date.now()}`;
        let baseName = sanitizeSegment(rawName);
        // Ensure a proper image extension
        if (!hasKnownImageExt(baseName)) {
          if (scheme === 'data') {
            const mime = msg.url.slice(5).split(';')[0];
            const ext = extFromContentType(mime) || 'png';
            baseName = `${baseName}.${ext}`;
      dbg('data URL -> using ext from mime', { mime, baseName });
          } else {
            // Try to detect from Content-Disposition/Type via a quick HEAD, fallback to GET with Range
            let detectedName = '';
            let detectedExt = '';
            const attemptFetch = async (method) => {
              const controller = new AbortController();
              const timer = setTimeout(() => controller.abort(), 3000);
              try {
                const resp = await fetch(msg.url, { method, redirect: 'follow', signal: controller.signal, headers: method === 'GET' ? { 'Range': 'bytes=0-0' } : undefined });
                clearTimeout(timer);
                if (resp && ('headers' in resp)) {
                  const cd = resp.headers.get('content-disposition');
                  const ct = resp.headers.get('content-type');
                  const fromCd = parseContentDispositionFilename(cd);
                  if (fromCd) detectedName = sanitizeSegment(fromCd);
                  if (ct) detectedExt = extFromContentType(ct);
                  dbg(method + ' headers', { cd, ct, fromCd: detectedName, detectedExt });
                }
              } catch {
                clearTimeout(timer);
              }
            };
            await attemptFetch('HEAD');
            if (!detectedName && !detectedExt) {
              await attemptFetch('GET');
            }
            if (detectedName) {
              baseName = detectedName;
            }
            if (!hasKnownImageExt(baseName) && detectedExt) {
              baseName = `${baseName}.${detectedExt}`;
            }
            // Try query-string hints
            if (!hasKnownImageExt(baseName)) {
              const search = url.search.toLowerCase();
              const guess = (k) => {
                const m = new RegExp(`[?&]${k}=([^&]+)`).exec(search);
                return m ? decodeURIComponent(m[1]) : '';
              };
              const candidates = [guess('format'), guess('fm'), guess('ext'), guess('type')].filter(Boolean);
              for (const c of candidates) {
                const val = c.toLowerCase();
                const fromMime = val.startsWith('image/') ? val.split('/').pop() : val;
                let ext = fromMime.replace('jpeg','jpg').replace('svg+xml','svg').replace('tiff','tif');
                if (/^(avif|bmp|gif|heic|heif|ico|jpg|jpeg|png|svg|tif|tiff|webp)$/.test(ext)) {
                  if (ext === 'jpeg') ext = 'jpg';
                  if (ext === 'tiff') ext = 'tif';
                  baseName = `${baseName}.${ext}`;
                  dbg('query hint ext', { ext, baseName });
                  break;
                }
              }
            }
            // Final fallback
            if (!hasKnownImageExt(baseName)) {
              baseName = `${baseName}.jpg`;
              dbg('fallback ext', { baseName });
            }
          }
        }
        if (folder) {
          const filename = `${folder}/${baseName}`;
      dbg('downloading with filename', filename);
      chrome.downloads.download({ url: msg.url, filename }, (downloadId) => {
            if (chrome.runtime.lastError || !downloadId) {
        const err = chrome.runtime.lastError && chrome.runtime.lastError.message;
        notify('Soura: Download failed', err || 'Unknown error');
        sendResponse({ success: false, error: err });
            } else {
        notify('Soura: Download started', baseName);
        try { chrome.downloads.search({ id: downloadId }, (items) => { if (items && items[0]) dbg('started', { id: downloadId, target: items[0].filename, mime: items[0].mime }); }); } catch {}
              sendResponse({ success: true, id: downloadId });
            }
          });
          return;
        }
        // No folder set: set baseName so Chrome still uses Downloads with this filename
        dbg('downloading with filename', baseName);
        chrome.downloads.download({ url: msg.url, filename: baseName }, (downloadId) => {
          if (chrome.runtime.lastError || !downloadId) {
            const err = chrome.runtime.lastError && chrome.runtime.lastError.message;
            notify('Soura: Download failed', err || 'Unknown error');
            sendResponse({ success: false, error: err });
          } else {
            notify('Soura: Download started', baseName);
            try { chrome.downloads.search({ id: downloadId }, (items) => { if (items && items[0]) dbg('started', { id: downloadId, target: items[0].filename, mime: items[0].mime }); }); } catch {}
            sendResponse({ success: true, id: downloadId });
          }
        });
      } catch (e) {
        // on error just download with default behavior
        const fallbackName = (msg.filename || `soura-${Date.now()}`);
        const fbName = /\./.test(fallbackName) ? fallbackName : `${fallbackName}.jpg`;
        dbg('downloading (error path) with filename', fbName, 'error:', e && e.message);
        chrome.downloads.download({ url: msg.url, filename: fbName }, (downloadId) => {
          if (chrome.runtime.lastError || !downloadId) {
            const err = chrome.runtime.lastError && chrome.runtime.lastError.message;
            notify('Soura: Download failed', err || 'Unknown error');
            sendResponse({ success: false, error: err });
          } else {
            notify('Soura: Download started', fbName);
            try { chrome.downloads.search({ id: downloadId }, (items) => { if (items && items[0]) dbg('started', { id: downloadId, target: items[0].filename, mime: items[0].mime }); }); } catch {}
            sendResponse({ success: true, id: downloadId });
          }
        });
      }
  };
  if (storageLocal) storageLocal.get(['soura_folder'], proceed);
  else proceed({});
    // return true to keep the messaging channel open for sendResponse
    return true;
  }
});

function notify(title, message) {
  if (!chrome.notifications) return;
  try {
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title,
      message
    });
  } catch {}
}

chrome.runtime.onInstalled.addListener((details) => {
  try {
    if (details.reason === 'install' || details.reason === 'update') {
      // briefly set a badge to draw attention to the update
      if (chrome.action && chrome.action.setBadgeText) {
        chrome.action.setBadgeText({ text: 'NEW' });
        chrome.action.setBadgeBackgroundColor({ color: '#ff3b30' });
        setTimeout(() => chrome.action.setBadgeText({ text: '' }), 10000);
      }
    }
  } catch (e) {
    // ignore on older clients
  }
});
