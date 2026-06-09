---
title: Halftone
description: Apply dithered halftone patterns over your gradient using 4 dither matrices and 6 dot shapes for print-ready and retro aesthetics.
---

# Halftone

The Halftone layer converts the continuous gradient into a pattern of discrete dots or shapes, mimicking traditional print halftone screens. It renders as a GPU compositing pass, giving you full control over density, shape, and contrast without affecting the underlying animation.

## Dither Matrix

| Matrix | Character |
|--------|-----------|
| **Random** | Stochastic noise — irregular, organic dot placement with no visible grid |
| **2×2 Ordered** | A 2-cell Bayer matrix — visible grid structure, retro digital feel |
| **4×4 Ordered** | A 16-step Bayer matrix — smoother tonal range with a classic halftone grid |
| **8×8 Ordered** | High-precision Bayer matrix — fine dot control, closest to commercial print halftone |

## Dot Shape

| Shape | Description |
|-------|-------------|
| **Circle** | Classic halftone dot — the most common print and editorial look |
| **Square** | Hard-edged blocks — bold, graphic, pixel-art adjacent |
| **Diamond** | 45° rotated square — produces a distinctive angular grid |
| **Line** | Parallel stripes — resembles mezzotint or engraving screens |
| **Cross** | Star-shaped dots — decorative, maximalist texture |
| **Ellipse** | Horizontally stretched dots — softer than circle, more directional |

## Size

Controls the diameter of each dot cell. Smaller values produce fine, high-frequency halftone screens; larger values produce bold, chunky dots.

## Contrast

Shifts the luminance threshold at which dots appear. Increase contrast to push dots toward full-on or full-off; decrease to preserve gradient tonal nuance.

::: tip
Combine **8×8 Ordered** dither with **Circle** shape and low contrast to get the closest result to traditional offset print halftone. Pair with a two-color palette for a spot-color print aesthetic.
:::

## Use Cases

- **Editorial design** — halftone backgrounds for magazine-style layouts
- **Risograph / screen print** — simulate ink-on-paper printing aesthetics
- **Brand visuals** — add texture and depth to gradient backgrounds
- **Retro UI** — combine with a limited palette for a nostalgic digital feel
