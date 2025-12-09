# Soura — Changelog

## 2.0.0 — Complete Rebuild: New Generation (2025-12-09)

### 🎉 Complete Rebuild

This is a complete rebuild of Soura with a focus on beautiful, fluid user experience inspired by Apple's design philosophy.

#### ✨ Added

- **Floating Dock UI**: Beautiful pill-shaped dock that slides up from the bottom when dragging images
- **Liquid Glass Effect**: Frosted glass backdrop with beautiful blur and translucency
- **Smooth Animations**: 
  - Slide-up animation when drag starts
  - Pulse animation on hover
  - Compress/expand animation on drop
  - Checkmark animation on success
  - Shake animation on error
  - Fade-out after completion
- **Dark Mode Support**: Full automatic dark/light mode based on system preferences
- **Auto-incrementing Filenames**: Files named `soura_img_001.jpg`, `soura_img_002.png`, etc.
- **Download Statistics**: Track total number of downloaded images
- **Modern Popup UI**: Clean, minimal design with folder display and statistics
- **Beautiful Settings Page**: Full onboarding experience with usage instructions
- **Reduced Motion Support**: Respects accessibility preferences

#### 🎨 UI/UX Improvements

- Removed blur overlay - cleaner, less intrusive
- Gesture-based interaction - no clicks required
- Apple-inspired typography and spacing
- Smooth GPU-accelerated animations
- Beautiful color gradients and shadows
- Responsive hover and active states

#### 🔧 Technical Improvements

- Manifest V3 compliance
- Modular code architecture
- Clean, well-commented codebase
- Better error handling
- Improved drag detection
- Optimized performance
- No external dependencies

#### 🗑️ Removed

- Old blur overlay system
- Click-to-download popup
- What's new banner
- Notification system (now using visual feedback only)

---

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
