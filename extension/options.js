/**
 * Soura Options Page Script
 * Handles settings configuration and statistics
 */

document.addEventListener('DOMContentLoaded', async () => {
  const folderInput = document.getElementById('folder-input');
  const saveBtn = document.getElementById('save-btn');
  const resetBtn = document.getElementById('reset-btn');
  const resetCounterBtn = document.getElementById('reset-counter-btn');
  const statusEl = document.getElementById('status');
  const downloadCountEl = document.getElementById('download-count');

  /**
   * Show status message
   */
  function showStatus(message, type = 'success') {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'status';
    }, 3000);
  }

  /**
   * Load current settings
   */
  async function loadSettings() {
    const settings = await chrome.storage.local.get(['downloadFolder', 'downloadCounter']);
    
    folderInput.value = settings.downloadFolder || '';
    downloadCountEl.textContent = settings.downloadCounter || 0;
  }

  /**
   * Save folder settings
   */
  saveBtn.addEventListener('click', async () => {
    const folder = folderInput.value.trim().replace(/^\/+|\/+$/g, '');
    
    await chrome.storage.local.set({ downloadFolder: folder });
    
    if (folder) {
      showStatus(`✓ Folder set to: Downloads/${folder}`, 'success');
    } else {
      showStatus('✓ Reset to default Downloads folder', 'success');
    }
    
    await loadSettings();
  });

  /**
   * Reset folder to default
   */
  resetBtn.addEventListener('click', async () => {
    folderInput.value = '';
    await chrome.storage.local.set({ downloadFolder: '' });
    
    showStatus('✓ Reset to default Downloads folder', 'success');
    await loadSettings();
  });

  /**
   * Reset download counter
   */
  resetCounterBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset the download counter?')) {
      await chrome.storage.local.set({ downloadCounter: 0 });
      showStatus('✓ Counter reset to 0', 'success');
      await loadSettings();
    }
  });

  // Initial load
  await loadSettings();
});
