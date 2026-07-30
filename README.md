# GradLab

> Free, browser-native WebGL gradient generator — animated mesh gradients with OKLab color science, halftone effects, and an interactive ASCII character matrix. No install, no account, no export limits.

**Live:** [gradlab.app](https://gradlab.app) · **Docs:** [docs.gradlab.app](https://docs.gradlab.app)

## Features

- **Palette** — up to 8 colors, drag-to-reorder, image color extraction, RGB / OKLCH / OKLAB blend modes
- **Shape & Flow** — multiple algorithms: fluid chaos, structured mapping, diffusion, nested SDF topology
- **Post-Processing** — film grain, inner border, corner radius, 3D tilt
- **Halftone** — dither matrices × multiple shapes, contrast control
- **Interactive Matrix** — ASCII character overlay with heatmap decay or dynamic background mode
- **Export** — PNG screenshot, MP4 / WebM video (with pingpong loop), standalone HTML code export
- Real-time preview, light/dark theme, English / 中文 language toggle

## Project Structure

```
GradLab/
├── index.html          ← Main entry point (HTML shell)
├── src/
│   ├── styles.css       ← All UI styles & CSS variables
│   ├── shaders.js       ← GLSL vertex + fragment shader source
│   ├── engine.js        ← WebGL context, render loop, camera input
│   ├── matrix.js        ← ASCII character matrix overlay
│   ├── controls.js      ← Control panel UI: colors, presets, sliders
│   ├── components.js    ← Reusable UI component mounting
│   ├── color-picker.js  ← Custom color picker
│   ├── canvas-size.js   ← Canvas size control
│   ├── split-hover.js   ← Logo hover text effect
│   ├── feedback.js      ← Feedback widget
│   ├── sound.js         ← Web Audio UI sound effects
│   ├── barcode.js       ← PDF417 param import/share
│   ├── params.js        ← Param encode/decode
│   ├── export.js        ← Screenshot, MP4 recording, code export
│   └── main.js           ← App entry point — wires all modules
├── vercel.json          ← Vercel deployment config (headers, caching, rewrites)
└── package.json         ← Vite scripts & dependencies
```

## Local Development

Built with [Vite](https://vitejs.dev):

```bash
npm install
npm run dev      # local dev server with HMR
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

Then open **http://localhost:3000** (or whatever port Vite prints).

## Deploy

The production site runs on **Vercel**. `vercel.json` sets the `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` headers required for MP4 recording, plus immutable caching for Vite's content-hashed `/assets/*` output — connect the repo at [vercel.com](https://vercel.com) and it will build with `npm run build` and serve `dist/`.

> Other static hosts work for the UI, but without COOP/COEP headers MP4 recording falls back to WebM.

## Notes

- ES Modules throughout (`type="module"`); Vite handles bundling and content-hash filenames for production.
- GLSL shaders are embedded as template literal strings in `src/shaders.js`.
- All state is in-memory; there is no backend or database.

## License

[MIT](LICENSE)
