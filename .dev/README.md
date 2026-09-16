# .dev — live-reload development

Runs the root `google-calendar-keyboard-enhance.user.js` through
[vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey) and exposes the
dev server through a Cloudflare quick tunnel so the dev build can be installed on any
machine/browser.

```sh
cd .dev
bun install
bun run dev
```

The script prints something like:

```
  Tunnel   https://abc-def.trycloudflare.com
  Install  https://abc-def.trycloudflare.com/__vite-plugin-monkey.install.user.js
```

Open the **Install** URL in a browser with Tampermonkey / Violentmonkey. The installed
script is named `[DEV] [SNOLAB] Google Calendar keyboard enhance` and loads the live
source from the tunnel — edit the root `.user.js` and the Google Calendar tab reloads.

Disable the Greasy Fork version while the dev script is installed so they don't both run.

Notes

- The tunnel URL is random each run; reinstall the dev script after restarting.
- Requires `cloudflared` on PATH (`brew install cloudflared` / https://pkg.cloudflare.com).
- Local port defaults to 5180 (`DEV_PORT=5181 bun run dev` to change it); `DEV_VERBOSE=1` to see cloudflared logs.
- If Google Calendar's CSP blocks the loader, set Tampermonkey → Settings → Security →
  "Modify existing content security policy (CSP) headers" to *Remove entirely* for testing.
- `bunx vite build` writes a bundled `dist/google-calendar-keyboard-enhance.user.js`
  (header regenerated from the root script's metadata) — for sanity checks only; the
  root file remains the published artifact.
