---
title: Export
description: Export your gradient as a high-resolution PNG, an MP4 or WebM video loop, or a self-contained HTML file ready to embed anywhere.
---

# Export

GradLab offers three export formats. All exports capture the full composited output — gradient, halftone, ASCII matrix, and grain — at native render resolution (minimum 2× device pixel ratio).

## PNG Screenshot

**Download Frame** captures the current canvas state as a PNG.

- Resolution matches the WebGL render buffer — minimum 2× device pixel ratio
- Includes all active layers: gradient, halftone, ASCII matrix, and film grain
- Corner radius embedded in PNG alpha channel if enabled
- Instant — no processing delay

**Best for:** static assets for presentations, social media, UI mockups, or print.

## Video Recording

**Record MP4** captures a live video of the animation.

1. Click **Record MP4** to begin — the button shows an elapsed timer
2. Click **Stop** when done
3. GradLab encodes the captured frames and downloads the file

| Setting | Options |
|---------|---------|
| **Format** | MP4 (H.264) when supported; WebM (VP8) as fallback |
| **Ping-pong Loop** | Plays forward then reverses — produces a seamless infinite loop |

::: info
Enable **Ping-pong Loop** before starting the recording if you intend to use the video as a looping background. The resulting file loops without a visible cut point.
:::

**Tips for clean recordings:**
- Record 3–8 seconds and use ping-pong loop — keeps file sizes small
- Lower **Speed** before recording for a slower, more atmospheric loop
- Disable **3D Tilt** — it is screen-relative and produces inconsistent motion in exports

## HTML Code Export

**Export Code** produces a fully self-contained `.html` file containing:

- The complete WebGL shader source
- All current parameter values embedded as uniforms
- The canvas rendering loop
- No external dependencies — runs in any browser offline

The resulting HTML can be:
- Dropped into an `<iframe>` in any web project
- Used as a standalone full-screen background
- Opened directly as a file in any browser
- Shared as a single-file artifact with all visual state preserved

::: tip
The exported HTML is a snapshot of your current settings. Adjust the gradient and export again to get updated output — there is no live link between the HTML file and the app.
:::

## Resolution Notes

GradLab renders at `Math.max(2, devicePixelRatio)`, guaranteeing consistent output across all platforms:

- **Mac (Retina):** 2× or 3× depending on display
- **Windows (standard DPI):** renders at 2× regardless of OS DPI setting
