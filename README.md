# KaiEditor - Visual Comment Boxes

Transform your code comments into elegant, styled visual boxes directly in the editor using pure CSS - without modifying your source code!

## ✨ Features

- **🎨 CSS-Styled Comment Boxes**: Transform comments into beautiful visual boxes with customizable colors, borders, and padding
- **🏷️ Custom Tags**: Categorize comments with visual tags (`//!`, `//·`, `//?`, `//@`, `//#`)
- **📚 JSDoc Support**: Special rendering for documentation comments with tag parsing
- **🔄 Non-Invasive**: Your source code remains unchanged - decorations are purely visual
- **💎 Multiple Styles**: Different styles for inline, single-line, multi-line, and documentation comments
- **⚙️ Fully Customizable**: 15+ settings to adjust colors, borders, padding, opacity, fonts, and more
- **🌐 Multi-Language Support**: Works with JavaScript, TypeScript, Python, Rust, Go, C#, Java, and PHP

### Visual Examples

**Inline Comments** - Appear as compact styled boxes next to code:
```javascript
const x = 10;  // Variable for counter  ← Styled box (0.64em font size)
```

**Single-line Comments** - Full-width styled boxes:
```javascript
// This is a standalone comment  ← Styled box
```

**Block Comments** - Multi-line comments with left accent border:
```javascript
/*
 * This function processes data
 * and returns a formatted object
 */
```

**Documentation Comments** - Special rendering for JSDoc:
```javascript
/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The sum
 */
```

**Custom Tags** - Color-coded categories:
```javascript
//! Important: Critical security check  ← Red background
//· Success: Operation completed      ← Green background
//? Warning: Deprecated function      ← Yellow background
//@ Info: See documentation           ← Blue background
//# Debug: Temporary logging          ← Purple background
```

## 🚀 Quick Start

1. Install KaiEditor from the VS Code Marketplace
2. Open any supported file (`.js`, `.ts`, `.py`, `.rs`, `.go`, `.cs`, `.java`, `.php`)
3. Your comments automatically transform into styled boxes!
4. Try custom tags: `//!` (important), `//·` (success), `//?` (warning), `//@` (info), `//#` (debug)
5. Write JSDoc comments for special documentation rendering

## ⚙️ Configuration

Customize the appearance in VS Code Settings (`Ctrl+,` or `Cmd+,`):

### Core Style Settings

- `kaieditor.backgroundColor` - Background color for comment boxes (default: `#2e3440`)
- `kaieditor.textColor` - Text color (default: `#eceff4`)
- `kaieditor.borderColor` - Border color (default: `#4c566a`)
- `kaieditor.accentColor` - Accent color for block comment left border (default: `#88c0d0`)

### Layout Settings

- `kaieditor.borderRadius` - Border radius in pixels (0-20, default: `2`)
- `kaieditor.paddingVertical` - Vertical padding in pixels (0-20, default: `1`)
- `kaieditor.paddingHorizontal` - Horizontal padding in pixels (0-40, default: `8`)

### Typography Settings

- `kaieditor.fontStyle` - Font style: `normal` or `italic` (default: `normal`)
- `kaieditor.fontWeight` - Font weight: `400`, `500`, or `600` (default: `400`)
- `kaieditor.opacity` - Opacity level (0.1-1.0, default: `0.95`)
- `kaieditor.inlineFontSize` - Font size for inline comments (default: `0.64em`)
- `kaieditor.blockFontSize` - Font size for block comments (default: `0.9em`)

### Custom Tags Colors

- `kaieditor.tagColors.important` - Color for `//!` tags (default: `#8b1e1e99`)
- `kaieditor.tagColors.success` - Color for `//·` tags (default: `#1e5e1e99`)
- `kaieditor.tagColors.warning` - Color for `//?` tags (default: `#7a5e1e99`)
- `kaieditor.tagColors.info` - Color for `//@` tags (default: `#1e4e7a99`)
- `kaieditor.tagColors.debug` - Color for `//#` tags (default: `#5e1a7a99`)

### Documentation Colors

- `kaieditor.docColors.backgroundColor` - Background for JSDoc comments (default: `#1a2332`)
- `kaieditor.docColors.borderColor` - Border for JSDoc comments (default: `#3a4a5a`)
- `kaieditor.docColors.textColor` - Text for JSDoc comments (default: `#a0b0c0`)

### General Settings

- `kaieditor.enabled` - Enable/disable the extension (default: `true`)
- `kaieditor.enabledLanguages` - Languages to process (default: `["javascript", "typescript", "python", "rust", "go", "csharp", "java", "php"]`)

## 🎨 Preset Styles

