# Soura Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          SOURA EXTENSION                             │
│                    Drag & Drop Image Downloader                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        MANIFEST.JSON                                 │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  • Extension Config (Manifest V3)                          │    │
│  │  • Permissions: downloads, storage, <all_urls>             │    │
│  │  • Defines: service worker, content scripts, popup         │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
        
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   CONTENT    │  │  BACKGROUND  │  │    POPUP     │
│   SCRIPT     │  │   SERVICE    │  │      UI      │
│              │  │   WORKER     │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    1. CONTENT SCRIPT LAYER                           │
│                    (Injected into all webpages)                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  content.js (281 lines)                                     │    │
│  │  ───────────────────────────                                │    │
│  │  • Detects drag on <img> elements                          │    │
│  │  • Injects floating dock into page                         │    │
│  │  • Shows dock when dragging starts                         │    │
│  │  • Handles drop events                                     │    │
│  │  • Sends download request to background                    │    │
│  │  • Shows success/error animations                          │    │
│  │                                                             │    │
│  │  content.css (206 lines)                                    │    │
│  │  ────────────────────────                                   │    │
│  │  • Liquid glass frosted effect                             │    │
│  │  • Smooth animations (slide, pulse, success, error)        │    │
│  │  • Dark mode support                                       │    │
│  │  • GPU-accelerated transforms                              │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ chrome.runtime.sendMessage()
                                  │ { action: 'downloadImage', url }
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   2. BACKGROUND SERVICE WORKER                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  background.js (116 lines)                                  │    │
│  │  ──────────────────────                                     │    │
│  │  • Receives download requests                              │    │
│  │  • Manages download counter                                │    │
│  │  • Generates filenames (soura_img_001.jpg, etc.)           │    │
│  │  • Detects file extensions                                 │    │
│  │  • Calls chrome.downloads.download()                       │    │
│  │  • Stores counter in chrome.storage                        │    │
│  │  • Opens settings page on first install                    │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │                           │
                    ▼                           ▼
        
        chrome.downloads.download()    chrome.storage.local
                    │                           │
                    │                           │
                    ▼                           ▼
                                  
            User's Downloads/           Extension Storage
                Folder/                 ─────────────────
                  │                     • downloadFolder
                  │                     • downloadCounter
                  ▼
            
        soura_img_001.jpg
        soura_img_002.png
        soura_img_003.webp

┌─────────────────────────────────────────────────────────────────────┐
│                      3. USER INTERFACE LAYER                         │
│                                                                       │
│  ┌─────────────────────────┐  ┌────────────────────────────┐       │
│  │    POPUP (Quick View)    │  │   OPTIONS (Full Settings)   │       │
│  │  ───────────────────────  │  │  ──────────────────────────  │       │
│  │  popup.html (47 lines)   │  │  options.html (72 lines)    │       │
│  │  popup.js   (41 lines)   │  │  options.js   (69 lines)    │       │
│  │  popup.css  (219 lines)  │  │  options.css  (377 lines)   │       │
│  │                          │  │                             │       │
│  │  Shows:                  │  │  Shows:                     │       │
│  │  • Current folder        │  │  • Welcome screen           │       │
│  │  • Download count        │  │  • Usage instructions       │       │
│  │  • Change folder button  │  │  • Folder configuration     │       │
│  │                          │  │  • Download statistics      │       │
│  │  Access:                 │  │  • Counter reset            │       │
│  │  Click extension icon    │  │                             │       │
│  │                          │  │  Access:                    │       │
│  │                          │  │  Right-click icon → Options │       │
│  └─────────────────────────┘  │  First install (auto-opens) │       │
│                                └────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION FLOW                           │
│                                                                       │
│  1. User drags image                                                 │
│       ↓                                                              │
│  2. content.js detects dragstart                                     │
│       ↓                                                              │
│  3. Dock slides up from bottom (smooth animation)                    │
│       ↓                                                              │
│  4. User drops image on dock                                         │
│       ↓                                                              │
│  5. content.js sends message to background.js                        │
│       ↓                                                              │
│  6. background.js generates filename & initiates download            │
│       ↓                                                              │
│  7. Success animation plays (checkmark)                              │
│       ↓                                                              │
│  8. Dock fades out                                                   │
│       ↓                                                              │
│  9. Image saved to Downloads/Folder/soura_img_XXX.ext               │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      KEY TECHNOLOGIES                                │
│                                                                       │
│  • Chrome Extensions Manifest V3                                     │
│  • Service Workers (background processing)                           │
│  • Content Scripts (page injection)                                  │
│  • Chrome Downloads API                                              │
│  • Chrome Storage API                                                │
│  • Message Passing (runtime.sendMessage)                             │
│  • CSS Animations & Transforms                                       │
│  • Backdrop Filter (frosted glass)                                   │
│  • Media Queries (dark mode detection)                               │
│  • Drag & Drop Events API                                            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       DESIGN PRINCIPLES                              │
│                                                                       │
│  • Apple-inspired aesthetic (liquid glass, smooth animations)        │
│  • Gesture-based interaction (no clicks required)                    │
│  • Immediate visual feedback (animations & state changes)            │
│  • Dark mode support (system preference aware)                       │
│  • Minimal UI (floating dock only appears when needed)               │
│  • Clean code (well-commented, modular architecture)                 │
│  • Privacy-first (100% local, no tracking)                           │
│  • Accessibility (reduced motion support)                            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## File Dependencies

```
manifest.json
    ├── background.js (service_worker)
    ├── content.js + content.css (content_scripts)
    ├── popup.html → popup.js + popup.css (action.default_popup)
    └── options.html → options.js + options.css (opened on install)

Icons:
    ├── icon16.png  (toolbar)
    ├── icon32.png  (various UI)
    ├── icon48.png  (extension management)
    └── icon128.png (Chrome Web Store)
```

## Data Flow

```
User Action (Drag Image)
    ↓
Content Script (Detect & Display Dock)
    ↓
Drop Event (Extract Image URL)
    ↓
Message to Background (downloadImage request)
    ↓
Background Worker (Generate filename, check storage)
    ↓
Chrome Downloads API (Download file)
    ↓
Update Storage (Increment counter)
    ↓
Response to Content Script (Success/Fail)
    ↓
Animation Feedback (Checkmark/Error)
    ↓
User's Downloads Folder (Image saved)
```

---

**Total Files:** 10 core files + 4 icons + 4 documentation files = 18 files
**Total Lines:** ~1,573 lines of code + comprehensive documentation
**Build Time:** Complete rebuild from scratch
**Version:** 2.0.0
