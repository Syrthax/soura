/**
 * Soura Content Script
 * Handles drag detection and floating dock UI injection
 */

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.souraInitialized) return;
  window.souraInitialized = true;

  // State management
  let isDragging = false;
  let draggedImage = null;
  let dock = null;
  let dropZone = null;
  let blurOverlay = null;

  /**
   * Initialize the floating dock UI
   */
  function initializeDock() {
    // Create blur overlay
    blurOverlay = document.createElement('div');
    blurOverlay.id = 'soura-blur-overlay';
    blurOverlay.className = 'soura-overlay-hidden';
    document.body.appendChild(blurOverlay);
    
    // Create dock container
    dock = document.createElement('div');
    dock.id = 'soura-dock';
    dock.className = 'soura-hidden';
    
    // Create drop zone pill
    dropZone = document.createElement('div');
    dropZone.id = 'soura-drop-zone';
    dropZone.innerHTML = `
      <svg class="soura-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="soura-text">Drop to Download</span>
    `;
    
    dock.appendChild(dropZone);
    document.body.appendChild(dock);

    // Set up drop zone event listeners
    setupDropZoneListeners();
  }

  /**
   * Set up event listeners for the drop zone
   */
  function setupDropZoneListeners() {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('soura-hover');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('soura-hover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDrop(e);
    });
  }

  /**
   * Handle image drop on the dock
   */
  async function handleDrop(e) {
    dropZone.classList.remove('soura-hover');
    dropZone.classList.add('soura-downloading');

    // Get image URL
    let imageUrl = null;
    
    if (draggedImage) {
      imageUrl = draggedImage.src || draggedImage.currentSrc;
    }

    if (!imageUrl && e.dataTransfer) {
      const urlData = e.dataTransfer.getData('text/uri-list') || 
                      e.dataTransfer.getData('text/plain');
      if (urlData && urlData.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        imageUrl = urlData;
      }
    }

    if (imageUrl) {
      try {
        // Send download request to background script
        const response = await chrome.runtime.sendMessage({
          action: 'downloadImage',
          url: imageUrl
        });

        if (response && response.success) {
          showSuccessAnimation();
        } else {
          showErrorAnimation();
        }
      } catch (error) {
        console.error('Soura: Download failed', error);
        showErrorAnimation();
      }
    } else {
      showErrorAnimation();
    }

    // Reset after animation
    setTimeout(() => {
      hideDock();
      resetDockState();
      draggedImage = null;
    }, 1500);
  }

  /**
   * Show success animation
   */
  function showSuccessAnimation() {
    dropZone.classList.remove('soura-downloading');
    dropZone.classList.add('soura-success');
    
    dropZone.innerHTML = `
      <svg class="soura-icon soura-checkmark" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="soura-text">Downloaded!</span>
    `;
  }

  /**
   * Show error animation
   */
  function showErrorAnimation() {
    dropZone.classList.remove('soura-downloading');
    dropZone.classList.add('soura-error');
    
    dropZone.innerHTML = `
      <svg class="soura-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="soura-text">Failed</span>
    `;
  }

  /**
   * Reset dock to initial state
   */
  function resetDockState() {
    dropZone.className = '';
    dropZone.innerHTML = `
      <svg class="soura-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="soura-text">Drop to Download</span>
    `;
  }

  /**
   * Show the dock with animation
   */
  function showDock() {
    if (blurOverlay) {
      blurOverlay.classList.remove('soura-overlay-hidden');
      blurOverlay.classList.add('soura-overlay-visible');
    }
    if (dock) {
      dock.classList.remove('soura-hidden');
      dock.classList.add('soura-visible');
    }
  }

  /**
   * Hide the dock with animation
   */
  function hideDock() {
    if (blurOverlay) {
      blurOverlay.classList.remove('soura-overlay-visible');
      blurOverlay.classList.add('soura-overlay-hidden');
    }
    if (dock) {
      dock.classList.remove('soura-visible');
      dock.classList.add('soura-hidden');
    }
  }

  /**
   * Check if element is an image
   */
  function isImage(element) {
    if (!element) return false;
    
    // Direct img tag
    if (element.tagName === 'IMG') return true;
    
    // Background image
    if (element.style && element.style.backgroundImage) {
      return element.style.backgroundImage.includes('url(');
    }
    
    // SVG
    if (element.tagName === 'SVG') return true;
    
    return false;
  }

  /**
   * Extract image URL from element
   */
  function getImageUrl(element) {
    if (element.tagName === 'IMG') {
      return element.src || element.currentSrc;
    }
    
    if (element.style && element.style.backgroundImage) {
      const match = element.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      return match ? match[1] : null;
    }
    
    return null;
  }

  /**
   * Set up global drag listeners
   */
  function setupDragListeners() {
    document.addEventListener('dragstart', (e) => {
      const target = e.target;
      
      if (isImage(target)) {
        isDragging = true;
        draggedImage = target;
        showDock();
        
        // Allow drag
        e.dataTransfer.effectAllowed = 'copy';
        
        // Add image URL to dataTransfer
        const imageUrl = getImageUrl(target);
        if (imageUrl) {
          e.dataTransfer.setData('text/uri-list', imageUrl);
          e.dataTransfer.setData('text/plain', imageUrl);
        }
      }
    }, true);

    document.addEventListener('dragend', (e) => {
      if (isDragging) {
        isDragging = false;
        
        // Only hide if not over drop zone
        setTimeout(() => {
          if (!dropZone.classList.contains('soura-hover') && 
              !dropZone.classList.contains('soura-downloading')) {
            hideDock();
            draggedImage = null;
          }
        }, 100);
      }
    }, true);

    // Prevent default drag behavior on document
    document.addEventListener('dragover', (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    }, true);
  }

  /**
   * Initialize the extension
   */
  function init() {
    initializeDock();
    setupDragListeners();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
