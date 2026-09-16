/**
 * Dev orchestrator:
 *   1. open a cloudflare quick tunnel to the vite port
 *   2. start vite (vite-plugin-monkey) with the tunnel as its public origin
 *   3. print the install URL for the dev userscript
 *
 * Usage: bun run dev   (from .dev/)
 */
import { spawn, type ChildProcess } from 'node:child_process';

const port = Number(process.env.DEV_PORT ?? 5180);
const children: ChildProcess[] = [];

const shutdown = () => {
  for (const c of children) c.kill('SIGTERM');
  process.exit();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// --- 1. tunnel -------------------------------------------------------------
const cf = spawn('cloudflared', ['tunnel', '--url', `http://127.0.0.1:${port}`, '--no-autoupdate'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
children.push(cf);

const tunnelUrl = await new Promise<string>((resolve, reject) => {
  const onData = (buf: Buffer) => {
    const text = buf.toString();
    if (process.env.DEV_VERBOSE) process.stderr.write(text);
    const m = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (m) resolve(m[0]);
  };
  cf.stdout!.on('data', onData);
  cf.stderr!.on('data', onData);
  cf.on('exit', (code) => reject(new Error(`cloudflared exited with code ${code}`)));
  setTimeout(() => reject(new Error('timed out waiting for cloudflared tunnel URL')), 30_000);
});

// --- 2. vite ---------------------------------------------------------------
const vite = spawn('bunx', ['vite', '--clearScreen', 'false'], {
  stdio: 'inherit',
  env: { ...process.env, DEV_ORIGIN: tunnelUrl, DEV_PORT: String(port) },
});
children.push(vite);
vite.on('exit', shutdown);
cf.on('exit', shutdown);

// --- 3. install url --------------------------------------------------------
const installUrl = `${tunnelUrl}/__vite-plugin-monkey.install.user.js`;
const banner = `
  Tunnel   ${tunnelUrl}
  Install  ${installUrl}

  Open the Install URL in a browser with Tampermonkey/Violentmonkey to install the
  dev version. Edits to ../google-calendar-keyboard-enhance.user.js reload the page.
`;
// print after vite's own startup banner
setTimeout(() => console.log(banner), 1500);
