---
title: How to Embed a Gradient in Your Website
description: Learn how to embed an animated gradient background in any website — HTML, React, Next.js, Webflow, and more — using GradLab's HTML export.
head:
  - - meta
    - name: keywords
      content: embed gradient website, animated gradient HTML, gradient background React, gradient Next.js, iframe gradient background, HTML animated background
---

# How to Embed a Gradient in Your Website

GradLab's **Export Code** feature generates a self-contained HTML file that runs the live gradient animation in any browser. This page shows how to embed it across different frameworks and platforms.

## Step 1: Export your gradient

1. Design your gradient in [GradLab](https://gradlab.app)
2. Click **Export Code**
3. Click **Download** to save the `.html` file
4. Host the file on your server or CDN alongside your other assets

## Method 1: iframe (universal)

The simplest method — works in plain HTML, any CMS, Webflow, Framer, Notion, and most no-code tools.

```html
<iframe
  src="/assets/gradient.html"
  style="position:fixed; top:0; left:0; width:100%; height:100%; border:none; z-index:-1; pointer-events:none;"
  title="Animated gradient background"
></iframe>
```

Remove `position:fixed` and adjust sizing to embed the gradient as a contained element rather than a full-page background.

## Method 2: React / Next.js

```jsx
export default function GradientBackground() {
  return (
    <iframe
      src="/gradient.html"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      title="Animated gradient background"
    />
  )
}
```

Place the exported `gradient.html` file in your `/public` folder. Import and render the component in your layout or page file.

## Method 3: CSS background (static PNG)

If you prefer a static image rather than a live animation, export a PNG from GradLab and apply it with CSS:

```css
.hero {
  background-image: url('/assets/gradient.png');
  background-size: cover;
  background-position: center;
}
```

## Method 4: Video background

Export an MP4 from GradLab and use the HTML5 video element:

```html
<video
  autoplay loop muted playsinline
  style="position:fixed; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:-1;"
>
  <source src="/assets/gradient.mp4" type="video/mp4">
</video>
```

The `muted` and `playsinline` attributes are required for autoplay on iOS Safari.

## Webflow

1. Add an **Embed** element to your page
2. Paste the iframe code from Method 1
3. Host the exported `.html` file on a CDN (e.g. Cloudflare R2, AWS S3, or any static host) and update the `src` path

## Framer

1. Use the **HTML** component from the component panel
2. Paste the full contents of the exported `.html` file into the editor

## Performance considerations

- The exported HTML uses WebGL — it runs on the GPU and is efficient in modern browsers
- On mobile, the animation is hardware-accelerated and runs smoothly on iOS and Android
- For very low-powered devices, consider a static PNG fallback using the `<noscript>` or `@media` approach
- Set `pointer-events: none` on the iframe/video so it does not block clicks on overlying content

## Related

- [Download & export formats](/guides/download-export)
- [Gradient video background](/guides/gradient-video-background)
- [Animated gradient background](/guides/animated-gradient-background)
