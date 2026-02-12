# Google Calendar Keyboard Enhance

A lightweight userscript that enhances Google Calendar with powerful keyboard shortcuts for efficient event manipulation.

## Features

- **Keyboard shortcuts for event manipulation:**
  - `Alt+h/j/k/l` - Move events (Vim-style navigation)
  - `Alt+Shift+h/j/k/l` - Expand/shrink event duration
  - `Ctrl+b` - Toggle menu
- **Visual feedback** during drag operations
- **No external dependencies** - pure vanilla JavaScript
- **Lightweight** - only 323 lines of clean, maintainable code

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://tampermonkey.net/) (Chrome/Firefox/Edge/Safari)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome/Firefox/Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)

2. Install the script from one of these sources:
   - **[Install from GitHub](https://raw.githubusercontent.com/snomiao/google-calendar-keyboard-enhance.user.js/main/google-calendar-keyboard-enhance.user.js)** (Direct link from this repository)
   - [Greasy Fork](https://greasyfork.org/scripts/439210)
   - [Direct install from Greasy Fork](https://update.greasyfork.org/scripts/439210/%5BSNOLAB%5D%20Google%20Calendar%20keyboard%20enhance.user.js)

## Usage

Once installed, the script automatically enhances Google Calendar when you visit:
- https://calendar.google.com

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+k` | Move event up (previous day) |
| `Alt+j` | Move event down (next day) |
| `Alt+h` | Move event left (earlier time) |
| `Alt+l` | Move event right (later time) |
| `Alt+Shift+k` | Shrink event duration (from bottom) |
| `Alt+Shift+j` | Expand event duration (from bottom) |
| `Alt+Shift+h` | Shrink event duration (from right) |
| `Alt+Shift+l` | Expand event duration (from right) |
| `Ctrl+b` | Toggle main menu |

## Development

To modify this script:

1. Clone the repository
2. Edit `google-calendar-keyboard-enhance.user.js`
3. Test in your browser with a userscript manager
4. Submit a pull request with your improvements

## License

This project is open source. Feel free to use and modify as needed.

## Author

Created by [snomiao](mailto:snomiao@gmail.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.