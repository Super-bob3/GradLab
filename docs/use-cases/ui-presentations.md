---
title: Gradient Backgrounds for UI Design and Presentations
description: Use GradLab to create gradient backgrounds for app UI, Figma mockups, slide decks, and design presentations. Export as PNG or animated HTML.
head:
  - - meta
    - name: keywords
      content: gradient UI design, gradient for Figma, presentation background gradient, gradient slide design, app background gradient, gradient for mockup
---

# Gradient Backgrounds for UI & Presentations

Gradient backgrounds elevate the perceived quality of app UI, design mockups, and presentation slides. GradLab generates mesh gradients at any resolution, ready to drop directly into Figma, Sketch, PowerPoint, Keynote, or any web application.

## Using gradients in Figma

### As a frame background

1. In GradLab, set the canvas to your frame size (e.g. 1440 × 900 for desktop, 375 × 812 for mobile)
2. Click **Download Frame** to export a PNG
3. In Figma, drag the PNG onto your canvas and set it to **Fill** within the frame

### As a reusable style

Export a 1× PNG, import it into Figma's Assets, and use it as a fill across multiple frames. For animated prototypes, export the HTML file and link to it from your prototype using an embedded iframe component.

### Color matching

Use **Upload Image** in GradLab to extract colors from a screenshot of your existing UI. This generates a gradient that harmonizes with your current color system.

## Presentation slides

### Keynote and PowerPoint

1. Export a PNG at your slide dimensions:
   - Standard: 1024 × 768
   - Widescreen: 1920 × 1080
2. In your presentation app, set the exported PNG as the slide background image

For animated presentations, export the gradient as an MP4 and insert it as a video slide background:
- **Keynote:** Insert → Choose → select the MP4, then set to loop
- **PowerPoint:** Insert → Video → format as behind-content, loop playback

### Google Slides

Export a PNG and upload it via Slide → Change background → Choose image.

## App UI backgrounds

GradLab is well suited to generating backgrounds for:
- **Onboarding screens** — a soft animated gradient behind illustration and copy
- **Empty states** — a gradient fills the screen when there is no content to display
- **Card and modal backgrounds** — a subtle gradient adds depth to surface components
- **Loading screens** — an animated gradient provides visual activity while content loads

For live app integration, export the HTML file and embed it via `<iframe>`. See [Embed a gradient in your website](/guides/embed-in-website) for the full integration guide.

## Halftone and grain for design assets

The **Halftone** and **Film Grain** layers add print-like texture that is especially effective in design contexts. A fine halftone dot at low contrast reads as a paper or screen-printed texture — common in brand identity work and editorial design.

## Keeping the gradient subtle

For backgrounds that support content (rather than being the content), keep these settings low:
- **Speed** under 0.2 — slow, nearly imperceptible movement
- **Film Grain** at 0.1–0.15 — texture without distraction
- **Zoom** higher (1.5–2×) — larger color blobs create softer, less patterned backgrounds

## Related

- [Animated gradient background guide](/guides/animated-gradient-background)
- [Embed a gradient in your website](/guides/embed-in-website)
- [Use cases: social media](/use-cases/social-media)
