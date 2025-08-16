
const urlParams = new URLSearchParams(window.location.search);
const imgSrc = urlParams.get('img');

const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.style.background = '#e0ffe0';
});
dropArea.addEventListener('dragleave', (e) => {
  dropArea.style.background = '#f9f9f9';
});
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.style.background = '#f9f9f9';
  if (imgSrc) {
    chrome.runtime.sendMessage({ action: 'download', url: imgSrc });
    document.body.innerHTML = '<h4>Image downloading...</h4>';
    setTimeout(() => window.parent.postMessage('closePopup', '*'), 1200);
  }
});


dropArea.addEventListener('click', () => {
  if (imgSrc) {
    chrome.runtime.sendMessage({ action: 'download', url: imgSrc });
    document.body.innerHTML = '<h4>Image downloading...</h4>';
    setTimeout(() => window.parent.postMessage('closePopup', '*'), 1200);
  }
});
