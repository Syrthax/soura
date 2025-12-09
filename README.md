# Soura — Drag & Drop Image Downloader (Chrome Extension)

Download images faster: drag any image and drop it on the bottom‑right popup to save it instantly.

## Demo

https://github.com/user-attachments/assets/Screen%20Recording%202025-12-09%20at%2012.03.35.mov

![Soura demo](/assets/demo.mov)

## Features

- Drag an image anywhere on the web, a bottom‑right drop zone appears.
- Drop (or click) to download via Chrome’s Downloads API.
- Subtle page blur while dragging to focus on the drop zone.
- Works across most sites; no right‑click menus needed.

## Installation (from source)

1. Download or clone this repository.
2. Open Chrome and go to: chrome://extensions
3. Turn on “Developer mode” (top‑right).
4. Click “Load unpacked” and select the `chrome-extension/` folder.

Notes:
- If you have the packaged `Soura Alpha v0.0.1.zip`, extract it first and then load the extracted `chrome-extension/` folder.
- Tested with Manifest V3 on Chrome.

## Usage

- On any webpage, click and start dragging an image.
- The page will blur and a popup appears at the bottom‑right.
- Drop the dragged image onto the popup (or just click the popup) to trigger a download.
- When you stop dragging, the overlay and popup dismiss automatically.

## How it works

- A content script (`content.js`) listens for `dragstart` on `<img>` elements, shows a blur overlay and injects a small drop‑zone UI.
- On drop/click, it sends a message to the background service worker (`background.js`).
- The background uses `chrome.downloads.download({ url })` to save the image.
- Styles for the injected UI live in `content.css`. The extension is declared in `manifest.json` (Manifest V3).

## Permissions

- downloads: required to save files to your system.
- host_permissions: `<all_urls>` so the content script can run on most pages with images.
- scripting: reserved for potential programmatic injections/updates.

## Limitations

- Images without a direct URL (e.g., canvas/`blob:`/data URIs created at runtime) may not download.
- Files are saved with the server‑provided filename; custom naming isn’t implemented yet.
- Some sites may intercept drags or overlay the UI in ways that prevent dropping.

## Troubleshooting

- Nothing happens on drop:
  - Ensure the extension is enabled in chrome://extensions.
  - Try disabling other extensions that alter drag/drop behavior.
- Downloaded file has a generic name: this comes from the source server’s headers; custom naming is a planned enhancement.

## Development

Project layout:

- `chrome-extension/`
  - `manifest.json` — MV3 manifest and permissions
  - `background.js` — handles the actual download via `chrome.downloads`
  - `content.js` — injects the popup and forwards the image URL
  - `content.css` — styles for the injected popup
  - `popup.*` — experimental drop UI (web‑accessible); current flow uses the injected UI
- `website/` — project website and assets

Iterate locally:

1. Make changes in `chrome-extension/`.
2. In chrome://extensions, click “Reload” on Soura.
3. Refresh your target page and test.

## Roadmap

- Custom filenames and a simple naming template.
- Option to choose a target subfolder.
- Progress/complete feedback in the popup.
- Optional right‑click context menu: “Download image with Soura”.
- Support for more complex image sources (e.g., `blob:` via fetch fallbacks where possible).

## Credits

Built by @syrthax. Contributions and feedback welcome.
