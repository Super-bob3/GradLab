---
title: How to Download and Export Gradients
description: A complete guide to all gradient generator download options in GradLab — export as PNG image, MP4 video, or standalone HTML file.
head:
  - - meta
    - name: keywords
      content: gradient generator download, export gradient PNG, download gradient video, gradient HTML export, free gradient download
---

# How to Download and Export Gradients

GradLab offers three ways to download your gradient. Each format suits a different use case — this guide explains when to use each one and how to get the best output.

## PNG — Download a still image

**When to use:** Static designs, social media posts, UI mockups, print, presentations.

1. Design your gradient on the canvas
2. Click **Download Frame** in the panel
3. A `.png` file downloads instantly

**Resolution:** GradLab renders at a minimum of 2× device pixel ratio. On a Retina display, a 1280 × 720 canvas exports at 2560 × 1440. On a standard display, still 2× — so the minimum export quality is always high-resolution.

::: tip
Set the canvas size to your exact target dimensions before downloading. Use the W and H fields in the Canvas section.
:::

## MP4 — Download a gradient video

**When to use:** Website hero backgrounds, social media video posts, video presentations, motion design assets.

1. Enable **Ping-pong Loop** in the panel (recommended for seamless loops)
2. Click **Record MP4**
3. Let the animation run for the desired duration (3–8 seconds is ideal)
4. Click **Stop Recording**
5. GradLab encodes and downloads the `.mp4` file

**Format:** MP4 (H.264) in Chrome and Edge. Safari exports WebM (VP8) as a fallback — both play in all modern browsers.

::: info
The ping-pong loop plays the animation forward then reverses it, creating a seamless infinite loop with no visible cut point.
:::

**Tips for smaller file sizes:**
- Record 4–6 seconds rather than longer clips
- Keep the canvas at 1280 × 720 or smaller for web use
- Lower the **Speed** slider before recording for a calmer, more compressed clip

## HTML — Download a standalone gradient file

**When to use:** Live web embedding, sharing a gradient that stays animated, archiving a gradient configuration.

1. Click **Export Code**
2. In the modal, click **Download** to save the `.html` file

The exported file is completely self-contained — it includes the WebGL shader, all parameter values, and the rendering loop. It has no external dependencies and works offline in any browser.

**What you can do with the exported HTML:**

| Use case | How |
|----------|-----|
| Embed in a website | Drop it into an `<iframe>` |
| Full-screen background | Open directly in a browser tab |
| Share with a client | Send the single file — opens in any browser |
| Archive a configuration | All gradient settings are embedded |

```html
<iframe
  src="your-gradient.html"
  style="width:100%; height:100%; border:none;"
></iframe>
```

## Download param code

The **Download Param Code** button (in the Export Code modal footer) saves a compact JSON file containing only the parameter values. Use this to save and reload a specific gradient configuration without the full shader code.

## Comparing export formats

| Format | File type | Animated | Dependencies | Best for |
|--------|-----------|----------|--------------|----------|
| PNG | `.png` | No | None | Static design, print |
| Video | `.mp4` / `.webm` | Yes | None | Web backgrounds, social video |
| HTML | `.html` | Yes | None | Web embedding, sharing |

## Related

- [Animated gradient background](/guides/animated-gradient-background)
- [Gradient video background](/guides/gradient-video-background)
- [Embed a gradient in your website](/guides/embed-in-website)