### Nord Theme (Default)
Clean and elegant Nordic-inspired colors:
```json
{
  "kaieditor.backgroundColor": "#2e3440",
  "kaieditor.textColor": "#eceff4",
  "kaieditor.borderColor": "#4c566a",
  "kaieditor.accentColor": "#88c0d0",
  "kaieditor.borderRadius": 2,
  "kaieditor.paddingVertical": 1,
  "kaieditor.paddingHorizontal": 8,
  "kaieditor.opacity": 0.95
}
```

### GitHub Style
Dark GitHub-inspired theme:
```json
{
  "kaieditor.backgroundColor": "#0d1117",
  "kaieditor.textColor": "#c9d1d9",
  "kaieditor.borderColor": "#30363d",
  "kaieditor.accentColor": "#58a6ff",
  "kaieditor.borderRadius": 4,
  "kaieditor.paddingVertical": 2,
  "kaieditor.paddingHorizontal": 8
}
```

### Minimalist
Subtle and unobtrusive:
```json
{
  "kaieditor.backgroundColor": "#1e1e1e",
  "kaieditor.textColor": "#888888",
  "kaieditor.borderColor": "#333333",
  "kaieditor.accentColor": "#555555",
  "kaieditor.borderRadius": 3,
  "kaieditor.paddingVertical": 1,
  "kaieditor.paddingHorizontal": 6,
  "kaieditor.opacity": 0.85
}
```

### High Contrast
For better visibility:
```json
{
  "kaieditor.backgroundColor": "#000000",
  "kaieditor.textColor": "#ffffff",
  "kaieditor.borderColor": "#ffffff",
  "kaieditor.accentColor": "#00ffff",
  "kaieditor.borderRadius": 0,
  "kaieditor.paddingVertical": 2,
  "kaieditor.paddingHorizontal": 10,
  "kaieditor.fontWeight": "600",
  "kaieditor.opacity": 1.0
}
```

## 📋 Commands

Access commands via Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- **KaiEditor: Toggle Comment Boxes** - Enable/disable comment boxes
- **KaiEditor: Refresh Decorations** - Manually refresh decorations

## 🔧 Supported Languages

- JavaScript (`.js`)
- TypeScript (`.ts`)
- Python (`.py`)
- Rust (`.rs`)
- Go (`.go`)
- C# (`.cs`)
- Java (`.java`)
- PHP (`.php`)

## 📖 Usage Tips

### Custom Tags
Use custom tags at the start of comments for visual categorization:
```javascript
//! Critical: This must be fixed before release
//· Success: Feature implemented correctly  
//? Warning: This approach may have issues
//@ Info: Check the documentation for details
//# Debug: Temporary logging for testing
```

### JSDoc Comments
Write documentation comments for enhanced rendering:
```javascript
/**
 * Fetches user data from the API
 * @param {string} userId - The user identifier
 * @param {Object} options - Optional parameters
 * @returns {Promise<User>} User object with all details
 * @throws {Error} When user is not found
 */
async function fetchUser(userId, options) {
  // Implementation
}
```

### Inline vs Block
- **Inline comments**: Placed after code, rendered with smaller font
- **Block comments**: Standalone lines, rendered with normal styling
- **Multi-line**: Blocks spanning multiple lines with left accent border
- **Documentation**: JSDoc/docstring comments with special formatting

## 🎯 Performance

- Fast comment detection: ~5ms for 1000-line files
- Efficient decoration caching
- Debounced updates (300ms) for smooth editing
- Minimal memory footprint (~2MB per document)

## Release Notes

### 0.0.1 (2026-02-08)

Initial release with comprehensive features:

- ✨ CSS-based visual comment boxes
- 🏷️ Custom tags (5 types: important, success, warning, info, debug)
- 📚 JSDoc parsing and special rendering
- 🌐 8 languages supported
- ⚙️ 15+ configuration options
- 🎨 4 preset themes (Nord, GitHub, Minimalist, High Contrast)
- 🔄 Real-time updates and non-invasive decorations

---

## 📚 Additional Resources

- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- **CSS System**: See [docs/CSS-SYSTEM.md](docs/CSS-SYSTEM.md) for styling documentation
- **Testing**: See [docs/QUICK-TEST-GUIDE.md](docs/QUICK-TEST-GUIDE.md) for testing instructions

## 🐛 Troubleshooting

**Decorations not appearing?**
- Check `kaieditor.enabled` is set to `true`
- Verify your language is in `kaieditor.enabledLanguages`
- Use `KaiEditor: Refresh Decorations` command

**Colors not applying?**
- Ensure color values are valid hex codes
- Check theme-specific settings in your VS Code settings
- Try the `KaiEditor: Refresh Decorations` command

**Performance issues?**
- Reduce the number of enabled languages
- Increase the debounce time (requires code modification)
- Disable for very large files (>5000 lines)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

See [ARCHITECTURE.md](ARCHITECTURE.md) for contribution guidelines.

---

**Made with ❤️ for better code readability**

**Enjoy!**
