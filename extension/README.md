# Soura - Drag & Drop Image Downloader

<div align="center">

![Soura Logo](icons/icon128.png)

**Download images with a simple drag gesture**

Beautiful • Fluid • Effortless

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/Syrthax/soura)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## ✨ Features

- **🎯 Drag & Drop**: Simply drag any image toward the bottom of the screen
- **🌊 Liquid Glass UI**: Apple-inspired floating dock with smooth animations
- **🌓 Dark Mode**: Automatically adapts to your system theme
- **📁 Smart Organization**: Auto-incrementing filenames (soura_img_001.jpg, etc.)
- **⚡ Lightning Fast**: No clicks, no menus, just drag and drop
- **🎨 Beautiful Animations**: Smooth transitions and feedback
- **📊 Statistics**: Track your download count
- **🔧 Customizable**: Choose your download folder

---

## 🚀 How to Use

### Installation

1. **Download the extension**
   - Clone this repository or download as ZIP
   - Navigate to the `/extension` folder

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `/extension` folder

3. **First-time Setup**
   - The settings page will open automatically
   - Choose your download folder (optional)
   - You're ready to go!

### Usage

1. **Visit any website** with images
2. **Drag an image** toward the bottom center of the screen
3. **A floating dock appears** with a "Drop to Download" message
4. **Drop the image** on the dock
5. **Watch the magic** - smooth animation confirms your download!

That's it! Your image is saved to your chosen folder.

---

## 🎨 UI Design

Soura features an Apple-inspired design language:

- **Frosted Glass Effect**: Beautiful backdrop blur with translucency
- **Smooth Animations**: GPU-accelerated transforms and transitions
- **Responsive Feedback**: Hover, active, and success states
- **System Integration**: Respects your dark/light mode preference
- **Accessibility**: Reduced motion support for users who prefer it

### Dock States

- **Hidden**: Dock is invisible when not dragging
- **Slide Up**: Smoothly appears when you start dragging an image
- **Hover**: Grows and glows when image is over the drop zone
- **Downloading**: Subtle pulse animation
- **Success**: Green checkmark with scale animation
- **Error**: Red shake animation with error indicator

---

## ⚙️ Configuration

### Download Folder

Set your preferred download location:

1. Click the Soura extension icon
2. Click "Change Folder"
3. Enter a folder name relative to Downloads (e.g., `Soura`, `Images/Soura`)
4. Images will be saved to `Downloads/YourFolder/`

Leave empty to save directly to the Downloads folder.

### File Naming

Files are automatically named with an incrementing counter:

```
soura_img_001.jpg
soura_img_002.png
soura_img_003.webp
```

The extension preserves the original file format (jpg, png, gif, webp, svg, etc.).

---

## 🏗️ Architecture

### Project Structure

```
/extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (download handler)
├── content.js            # Content script (drag detection)
├── content.css           # Dock styles
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── popup.css             # Popup styles
├── options.html          # Settings page
├── options.js            # Settings logic
├── options.css           # Settings styles
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

### How It Works

1. **Content Script** (`content.js`)
   - Injects the floating dock into every webpage
   - Listens for drag events on all images
   - Shows/hides dock based on drag state
   - Sends download requests to background script

2. **Background Service Worker** (`background.js`)
   - Receives download requests from content script
   - Manages download counter
   - Handles file naming with auto-increment
   - Initiates Chrome downloads API

3. **Popup** (`popup.html/js/css`)
   - Displays current settings
   - Shows download statistics
   - Allows quick folder changes

4. **Options Page** (`options.html/js/css`)
   - Full onboarding experience
   - Detailed settings configuration
   - Download statistics and counter reset

### Technologies

- **Pure JavaScript**: No frameworks or dependencies
- **CSS Animations**: Smooth, performant animations
- **Chrome Extensions Manifest V3**: Latest extension platform
- **Web Animations API**: Advanced animation control
- **CSS Custom Properties**: Dynamic theming

---

## 🎯 Supported Image Formats

- JPEG / JPG
- PNG
- GIF
- WebP
- SVG
- BMP
- AVIF

---

## 🐛 Troubleshooting

### Dock not appearing?

- Make sure you're dragging an actual `<img>` element
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the page

### Downloads not working?

- Check Chrome's download permissions
- Verify the download folder path in settings
- Look for error messages in the dock animation

### Animations stuttering?

- Check if "Reduce motion" is enabled in your OS settings
- Close unnecessary tabs to free up resources

---

## 🔒 Privacy

Soura is completely privacy-focused:

- ✅ **No data collection**: We don't track or collect any data
- ✅ **No external requests**: Everything runs locally
- ✅ **No analytics**: Zero tracking scripts
- ✅ **Open source**: Full transparency

The extension only accesses:
- `downloads`: To save images
- `storage`: To remember your folder preference

---

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Syrthax/soura.git

# Navigate to extension folder
cd soura/extension

# Load in Chrome (chrome://extensions/)
# Enable Developer mode → Load unpacked → Select this folder
```

### Making Changes

1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Soura extension
4. Test your changes

### Code Style

- ES6+ JavaScript
- Clean, commented code
- Modular architecture
- Apple-inspired design principles

---

## 📝 Changelog

### Version 2.0.0 (Current)

- ✨ Complete rebuild with Apple-inspired UI
- 🌊 Liquid glass floating dock design
- 🎨 Beautiful animations and transitions
- 🌓 Full dark mode support
- 📊 Download statistics tracking
- 📁 Custom folder organization
- ⚡ Improved performance
- 🎯 Better drag detection
- 🔧 Simplified settings

### Version 1.x

- Basic drag and drop functionality
- Blur overlay UI
- Simple download handling

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👏 Credits

Created with ♥ by the Soura Team

Inspired by Apple's design philosophy and macOS Sonoma's liquid glass aesthetic.

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/Syrthax/soura/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Syrthax/soura/discussions)

---

<div align="center">

**Made with ♥ for everyone who loves beautiful, functional design**

⭐ Star this repo if you find it useful!

</div>
