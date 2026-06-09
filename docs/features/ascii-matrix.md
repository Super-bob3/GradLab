---
title: ASCII Matrix
description: Layer an interactive ASCII character grid over the gradient — with heatmap decay, mouse interaction, custom charsets, and independent blend control.
---

# ASCII Matrix

The ASCII Matrix renders a full-canvas grid of characters over the gradient layer. Characters respond to mouse proximity in real time, creating a dynamic, interactive typographic texture. The matrix runs on a separate canvas layer composited over the WebGL output.

## Character Sets

| Charset | Characters | Feel |
|---------|-----------|------|
| **Code** | A scrolling code snippet | Technical, developer aesthetic |
| **Standard** | `@%#*+=-:. ` | Classic ASCII brightness mapping |
| **Blocks** | `██▓▒░ ` | Chunky, graphic block shading |
| **Detailed** | Full 70-character luminance ramp | Maximum tonal detail |
| **Minimal** | `·■ ` | Ultra-sparse, geometric |
| **Binary** | `01` | Data / cyberpunk feel |
| **Custom** | Your text | Brand name, keyword, any string |

### Custom Charset

Enter any text in the custom field — a brand name, a phrase, a single repeated character — and the matrix tiles it across the canvas. Combined with a large font size, this embeds text as texture.

## Mouse Interaction

| Parameter | Effect |
|-----------|--------|
| **Radius** | Size of the interaction zone around the cursor |
| **Decay** | How quickly characters return to resting state after the cursor leaves |
| **Smooth** | Easing on the interaction response |
| **Gravity** | Pulls activated characters toward the cursor; at 0 characters stay in place |

## Display Controls

| Parameter | Effect |
|-----------|--------|
| **Size** | Font size of each character cell |
| **Spacing** | Line-height multiplier |
| **Font** | Selects from a set of monospaced typefaces |
| **Color** | The fill color of the characters |
| **Blend Mode** | How the character layer composites over the gradient |

## Blend Modes

| Blend Mode | Effect |
|------------|--------|
| **Overlay** | Characters take on the gradient's hue — natural integration |
| **Screen** | Characters always lighten — works well on dark gradients |
| **Multiply** | Characters always darken — works well on light gradients |
| **Normal** | Flat character color over the gradient, no blending |

## Interaction Mode

| Mode | Description |
|------|-------------|
| **Heatmap Decay** | Characters brighten on cursor contact, then fade back |
| **Dynamic Background** | Full grid animates continuously; cursor shifts character density |

::: tip
For landing page hero sections, try **Code** charset at medium size with **Overlay** blend and 20% decay — it creates a living background texture that doesn't compete with foreground text.
:::
