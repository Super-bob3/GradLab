---
title: Palette
description: Build a color palette of up to 8 colors with OKLab blending, drag-to-reorder, and automatic extraction from any image.
---

# Palette

The Palette panel is the foundation of every gradient. GradLab blends your chosen colors across the canvas using the **OKLab perceptual color space**, which preserves luminance balance and saturation at every point — avoiding the muddy midtones common in standard RGB blending.

## Adding and Removing Colors

- Click **+** to add a new color (maximum 8)
- Click the **×** on any swatch to remove it (minimum 2)
- Colors render in the order they appear in the panel

## Reordering

Drag any color swatch left or right to change its position in the blend sequence. The canvas updates in real time as you drag.

## Color Picker

Click a swatch to open the color picker. You can:

- Interact with the **hue/saturation/lightness** gradient field
- Type a **hex code** directly into the input field
- The picker remembers the previous color if you cancel

## Blend Mode

The **Blend Mode** toggle switches between two color interpolation methods:

| Mode | Description |
|------|-------------|
| **OKLab** | Perceptually uniform — smooth, vivid blends across all hue pairs |
| **RGB** | Standard linear interpolation — may produce dull midtones on complementary pairs |

OKLab is the default and recommended setting for most use cases.

## Blend Bias & Sharpness

- **Blend Bias** shifts the interpolation midpoint — push toward 0 to weight toward your first color, toward 100 to weight toward the last
- **Blend Sharpness** controls how abruptly colors transition; higher values produce more distinct color bands

## Image Color Extraction

Click the **image icon** next to the color list to upload a photo. GradLab samples the dominant colors and populates the palette automatically.

::: tip
Try uploading a sunset photo or a design reference — the extracted palette often produces gradient starting points that would take minutes to build manually.
:::
