import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import monkey, { type MonkeyUserScript } from 'vite-plugin-monkey';

const userscript = fileURLToPath(new URL('../google-calendar-keyboard-enhance.user.js', import.meta.url));
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

// Set by dev.ts once the cloudflare quick tunnel is up, e.g. https://xxx.trycloudflare.com
const devOrigin = process.env.DEV_ORIGIN ? new URL(process.env.DEV_ORIGIN) : undefined;
const port = Number(process.env.DEV_PORT ?? 5180);

/** Parse the `// ==UserScript==` header of the real script so dev metadata stays in sync. */
function parseHeader(file: string): MonkeyUserScript {
  const src = readFileSync(file, 'utf8');
  const block = src.match(/\/\/ ==UserScript==([\s\S]*?)\/\/ ==\/UserScript==/)?.[1] ?? '';
  const out: Record<string, any> = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^\/\/\s*@(\S+)\s+(.*?)\s*$/);
    if (!m) continue;
    const [, rawKey, value] = m;
    const [key, locale] = rawKey.split(':', 2);
    // dev build is served from the tunnel, never from greasyfork
    if (key === 'downloadURL' || key === 'updateURL') continue;
    if (locale !== undefined) {
      out[key] = typeof out[key] === 'object' ? out[key] : { '': out[key] ?? '' };
      out[key][locale] = value;
    } else if (typeof out[key] === 'object') {
      out[key][''] = value;
    } else if (key in out) {
      out[key] = [].concat(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out as MonkeyUserScript;
}

/**
 * - Watch the repo root as a directory: the userscript lives outside the vite root, and a
 *   single-file watch is lost when editors / git replace the file via rename.
 * - vite-plugin-monkey builds the loader URL from vite's server.host (127.0.0.1) unless the
 *   install request carries `?origin=`. Fill it in from the tunnel so the plain
 *   `/__vite-plugin-monkey.install.user.js` URL works when reached through cloudflared.
 */
const devServer = (): Plugin => ({
  name: 'dev:server',
  configureServer(server) {
    server.watcher.add(repoRoot);
    server.middlewares.use((req, _res, next) => {
      const url = new URL(req.url ?? '/', 'http://x');
      if (url.pathname === '/__vite-plugin-monkey.install.user.js' && !url.searchParams.has('origin')) {
        const proto = req.headers['x-forwarded-proto'] ?? 'http';
        const origin = devOrigin?.origin ?? (req.headers.host ? `${proto}://${req.headers.host}` : undefined);
        if (origin) {
          url.searchParams.set('origin', origin);
          req.url = url.pathname + url.search;
        }
      }
      next();
    });
  },
});

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  server: {
    port,
    strictPort: true,
    host: '127.0.0.1',
    // tunnel host is random per run; accept it
    allowedHosts: devOrigin ? [devOrigin.hostname] : undefined,
    // the script runs on calendar.google.com, so the HMR client must be told where the ws lives
    hmr: devOrigin
      ? { protocol: 'wss', host: devOrigin.hostname, clientPort: 443, path: '/__vite_hmr' }
      : undefined,
    fs: { allow: [repoRoot] },
  },
  plugins: [
    devServer(),
    monkey({
      entry: 'entry.js',
      userscript: parseHeader(userscript),
      server: {
        open: false,
        prefix: (name) => `[DEV] ${name}`,
      },
      build: {
        fileName: 'google-calendar-keyboard-enhance.user.js',
      },
    }),
  ],
});
