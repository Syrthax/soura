
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'download' && msg.url) {
    // determine filename option using saved folder (relative to Downloads)
  const storageLocal = (chrome && chrome.storage && chrome.storage.local) ? chrome.storage.local : null;
  const proceed = (res) => {
      const sanitizeSegment = (s) => (s || '').replace(/[\\:*?"<>|]/g, '').replace(/^\.+$/,'').trim();
      const sanitizePath = (p) => (p || '')
        .split('/')
        .map(seg => sanitizeSegment(seg))
        .filter(Boolean)
        .join('/');
      const folder = sanitizePath(res && res.soura_folder ? res.soura_folder.trim() : '');
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
  const baseName = sanitizeSegment(rawName);
        if (folder) {
          const filename = `${folder}/${baseName}`;
      chrome.downloads.download({ url: msg.url, filename }, (downloadId) => {
            if (chrome.runtime.lastError || !downloadId) {
        const err = chrome.runtime.lastError && chrome.runtime.lastError.message;
        notify('Soura: Download failed', err || 'Unknown error');
        sendResponse({ success: false, error: err });
            } else {
        notify('Soura: Download started', baseName);
              sendResponse({ success: true, id: downloadId });
            }
          });
          return;
        }
        // No folder set: set baseName so Chrome still uses Downloads with this filename
        chrome.downloads.download({ url: msg.url, filename: baseName }, (downloadId) => {
          if (chrome.runtime.lastError || !downloadId) {
            const err = chrome.runtime.lastError && chrome.runtime.lastError.message;
            notify('Soura: Download failed', err || 'Unknown error');
            sendResponse({ success: false, error: err });
          } else {
            notify('Soura: Download started', baseName);
            sendResponse({ success: true, id: downloadId });
          }
        });
      } catch (e) {
        // on error just download with default behavior
        const fallbackName = (msg.filename || `soura-${Date.now()}`);
        chrome.downloads.download({ url: msg.url, filename: fallbackName }, (downloadId) => {
          if (chrome.runtime.lastError || !downloadId) {
            const err = chrome.runtime.lastError && chrome.runtime.lastError.message;
            notify('Soura: Download failed', err || 'Unknown error');
            sendResponse({ success: false, error: err });
          } else {
            notify('Soura: Download started', fallbackName);
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
