# Change Log

All notable changes to the "kaieditor" extension will be documented in this file.

## [0.0.1] - 2026-02-08

### Added
- ✨ **CSS-Based Visual Comment Boxes**: Transform comments into elegant styled boxes using pure CSS
- 🎨 **Customizable Styling**: Full control over colors, borders, padding, opacity, and typography
- 💎 **Multiple Comment Types**: Support for inline, single-line, and multi-line comments
- 🌐 **Multi-Language Support**: JavaScript, TypeScript, Python, Rust, and Go
- ⚙️ **Rich Configuration**: 12+ settings to customize appearance
- 🎯 **Smart Text Handling**: Automatic text truncation for long comments
- 🔄 **Non-Invasive**: Decorations don't modify source code

### Features
- Background colors, text colors, and border colors customization
- Accent color for multi-line comment left border
- Adjustable border radius (0-20px)
- Configurable vertical and horizontal padding
- Font style (normal/italic) and font weight (400/500/600) options
- Opacity control (0.1-1.0)
- Preset styles: Nord (default), GitHub, Minimalist

### Commands
- `KaiEditor: Toggle Comment Boxes` - Enable/disable decorations
- `KaiEditor: Refresh Decorations` - Manually refresh visual boxes

### Technical
- Built with TypeScript and VS Code Decorations API
- Pure CSS styling without SVG or external dependencies
- Efficient decoration caching and management
- Real-time configuration updates