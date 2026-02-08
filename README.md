# KaiEditor - Visual Comment Boxes

Transform your code comments into elegant, styled visual boxes directly in the editor using pure CSS - without modifying your source code!

## ✨ Features

- **🎨 CSS-Styled Comment Boxes**: Transforms comments into beautiful visual boxes with customizable colors, borders, and padding
- **🔄 Non-Invasive**: Your source code remains unchanged - decorations are purely visual
- **💎 Multiple Styles**: Different styles for inline, single-line, and multi-line comments
- **⚙️ Fully Customizable**: Adjust colors, borders, padding, opacity, fonts, and more
- **🌐 Multi-Language Support**: Works with JavaScript, TypeScript, Python, Rust, and Go

### Visual Examples

**Inline Comments** - Appear as styled boxes next to code:
```javascript
const x = 10;  // Variable for counter  ← Styled box
```

**Block Comments** - Multi-line comments with accent border:
```javascript
/*
 * This function processes data
 * and returns a formatted object
 */
```

## 🚀 Quick Start

1. Install KaiEditor
2. Open any supported file (`.js`, `.ts`, `.py`, `.rs`, `.go`)
3. Your comments automatically transform into styled boxes!

## ⚙️ Configuration

Customize the appearance in VS Code Settings (`Ctrl+,` or `Cmd+,`):

### Core Style Settings

- `kaieditor.backgroundColor` - Background color for comment boxes (default: `#2e3440`)
- `kaieditor.textColor` - Text color (default: `#eceff4`)
- `kaieditor.borderColor` - Border color (default: `#4c566a`)
- `kaieditor.accentColor` - Accent color for block comment left border (default: `#88c0d0`)

### Layout Settings

- `kaieditor.borderRadius` - Border radius in pixels (0-20, default: `6`)
- `kaieditor.paddingVertical` - Vertical padding in pixels (0-20, default: `3`)
- `kaieditor.paddingHorizontal` - Horizontal padding in pixels (0-40, default: `10`)

### Typography Settings

- `kaieditor.fontStyle` - Font style: `normal` or `italic` (default: `normal`)
- `kaieditor.fontWeight` - Font weight: `400`, `500`, or `600` (default: `400`)
- `kaieditor.opacity` - Opacity level (0.1-1.0, default: `0.95`)

### General Settings

- `kaieditor.enabled` - Enable/disable the extension (default: `true`)
- `kaieditor.enabledLanguages` - Languages to process (default: `["javascript", "typescript", "python", "rust", "go"]`)

## 🎨 Preset Styles

### Nord Theme (Default)
```json
{
  "kaieditor.backgroundColor": "#3b4252",
  "kaieditor.textColor": "#eceff4",
  "kaieditor.borderColor": "#4c566a",
  "kaieditor.accentColor": "#88c0d0",
  "kaieditor.borderRadius": 6,
  "kaieditor.opacity": 0.9
}
```

### GitHub Style
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

## 📋 Commands

- `KaiEditor: Toggle Comment Boxes` - Enable/disable comment boxes
- `KaiEditor: Refresh Decorations` - Manually refresh decorations

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
