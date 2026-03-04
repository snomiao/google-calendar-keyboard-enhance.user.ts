# Google Calendar Keyboard Enhance

**Move, resize, and reschedule Google Calendar events using only your keyboard** — no mouse needed. The missing hotkeys for Google Calendar.

Google Calendar lacks hotkeys for moving events between days or time slots. This userscript adds **Vim-style HJKL keyboard shortcuts** to drag events around the calendar grid, expand/shrink event durations, and more — all without touching your mouse.

## Why?

Google Calendar's built-in keyboard shortcuts (hotkeys) let you create and delete events, but there's **no hotkey to move an event to a different time or day**. If you want to reschedule a meeting from Tuesday to Wednesday, or shift it 15 minutes earlier, you're forced to drag with a mouse or manually edit the time fields.

This script fixes that.

## Features

- **Move events with keyboard** — `Alt+H/J/K/L` moves the selected event left/down/up/right across the calendar grid (Vim-style)
- **Resize events with keyboard** — `Alt+Shift+H/J/K/L` expands or shrinks event duration
- **Works in weekly and daily views** — drag events between days or shift time slots in 15-minute increments
- **Smart input fallback** — if drag mode isn't available, automatically edits the date/time fields directly
- **Copy event text** — double-click to copy text from event detail views

## Keyboard Shortcuts

| Shortcut      | Action                              |
| ------------- | ----------------------------------- |
| `Alt+K`       | Move event up                       |
| `Alt+J`       | Move event down                     |
| `Alt+L`       | Move event right                    |
| `Alt+H`       | Move event left                     |
| `Alt+Shift+K` | Shrink event duration (from bottom) |
| `Alt+Shift+J` | Expand event duration (from bottom) |
| `Alt+Shift+H` | Shrink event duration (from right)  |
| `Alt+Shift+L` | Expand event duration (from right)  |
| `Alt+V`       | Copy pattern selectors              |
| `Ctrl+B`      | Toggle main menu                    |

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://tampermonkey.net/) (Chrome/Firefox/Edge/Safari)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome/Firefox/Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)

2. Install the script:
   - **[Install from Greasy Fork](https://greasyfork.org/scripts/439210)** (recommended)
   - [Install from GitHub](https://raw.githubusercontent.com/snomiao/google-calendar-keyboard-enhance.user.js/main/google-calendar-keyboard-enhance.user.js)

## How It Works

1. Open [Google Calendar](https://calendar.google.com) in weekly or daily view
2. Click on an event to select it (a floating event popup appears)
3. Hold `Alt` and press `H/J/K/L` to move the event around the grid
4. Hold `Alt+Shift` and press `H/J/K/L` to resize the event
5. Release `Alt` to confirm the new position

The script uses two strategies:
- **Drag simulation**: Dispatches mouse events to drag the event chip on the calendar grid
- **Input field editing**: Falls back to directly modifying date/time input fields when the event editor is open

## Related

- [Google Calendar built-in keyboard shortcuts](https://support.google.com/calendar/answer/37034)
- [CapsLockX](https://github.com/snomiao/CapsLockX) — Keyboard enhancement tool for Windows with physics-based cursor acceleration

## Development

1. Clone the repository
2. Edit `google-calendar-keyboard-enhance.user.js`
3. Test in your browser with a userscript manager
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE)

## Author

Created by [snomiao](mailto:snomiao@gmail.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.
