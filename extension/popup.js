// popup.js — settings-only popup for Soura

const folderInput = document.getElementById('folder-input');
const saveBtn = document.getElementById('save-folder');
const resetBtn = document.getElementById('reset-folder');
const status = document.getElementById('save-status');
const chooseBtn = document.getElementById('choose-folder');
const hintFolder = document.getElementById('hint-folder');
const testBtn = document.getElementById('test-download');

function setStatus(msg, ok = true) {
  if (!status) return;
  status.textContent = msg;
  status.style.color = ok ? '#0a0' : '#a00';
}

// Load existing setting immediately (guard if storage not available yet)
const storageLocal = (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) ? chrome.storage.local : null;
if (storageLocal) {
  storageLocal.get(['soura_folder'], (res) => {
    if (res && res.soura_folder) folderInput.value = res.soura_folder;
    if (hintFolder) hintFolder.textContent = folderInput.value || 'YourFolder';
  });
} else {
  setStatus('Storage unavailable; reload extension', false);
  setTimeout(() => setStatus('', true), 2500);
}

// Save button: persist and show confirmation
saveBtn.addEventListener('click', () => {
  const v = folderInput.value.trim();
  if (!storageLocal) { setStatus('Storage unavailable', false); return; }
  if (v) {
    storageLocal.set({ soura_folder: v }, () => {
      setStatus('Saved ✔', true);
      setTimeout(() => setStatus('', true), 1800);
    });
  } else {
    // empty => reset
    storageLocal.remove('soura_folder', () => {
      setStatus('Reset to default (Downloads) ✔', true);
      setTimeout(() => setStatus('', true), 1800);
    });
  }
});

resetBtn.addEventListener('click', () => {
  folderInput.value = '';
  if (!storageLocal) { setStatus('Storage unavailable', false); return; }
  storageLocal.remove('soura_folder', () => {
    setStatus('Reset to default (Downloads) ✔', true);
    setTimeout(() => setStatus('', true), 1800);
  });
});

if (chooseBtn) {
  chooseBtn.addEventListener('click', () => {
    // Simple prompt approach - works reliably in extension popups
    const currentValue = folderInput.value || 'Soura/Images';
    const v = prompt('Enter folder name inside Downloads:\n(e.g., Soura/Images, Photos/Downloaded)', currentValue);
    if (v !== null) {
      const cleanValue = v.trim();
      folderInput.value = cleanValue;
      if (hintFolder) hintFolder.textContent = cleanValue || 'YourFolder';
      // Save immediately for convenience
      if (!storageLocal) { setStatus('Storage unavailable', false); return; }
      if (cleanValue) {
        storageLocal.set({ soura_folder: cleanValue }, () => {
          setStatus('Saved ✔', true);
          setTimeout(() => setStatus('', true), 1800);
        });
      } else {
        storageLocal.remove('soura_folder', () => {
          setStatus('Reset to default (Downloads) ✔', true);
          setTimeout(() => setStatus('', true), 1800);
        });
      }
    }
  });
}

if (testBtn) {
  testBtn.addEventListener('click', () => {
    // 1x1 PNG data URL (tiny)
    const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO1v2UoAAAAASUVORK5CYII=';
    chrome.runtime.sendMessage({ action: 'download', url: tinyPng, filename: `soura-test-${Date.now()}.png` }, (resp) => {
      if (resp && resp.success) {
        setStatus('Test download started ✔', true);
      } else {
        const err = (resp && resp.error) ? resp.error : 'Failed';
        setStatus('Test download failed: ' + err, false);
      }
      setTimeout(() => setStatus('', true), 2000);
    });
  });
}
