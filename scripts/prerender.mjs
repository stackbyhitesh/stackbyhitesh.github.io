// Runs after `vite build`. Renders the whole page to HTML and writes it into dist/index.html, so Google, Bing and
// social-link previews get the real text (headings, experience, FAQ) even before any JavaScript runs.
// In the browser, React then replaces this snapshot with the live app, so nothing changes for visitors.
//
//   node scripts/prerender.mjs          (reads ./dist)
//   node scripts/prerender.mjs some/dir (reads another build folder)
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.resolve(process.argv[2] ?? 'dist');
const indexFile = path.join(dist, 'index.html');
if (!fs.existsSync(indexFile)) {
  console.error(`prerender: ${indexFile} not found. Run "vite build" first.`);
  process.exit(1);
}
const template = fs.readFileSync(indexFile, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  console.log('prerender: dist/index.html already has page content (or no empty #root). Nothing to do.');
  process.exit(0);
}

// Vite renames images to name-HASH.ext. Map each source image to its built file so <img src> in the snapshot is real.
const assetDir = path.join(dist, 'assets');
const built = fs.existsSync(assetDir) ? fs.readdirSync(assetDir) : [];
const builtUrl = (file) => {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const hit = built.find((f) => f.startsWith(`${base}-`) && f.endsWith(ext));
  return hit ? `./assets/${hit}` : ''; // small images are inlined by Vite: no file, so leave empty
};

const stubs = {
  name: 'prerender-stubs',
  setup(b) {
    // CSS and fonts do nothing during rendering to a string.
    b.onResolve({ filter: /\.css$/ }, () => ({ path: 'css', namespace: 'empty' }));
    b.onLoad({ filter: /.*/, namespace: 'empty' }, () => ({ contents: '', loader: 'js' }));
    // Images become their built URL.
    b.onLoad({ filter: /\.(jpe?g|png|webp|avif|gif|svg)$/i }, (args) => ({
      contents: `export default ${JSON.stringify(builtUrl(args.path))};`,
      loader: 'js',
    }));
    // import.meta.glob is Vite-only, so list the images in these folders ourselves.
    b.onLoad({ filter: /achievementImages\.ts$/ }, (args) => {
      const folder = 'achievements';
      const dir = path.join(path.dirname(args.path), '../assets', folder);
      const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f)) : [];
      const entries = files.map((f) => `${JSON.stringify(`../assets/${folder}/${f}`)}: ${JSON.stringify(builtUrl(f))}`).join(',\n');
      const src = fs
        .readFileSync(args.path, 'utf8')
        .replace(/import\.meta\.glob<string>\([\s\S]*?\n\);/, `{\n${entries}\n} as Record<string, string>;`);
      return { contents: src, loader: 'ts', resolveDir: path.dirname(args.path) };
    });
  },
};

const tmpDir = path.join(root, '.prerender-tmp');
fs.mkdirSync(tmpDir, { recursive: true });
const out = path.join(tmpDir, 'ssr.mjs');
try {
  await build({
    entryPoints: [path.join(root, 'src/ssr.tsx')],
    outfile: out,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'],
    plugins: [stubs],
    define: { 'import.meta.env.DEV': 'false' },
    logLevel: 'error',
  });
  const { render } = await import(pathToFileURL(out).href);
  let html = render();
  // The built page forbids inline style attributes (Content-Security-Policy), and they only carry animation delays.
  html = html.replace(/ style="[^"]*"/g, '');
  // Decorative icons (hidden from screen readers, no text) only make the snapshot heavier, so leave them out of it.
  html = html.replace(/<svg\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/svg>/g, '');
  fs.writeFileSync(indexFile, template.replace(marker, `<div id="root">${html}</div>`));
  console.log(`prerender: wrote ${(html.length / 1024).toFixed(0)} KB of page HTML into ${path.relative(root, indexFile)}`);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
