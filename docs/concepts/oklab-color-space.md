---
title: OKLab Color Space — Why GradLab Blends Colors Differently
description: OKLab is a perceptually uniform color space designed for smooth, accurate color blending. Learn why GradLab uses OKLab instead of RGB, and what difference it makes to your gradients.
head:
  - - meta
    - name: keywords
      content: OKLab color space, OKLab gradient, perceptual color blending, OKLab vs RGB, color interpolation, gradient color science
---

# OKLab Color Space

GradLab blends colors in the OKLab color space. This is a deliberate choice that affects the quality of every gradient the engine produces. This page explains what OKLab is, why it matters for gradients, and what you will see differently compared to RGB-based tools.

## The problem with RGB gradients

Most graphics software interpolates gradient colors in RGB — it blends the red, green, and blue channels independently. This is mathematically simple but visually wrong.

The human eye does not perceive brightness and color linearly. A halfway point between a bright yellow and a deep violet in RGB lands on a gray that looks darker and less saturated than either endpoint. The transition appears to dip, producing what designers call the "muddy middle" problem.

Try it in CSS:
```css
/* This transition passes through a washed-out gray */
background: linear-gradient(to right, #f5e642, #7c3aed);
```

The gradient looks fine at the endpoints but the midpoint is unexpectedly dull.

## What OKLab does differently

OKLab (pronounced "okay-lab") is a color space designed by Björn Ottosson in 2020. It is built around the principle of **perceptual uniformity** — equal numerical steps produce equal-looking changes in color, as measured by human vision.

In practice this means:
- Blending two vibrant colors stays vibrant throughout the transition
- Brightness remains consistent from one end to the other
- Complementary colors blend through hues rather than through gray

The same yellow-to-violet transition in OKLab passes through bright pinks and purples rather than a muddy gray.

## OKLab vs other color spaces

| Color space | Perceptually uniform | Used in |
|-------------|---------------------|---------|
| RGB | No | Most image software |
| HSL | No | CSS color functions |
| Lab | Approximately | Photoshop, color science |
| OKLab | Yes | GradLab, CSS Color Level 4 |

CSS Color Level 4 introduced `oklch()` and `oklab()` color functions precisely because web designers were hitting the same quality ceiling with RGB gradients.

## What this means in GradLab

Every color blend in GradLab happens in OKLab space before being converted back to RGB for display. The practical results:

**Saturation is preserved** across the entire gradient. Colors remain vivid even at the midpoints between very different hues.

**Transitions feel natural.** The gradient looks less like a calculated interpolation and more like light passing through a colored surface.

**Multi-color gradients stay coherent.** When blending three or more colors with OKLab, the transitions between each pair remain consistent in apparent brightness and saturation.

## Blend Bias and Blend Sharpness controls

GradLab exposes two OKLab-related sliders in the panel:

- **Blend Bias** — shifts the weight of blending toward one color or another, giving you asymmetric transitions
- **Blend Sharpness** — controls how abruptly colors transition; higher values create more defined color regions

These controls operate in OKLab space, so adjusting them always produces perceptually consistent results.

## Further reading

- [Björn Ottosson's original OKLab article](https://bottosson.github.io/posts/oklab/)
- CSS Color Level 4 — `oklch()` and `oklab()` are now supported natively in all major browsers

## Related

- [What is a mesh gradient?](/concepts/what-is-mesh-gradient)
- [Mesh gradient vs CSS gradient](/concepts/mesh-gradient-vs-css-gradient)
- [Palette](/features/palette)
