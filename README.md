# Pipeline Shader V7

> WebGL fluid shader engine with OKLab color science, halftone effects, and an interactive ASCII character matrix.

## Project Structure

```
pipeline-shader/
├── index.html          ← Main entry point (HTML shell)
├── src/
│   ├── styles.css      ← All UI styles & CSS variables
│   ├── shaders.js      ← GLSL vertex + fragment shader source
│   ├── engine.js       ← WebGL context, render loop, camera input
│   ├── matrix.js       ← Stage 5: ASCII character matrix overlay
│   ├── controls.js     ← Control panel UI: colors, presets, sliders
│   ├── export.js       ← Screenshot, MP4 recording, code export
│   └── main.js         ← App entry point — wires all modules
├── vercel.json         ← Vercel deployment config
├── netlify.toml        ← Netlify deployment config
└── package.json        ← npm scripts for local dev
```

## Features

- **Stage 1 · Palette** — up to 8 colors, drag-to-reorder, image color extraction, OKLch/RGB blend modes
- **Stage 2 · Shape & Flow** — 13 algorithms: fluid chaos, structured mapping, diffusion, SDF topology
- **Stage 3 · Post-Processing** — film grain, inner border, corner radius, 3D tilt
- **Stage 4 · Halftone** — 4 dither matrices × 6 shapes, contrast control
- **Stage 5 · Interactive Matrix** — ASCII character overlay with heatmap decay or dynamic background mode
- **Export** — PNG screenshot, MP4 / WebM video (with pingpong loop), standalone HTML code export

## Local Development

Requires a local HTTP server (ES modules don't work via `file://`):

```bash
# Option 1 — npx (no install needed)
npx serve . --cors -p 3000

# Option 2 — Python
python3 -m http.server 3000

# Option 3 — npm script
npm run dev
```

Then open **http://localhost:3000**

## Deploy to Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel
```

Or connect your GitHub repo at **vercel.com** → Import Project → select this folder.

## Deploy to Netlify

Drag-and-drop the entire `pipeline-shader/` folder onto **app.netlify.com/drop**.

Or via CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

## Deploy to GitHub Pages

1. Push this folder as a GitHub repository
2. Go to **Settings → Pages → Source → Deploy from branch**
3. Select `main` / `root`

> **Note:** GitHub Pages does not send `Cross-Origin-Opener-Policy` headers.
> The shader and canvas will work fine, but MP4 recording may fall back to WebM.

## Notes

- **ES Modules** are used throughout (`type="module"`). No build step or bundler required.
- The GLSL shaders are embedded as template literal strings in `src/shaders.js`.
- All state is in-memory; there is no backend or database.
