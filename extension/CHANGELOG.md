# Soura — Changelog

## 1.2.1 — Weekly polish (2025-09-01)

### New (1.2.1)

- Keyboard support for the drop zone: focusable, Enter/Space to trigger download, Esc to cancel.
- Inline error toast for quick feedback when a download can’t start.

### Improvements (1.2.1)

- Smarter filename/extension detection using response headers (Content-Disposition/Content-Type) with a quick HEAD/GET probe and query-string hints; better fallbacks for data: URLs.
- More reliable source picking before download: prefer currentSrc/srcset or a wrapping anchor href; use blob→canvas only when necessary.
- Clearer user feedback: notifications on start/failure and a brief toolbar badge on install/update.
- Options/settings polish: prompt-based folder picker with immediate save, “Test download” button, clearer hints; options open in a dedicated tab.

### Fixes (1.2.1)

- Safer storage access with graceful fallbacks when unavailable.
- Better handling of sleeping service workers and clearer popup errors.

### Known issues (1.2.1)

- Some cross-origin images or blob: URLs may still save with a generic extension when headers are unavailable. Workarounds: open image in a new tab to obtain a direct URL, or rename the file with the correct extension (e.g., .png/.jpg).

## 1.2 — Major upgrade (2025-08-23)

### New

- Settings popup now focuses on choosing the download folder (relative to Downloads).
- Added "Choose folder" (prompt-based) that saves immediately with visual feedback.
- Added "Test download" to verify setup with a tiny sample image.
- Added Options page for a larger settings view (chrome options_ui).
- Added toolbar/action and extension icons; renamed extension to "Soura".

### Improvements

- Default behavior downloads to the standard Downloads folder when no custom folder is set.
- Better filename/folder sanitization to avoid invalid characters.
- Clear success/failure responses and user notifications for downloads.
- Content script prefers real image URLs (currentSrc/srcset/anchor) before blob-to-canvas fallback.
- One-time "What's New" banner remains, with safer storage and UI.

### Fixes

- Prevent crashes when storage is momentarily unavailable; graceful fallbacks.
- Popup width and readability improved for Chrome toolbar constraints.

### Known issues

- In some cases, downloaded images may be saved without the correct extension (appearing as an "unknown" file), especially when the source is a blob: URL or lacks a clear content type. We're investigating a robust cross-site fix. Temporary workarounds: open the image in a new tab to get a direct http(s) URL before downloading, or manually rename the file with the correct extension (e.g., .png or .jpg).

## 1.1 — Weekly update (2025-08-23)

- Bumped extension version to 1.1
- Added a one-time "What's new" banner shown in-page after the update
- Added a temporary browser action badge on install/update to highlight the new release
- Minor UX tweaks and stability improvements

## 1.0 — Initial release

- Image drag & download with blur overlay and in-page popup
