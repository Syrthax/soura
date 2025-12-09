/**
 * Soura Background Service Worker
 * Handles download requests and file counter management
 */

// Download counter for auto-incrementing filenames
let downloadCounter = 0;

// Initialize counter from storage
chrome.storage.local.get(['downloadCounter'], (result) => {
  if (result.downloadCounter) {
    downloadCounter = result.downloadCounter;
  }
});

/**
 * Save counter to storage
 */
function saveCounter() {
  chrome.storage.local.set({ downloadCounter });
}

/**
 * Get file extension from URL or Content-Type
 */
function getFileExtension(url, contentType) {
  // Try to get extension from URL
  try {
    const urlPath = new URL(url).pathname;
    const match = urlPath.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/i);
    if (match) {
      return match[1].toLowerCase();
    }
  } catch (e) {
    // URL parsing failed
  }

  // Fallback to content-type
  if (contentType) {
    const typeMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/bmp': 'bmp',
      'image/avif': 'avif'
    };
    const ct = contentType.toLowerCase().split(';')[0].trim();
    return typeMap[ct] || 'jpg';
  }

  return 'jpg';
}

/**
 * Generate filename with auto-increment
 */
async function generateFilename(url) {
  downloadCounter++;
  saveCounter();

  // Get extension
  const extension = getFileExtension(url);
  
  // Format: soura_img_001.jpg
  const paddedNumber = String(downloadCounter).padStart(3, '0');
  return `soura_img_${paddedNumber}.${extension}`;
}

/**
 * Handle download request
 */
async function handleDownload(url) {
  try {
    // Get download folder from settings
    const settings = await chrome.storage.local.get(['downloadFolder']);
    const folder = settings.downloadFolder || '';

    // Generate filename
    const filename = await generateFilename(url);
    const fullPath = folder ? `${folder}/${filename}` : filename;

    // Start download
    const downloadId = await chrome.downloads.download({
      url: url,
      filename: fullPath,
      saveAs: false,
      conflictAction: 'uniquify'
    });

    console.log(`[Soura] Download started: ${filename} (ID: ${downloadId})`);
    return { success: true, downloadId, filename };
    
  } catch (error) {
    console.error('[Soura] Download failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Message listener
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadImage') {
    handleDownload(message.url)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

/**
 * On install - open settings page
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
  }
});
