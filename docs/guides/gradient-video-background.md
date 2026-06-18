---
title: Gradient Video Background — Create and Use Looping Gradient Videos
description: How to create a seamless gradient video background for your website using GradLab. Export as MP4, embed with HTML5 video, and optimize for performance.
head:
  - - meta
    - name: keywords
      content: gradient video background, animated video background, looping video background, gradient background video, MP4 gradient download, animated background video website
---

# Gradient Video Background

A gradient video background creates smooth, living motion behind your content. Compared to GIF or CSS animation, a video loop from GradLab is smaller, higher quality, and plays at a consistent frame rate on every device.

## Create the video in GradLab

### 1. Set up your gradient

Open [GradLab](https://gradlab.app) and design your gradient. For video backgrounds:

- Use 3–4 colors for a clean, professional look
- Keep **Speed** low (0.1–0.3) for a calm, ambient feel
- Enable **Film Grain** for a cinematic texture

### 2. Set the canvas size

Enter your target dimensions in the Canvas fields. Common video background sizes:

| Use case | Dimensions |
|----------|-----------|
| Desktop full-screen | 1920 × 1080 |
| Square (social) | 1080 × 1080 |
| Portrait (mobile / Reels) | 1080 × 1920 |
| Compact web hero | 1280 × 720 |

### 3. Enable Ping-pong Loop

Toggle **Ping-pong Loop** in the panel before recording. This plays the animation forward then reverses it, creating a perfectly seamless loop with no visible cut point.

### 4. Record and download

1. Click **Record MP4**
2. Wait 4–8 seconds — longer is only necessary if the motion cycle is slow
3. Click **Stop Recording**
4. The `.mp4` file downloads automatically

::: info
Chrome and Edge produce MP4 (H.264). Safari produces WebM (VP8). Both loop seamlessly and play in all modern browsers.
:::

## Embed the video background

### Full-page background

```html
<div style="position:relative; min-height:100vh; overflow:hidden;">
  <video
    autoplay loop muted playsinline
    style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
           min-width:100%; min-height:100%; object-fit:cover; z-index:0;"
  >
    <source src="gradient.mp4" type="video/mp4">
  </video>

  <div style="position:relative; z-index:1;">
    <!-- Your content here -->
  </div>
</div>
```

### Hero section only

```html
<section style="position:relative; height:80vh; overflow:hidden;">
  <video autoplay loop muted playsinline
    style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
    <source src="gradient.mp4" type="video/mp4">
  </video>
  <div style="position:relative; z-index:1; padding:4rem;">
    <h1>Your headline</h1>
  </div>
</section>
```

## Required video attributes

| Attribute | Why it's needed |
|-----------|----------------|
| `autoplay` | Starts playing immediately |
| `loop` | Repeats the video infinitely |
| `muted` | Required for autoplay in Chrome/Safari |
| `playsinline` | Required for autoplay on iOS — without it, the video opens fullscreen |

All four attributes are required for consistent autoplay across browsers and devices.

## Performance tips

- **File size target:** keep the video under 3–5 MB for fast page loads
- **Codec:** H.264 compresses well; a 5-second 720p clip is typically under 2 MB
- **Blur trick:** apply `filter: blur(0px)` initially and animate to a tiny value — forces GPU compositing and reduces perceived jank
- **Reduce motion:** respect user preferences with `@media (prefers-reduced-motion: reduce)` by swapping the video for a static PNG

```css
@media (prefers-reduced-motion: reduce) {
  video { display: none; }
  .hero { background-image: url('gradient-fallback.png'); background-size: cover; }
}
```

## Related

- [Download & export formats](/guides/download-export)
- [Animated gradient background](/guides/animated-gradient-background)
- [Embed a gradient in your website](/guides/embed-in-website)
