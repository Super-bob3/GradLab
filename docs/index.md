---
title: GradLab — Free WebGL Gradient Generator Online
description: GradLab is a free browser-based WebGL gradient generator with OKLab color science, 13 fluid algorithms, halftone effects, ASCII matrix overlay, and PNG/MP4/HTML export. No install required.
head:
  - - meta
    - name: keywords
      content: WebGL gradient generator, fluid gradient generator, animated gradient maker, mesh gradient online, OKLab gradient, halftone generator, ASCII art overlay, gradient background maker, free gradient tool, gradient video export
  - - meta
    - property: og:title
      content: GradLab — Free WebGL Gradient Generator
  - - meta
    - property: og:description
      content: Generate fluid animated gradients in your browser. OKLab color science, 13 algorithms, halftone, ASCII matrix, PNG and MP4 export. Free, no install.
layout: home
hero:
  name: GradLab
  text: WebGL Gradient Engine
  tagline: OKLab color science, 13 fluid algorithms, halftone, and interactive ASCII matrix — free, runs entirely in your browser.
  actions:
    - theme: brand
      text: Quick Start
      link: /quickstart
    - theme: alt
      text: Launch App ↗
      link: https://gradlab.app
features:
  - title: OKLab Color Science
    details: Every blend runs through the OKLab perceptual color space — smooth, vivid transitions with no muddy midtones, regardless of hue pair.
  - title: 13 Fluid Algorithms
    details: From classic sine waves to curl noise vortices, radial topology rings, and signed-distance field shapes. Every algorithm runs at 60fps on your GPU.
  - title: Halftone & ASCII Matrix
    details: Layer dithered halftone patterns or an interactive ASCII character grid over any gradient. Mouse-reactive with heatmap decay.
  - title: Export Anywhere
    details: PNG screenshot, MP4/WebM video loop with ping-pong, or a self-contained HTML file with zero dependencies — embed in any website.
---

## What is GradLab

GradLab is a **free online WebGL gradient generator** that runs entirely in your browser. It uses GPU-accelerated shaders to produce real-time animated gradients — no server, no installation, no account required.

Unlike standard CSS gradient tools, GradLab operates in the **OKLab perceptual color space**, which means color transitions stay vivid and balanced across all hue combinations. The result is smoother, more professional-looking gradients straight out of the box.

## Who Uses GradLab

- **UI/UX designers** — create animated gradient backgrounds for landing pages, hero sections, and app interfaces
- **Brand designers** — extract brand colors from a photo, blend them into a fluid gradient, and export as PNG or video
- **Web developers** — export a self-contained HTML snippet and embed it as a live background in any site
- **Motion designers** — record MP4 loops with ping-pong for seamless social media content
- **Creative coders** — explore 13 different fluid and geometric algorithms as a visual playground

## Key Features

### Fluid Gradient Algorithms

GradLab includes 13 distinct flow algorithms, each producing a different visual structure:

- **Fluid Dynamics** — turbulent, organic motion from layered noise
- **Domain Warp** — marble-like veining through iterative UV distortion
- **Curl Noise** — divergence-free vortex flows
- **Radial Topography** — concentric gradient rings like a contour map
- **Nested SDF Shape** — geometric glow from signed-distance field math
- **Diffusion Fluid** — absorb a background image into the gradient flow

All algorithms run as GLSL fragment shaders directly on your GPU.

### OKLab Gradient Blending

Most gradient tools blend colors in sRGB, which produces dark, muddy midpoints when mixing complementary hues. GradLab routes every blend through **OKLab** — a perceptually uniform color space — ensuring smooth, natural transitions at every step. You can also switch to RGB blending for a more traditional look.

### Halftone Overlay

Apply a dithered halftone layer over any gradient using 4 dither matrices (random, 2×2, 4×4, 8×8 Bayer) and 6 dot shapes (circle, square, diamond, line, cross, ellipse). The result is a print-ready, editorial, or retro-digital aesthetic on top of any fluid gradient.

### Interactive ASCII Matrix

Overlay a full-canvas grid of ASCII characters that responds to mouse movement in real time. Choose from code snippets, block characters, binary, or enter your own custom text. Characters brighten and decay based on cursor proximity, creating a living typographic texture.

### Export Options

| Format | Use Case |
|--------|----------|
| **PNG** | Static assets for design, print, social media |
| **MP4 / WebM** | Looping video background, social content |
| **Standalone HTML** | Embed live gradient anywhere with `<iframe>` |

All exports render at a minimum 2× pixel density for sharp output on every display.

## How to Get Started

Open [gradlab.app](https://gradlab.app) in any modern browser — Chrome, Firefox, Safari, or Edge. No account, no download. The canvas starts rendering immediately with one of three preset configurations. From there, adjust colors, pick an algorithm, and export in seconds.

→ [Read the Quick Start guide](/quickstart)
