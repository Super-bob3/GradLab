---
title: FAQ
description: Common questions about GradLab — browser support, export quality, performance, and use cases.
---

# FAQ

## General

**Is GradLab free to use?**

Yes. GradLab is free and runs entirely in your browser with no account required.

**Do I need to install anything?**

No. GradLab runs as a web application — open the URL and start creating. No plugins, no desktop app, no dependencies.

**Which browsers are supported?**

Any browser with WebGL support: Chrome, Firefox, Safari, and Edge on desktop and mobile. For video recording, Chrome and Edge offer the best codec support (MP4/H.264). Safari exports WebM as fallback.

**Is my work saved automatically?**

GradLab is session-based — your settings persist while the page is open. To preserve a configuration, use **Export Code** to save a self-contained HTML file with all parameters embedded.

---

## Export & Quality

**What resolution are exported PNGs?**

PNG exports match the WebGL render buffer, which renders at `Math.max(2, devicePixelRatio)`. On a standard display, a maximized browser window produces an export roughly twice the screen resolution. On Retina/HiDPI displays, resolution is higher still.

**Can I export a transparent PNG?**

Not currently. The canvas renders against a solid background. Transparency can be added in any image editor using the corner-radius alpha channel as a starting mask.

**My video export is WebM, not MP4 — why?**

MP4 (H.264) encoding requires MediaRecorder H.264 support, which varies by browser. Safari and some Firefox configurations fall back to WebM (VP8). Both are widely compatible; WebM plays natively in all modern browsers.

---

## Performance

**The animation is stuttering — what should I do?**

Try reducing the **Speed** slider and disabling the **ASCII Matrix** layer if enabled — the character grid is CPU-intensive at large sizes. Closing other GPU-heavy browser tabs can also help.

**Does GradLab work on mobile?**

Yes. The WebGL engine runs on mobile browsers. Video recording is not available on iOS due to MediaRecorder API limitations. PNG export and HTML export work on all platforms.

---

## Use Cases

**Can I use GradLab outputs in commercial projects?**

Yes. Exports are yours to use. There are no watermarks or usage restrictions on exported PNG, video, or HTML files.

**How do I embed the gradient in my website?**

Use **Export Code** to get a self-contained HTML file, then embed it via `<iframe>` in your page. Set `width: 100%` and `height: 100%` on the iframe for a full-bleed background.

**Can I use the exported gradient as a video background?**

Yes. Export a short MP4 or WebM clip with **Ping-pong Loop** enabled, then use it as an HTML5 `<video>` with `autoplay loop muted playsinline`. This is the most performant approach for animated backgrounds in production websites.
