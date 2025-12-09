/**
 * Soura Popup Script
 * Handles folder selection and download counter display
 */

document.addEventListener('DOMContentLoaded', async () => {
  const currentFolderEl = document.getElementById('current-folder');
  const changeFolderBtn = document.getElementById('change-folder-btn');
  const downloadCountEl = document.getElementById('download-count');

  /**
   * Load and display current settings
   */
  async function loadSettings() {
    const settings = await chrome.storage.local.get(['downloadFolder', 'downloadCounter']);
    
    const folder = settings.downloadFolder || '';
    const count = settings.downloadCounter || 0;

    currentFolderEl.textContent = folder ? `Downloads/${folder}` : 'Downloads/';
    downloadCountEl.textContent = count;
  }

  /**
   * Change download folder
   */
  changeFolderBtn.addEventListener('click', async () => {
    const currentFolder = await chrome.storage.local.get(['downloadFolder']);
    const current = currentFolder.downloadFolder || '';

    const newFolder = prompt(
      'Enter folder name (relative to Downloads):\n\nExamples:\n  Soura\n  Images/Soura\n  Pictures/Downloaded\n\nLeave empty for default Downloads folder.',
      current
    );

    if (newFolder !== null) {
      const sanitized = newFolder.trim().replace(/^\/+|\/+$/g, '');
      
      await chrome.storage.local.set({ downloadFolder: sanitized });
      
      // Reload display
      await loadSettings();
    }
  });

  // Load initial settings
  await loadSettings();
});
