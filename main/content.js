
let popupInjected = false;
let blurOverlay;
let currentImgSrc = null;

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
      <div class="idp-drop" role="button" aria-label="Drop image here"></div>
    </div>
  `;
  document.body.appendChild(container);

  const dropArea = container.querySelector('.idp-drop');
  const title = container.querySelector('.idp-title');

  function triggerDownload() {
    if (!currentImgSrc) return;
    chrome.runtime.sendMessage({ action: 'download', url: currentImgSrc });
    title.textContent = 'Image downloading...';
    setTimeout(() => {
      removeBlurOverlay();
      removePopup();
    }, 1000);
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
}

function removePopup() {
  const node = document.getElementById('img-drag-popup');
  if (node) node.remove();
  popupInjected = false;
}

document.addEventListener('dragstart', function(e) {
  const t = e.target;
  if (t && t.tagName === 'IMG') {
    currentImgSrc = t.src;
    createBlurOverlay();
    injectPopup();
  }
});

document.addEventListener('dragend', function(e) {
  removeBlurOverlay();
  removePopup();
  currentImgSrc = null;
});
