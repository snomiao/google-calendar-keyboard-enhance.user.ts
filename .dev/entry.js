// Shim so the vite entry lives inside .dev/ (vite-plugin-monkey resolves the entry URL
// relative to the vite root). The real source is the published script at the repo root.
import '../google-calendar-keyboard-enhance.user.js';
