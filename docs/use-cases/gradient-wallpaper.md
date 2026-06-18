---
title: Gradient Wallpaper Generator — Create Custom Desktop and Mobile Wallpapers
description: Use GradLab as a free gradient wallpaper generator. Export high-resolution gradient wallpapers for desktop, MacBook, iPhone, and Android at any custom size.
head:
  - - meta
    - name: keywords
      content: gradient wallpaper generator, desktop wallpaper gradient, 4K gradient wallpaper, iPhone wallpaper gradient, gradient background wallpaper, custom gradient wallpaper
---

# Gradient Wallpaper Generator

GradLab exports gradient images at any resolution, making it a capable gradient wallpaper generator for desktop computers, laptops, phones, and tablets. Every export renders at a minimum of 2× resolution for sharp display on Retina and HiDPI screens.

## Common wallpaper dimensions

Set the canvas width and height in GradLab to match your screen:

| Device | Resolution |
|--------|-----------|
| MacBook Pro 14" | 3024 × 1964 |
| MacBook Pro 16" | 3456 × 2234 |
| iMac 27" | 5120 × 2880 |
| Desktop 4K | 3840 × 2160 |
| Desktop 1440p | 2560 × 1440 |
| Desktop 1080p | 1920 × 1080 |
| iPhone 15 Pro | 1179 × 2556 |
| iPhone 15 | 1170 × 2532 |
| iPad Pro 12.9" | 2048 × 2732 |
| Android (standard) | 1080 × 2400 |

If your exact resolution is not listed, check **System Settings → Displays** (macOS) or **Settings → Display** (Windows / Android).

## Exporting a wallpaper

1. Open [GradLab](https://gradlab.app)
2. Enter your screen resolution in the **Canvas** W and H fields
3. Design your gradient
4. Click **Download Frame**

The exported PNG renders at the canvas size times the device pixel ratio. On a Retina Mac, GradLab renders at 2× — a 1920 × 1080 canvas exports at 3840 × 2160, which is native 4K resolution.

::: tip
For the sharpest result, set the canvas to exactly half your Retina screen resolution. GradLab doubles it on export.
:::

## Design tips for wallpapers

**Subtlety works better than intensity.** A desktop wallpaper sits behind all your open windows. A very colorful or high-contrast gradient can make text on your desktop or in apps harder to read. Aim for colors that are harmonious and not too saturated.

**Slow speed, large zoom.** Set **Speed** to 0.1–0.2 and **Zoom** to 1.5–2.0. This produces broad, soft color regions that look good as a static background and animate gently if you choose to use the live HTML version.

**Match your system colors.** On macOS, match the gradient to your accent color for a cohesive desktop. On Windows, match the system highlight color.

**Add grain for depth.** A low Film Grain value (0.1–0.15) adds subtle texture that makes the gradient feel less artificial on large screens.

## Animated wallpapers

For an animated gradient wallpaper:

- **macOS:** Use apps like [Plash](https://sindresorhus.com/plash) to set a website (or locally-hosted HTML file) as your desktop background. Export the gradient HTML from GradLab and point Plash to it.
- **Windows:** Use [Lively Wallpaper](https://www.rocksdanister.com/lively/) (free, open source) to set an HTML file as a live wallpaper.
- **Android:** Some launchers (e.g. KLWP) support video loops — export an MP4 from GradLab and set it as a live wallpaper.
- **iOS / iPadOS:** Live wallpapers on iOS are limited to Apple's built-in options. Use a static PNG for iPhone and iPad.

## Related

- [Download & export formats](/guides/download-export)
- [Use cases: social media](/use-cases/social-media)
- [Use cases: UI & presentations](/use-cases/ui-presentations)
