---
title: How to Create an Animated Gradient Background
description: Step-by-step guide to creating a smooth animated gradient background for your website using GradLab — the free online gradient generator.
head:
  - - meta
    - name: keywords
      content: animated gradient background, gradient background generator, animated background website, animated gradient CSS, gradient animation online
---

# How to Create an Animated Gradient Background

An animated gradient background adds depth and motion to any website, app, or presentation. This guide walks through creating one with GradLab, a free browser-based gradient generator, and adding it to your project.

## Step 1: Open GradLab

Go to [gradlab.app](https://gradlab.app) — no sign-up or installation required. The canvas starts animating immediately.

## Step 2: Choose a color palette

In the panel on the right, pick a preset theme or build your own:

- Click any color swatch to open the color editor
- Use **Upload Image** to extract a palette from a photo
- Add or remove colors with **+ Add Color** and **− Color**

For animated backgrounds, 3–5 colors work best. Too many colors create visual noise.

## Step 3: Adjust the animation

Use the **Shape & Flow** sliders to control motion:

| Slider | Effect |
|--------|--------|
| **Speed** | How fast the gradient moves |
| **Liquid** | Organic fluidity of the flow |
| **Zoom** | Scale of the color blobs |

For a subtle background, keep Speed below 0.3 and Liquid around 0.5. For a more dynamic feel, push both higher.

## Step 4: Set canvas dimensions

Under the **Canvas** section, enter the dimensions that match your design:

- Full HD: 1920 × 1080
- Square: 1080 × 1080
- Portrait: 1080 × 1920

## Step 5: Export for the web

You have three export options depending on how you plan to use the background:

**Static PNG** — best for images in presentations, social media, or email headers. Click **Download Frame**.

**MP4 video loop** — best for website hero backgrounds. Enable **Ping-pong Loop**, click **Record MP4**, let it run for 4–6 seconds, then stop. This creates a seamless looping clip.

**Standalone HTML** — best for direct embedding. Click **Export Code** to download a self-contained `.html` file with the live animation built in.

## Adding the background to your website

### Option A: HTML file via iframe

```html
<iframe
  src="gradient.html"
  style="position:fixed; top:0; left:0; width:100%; height:100%; border:none; z-index:-1;"
></iframe>
```

### Option B: Video background

```html
<video
  autoplay loop muted playsinline
  style="position:fixed; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:-1;"
>
  <source src="gradient.mp4" type="video/mp4">
</video>
```

### Option C: CSS background image

Export a PNG and apply it with CSS:

```css
body {
  background-image: url('gradient.png');
  background-size: cover;
  background-position: center;
}
```

## Performance tips

- For video backgrounds, keep clips under 5 MB by recording 4–6 seconds at 1080p
- Use `playsinline muted` on the `<video>` tag for autoplay to work on mobile iOS
- The exported HTML file uses WebGL — it is GPU-accelerated and runs efficiently in modern browsers

## Related

- [Gradient video background](/guides/gradient-video-background)
- [Embed a gradient in your website](/guides/embed-in-website)
- [Download & export formats](/guides/download-export)
