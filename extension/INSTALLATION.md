# Soura Installation Guide

## Quick Start (3 Easy Steps)

### Step 1: Prepare the Extension

You already have the extension files in the `/extension` folder. No need to download anything!

### Step 2: Load in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle switch in the top-right corner)
4. Click **"Load unpacked"** button
5. Navigate to and select the `/extension` folder from this project
6. Click **"Select Folder"**

### Step 3: Configure (First Time)

The settings page will open automatically. Here you can:

- Choose your download folder (optional)
- See usage instructions
- View download statistics

That's it! You're ready to use Soura.

---

## Using Soura

### Download an Image

1. Visit any website (e.g., Google Images, Instagram, Pinterest)
2. Find an image you want to download
3. Click and drag the image toward the **bottom center** of the screen
4. A beautiful floating dock will slide up
5. Drop the image on the dock
6. Watch the success animation - your image is downloaded!

### Tips

- **Quick Downloads**: Just drag and drop - no menus or dialogs
- **Organized Storage**: Images are named `soura_img_001.jpg`, `soura_img_002.png`, etc.
- **Custom Folder**: Click the extension icon to change your download folder
- **Dark Mode**: Soura automatically matches your system theme

---

## Customization

### Change Download Folder

**Method 1: From Extension Icon**
1. Click the Soura icon in the toolbar
2. Click "Change Folder"
3. Enter a folder name (e.g., `Soura`, `Images/Downloaded`)
4. Images will save to `Downloads/YourFolder/`

**Method 2: From Settings Page**
1. Right-click the Soura icon → Click "Options"
2. Or click "Settings" in the popup
3. Enter your preferred folder path
4. Click "Save Settings"

### Reset Counter

To reset the auto-incrementing counter:

1. Open Settings (right-click icon → Options)
2. Scroll to Statistics section
3. Click "Reset Counter"

---

## Troubleshooting

### Dock Not Appearing?

- ✅ Make sure you're on a regular webpage (not chrome:// pages)
- ✅ Verify the extension is enabled in `chrome://extensions/`
- ✅ Refresh the page after installing/updating
- ✅ Check that you're dragging an actual image element

### Downloads Not Working?

- ✅ Check Chrome's download permission
- ✅ Verify your folder path doesn't have special characters
- ✅ Make sure Chrome's download location is accessible
- ✅ Check if the image source is accessible (not blocked by CORS)

### Animations Choppy?

- ✅ Close unnecessary tabs to free up memory
- ✅ Update Chrome to the latest version
- ✅ Check if "Reduce motion" is enabled in your OS

### Extension Not Loading?

- ✅ Make sure all files are present in the `/extension` folder
- ✅ Check that manifest.json is valid
- ✅ Look for errors in `chrome://extensions/` (click "Errors" button)
- ✅ Try removing and re-adding the extension

---

## Updating Soura

When a new version is available:

1. Download/pull the latest code
2. Go to `chrome://extensions/`
3. Click the **refresh icon** on the Soura extension card
4. Your settings will be preserved

---

## Uninstalling

To remove Soura:

1. Go to `chrome://extensions/`
2. Find Soura in the list
3. Click **"Remove"**
4. Confirm the removal

Note: Your downloaded images will remain in your Downloads folder.

---

## Supported Browsers

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Brave Browser
- ✅ Any Chromium-based browser with Manifest V3 support

---

## Privacy & Permissions

Soura requests minimal permissions:

- **downloads**: To save images to your Downloads folder
- **storage**: To remember your folder preference and counter
- **<all_urls>**: To inject the floating dock on all websites

**We do NOT:**
- ❌ Collect any personal data
- ❌ Track your browsing
- ❌ Send data to external servers
- ❌ Show ads or analytics

Everything runs 100% locally on your machine.

---

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🐛 Report issues on [GitHub Issues](https://github.com/Syrthax/soura/issues)
- 💬 Ask questions in [Discussions](https://github.com/Syrthax/soura/discussions)

---

**Enjoy downloading images with style! ✨**
