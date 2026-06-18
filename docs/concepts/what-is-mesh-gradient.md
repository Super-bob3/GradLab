---
title: What Is a Mesh Gradient?
description: A mesh gradient is a type of gradient where colors blend from multiple points in two dimensions, creating organic, photorealistic color transitions. Learn how they work and how to create one online.
head:
  - - meta
    - name: keywords
      content: what is mesh gradient, mesh gradient, mesh gradient generator, mesh gradient online, mesh gradient design, gradient mesh
---

# What Is a Mesh Gradient?

A mesh gradient is a type of gradient where colors flow from multiple source points distributed across a surface, blending into each other in two dimensions. Unlike a linear or radial gradient — which blends along one axis from a fixed point — a mesh gradient produces organic, multi-directional color transitions that feel natural and three-dimensional.

## How mesh gradients work

In a standard CSS gradient, you define a direction and a list of color stops along a single axis. The result is predictable but limited — colors can only transition linearly or radially from one edge or center point.

A mesh gradient adds a second dimension. Colors are placed at nodes across the entire surface, and the space between nodes is filled by smoothly interpolating between neighboring colors. The result looks like light falling on a curved, translucent surface — soft, deep, and constantly shifting.

GradLab generates mesh gradients using a **WebGL shader** — code that runs directly on the GPU. The shader computes color blending at every pixel in real time, which is why the gradient can animate fluidly without any performance cost.

## Why mesh gradients look different

The visual difference comes from two things:

**Multi-point color placement.** Linear gradients flow between two edges. Mesh gradients flow between many points simultaneously, which creates more complex color interactions — colors meeting at angles, blending in pockets, wrapping around implied curves.

**Perceptual color blending.** GradLab blends colors in the [OKLab color space](/concepts/oklab-color-space), which follows how human vision perceives transitions. This prevents the muddy grays that appear when blending complementary colors in RGB, and keeps transitions looking vivid throughout.

## Mesh gradient vs CSS gradient

| | CSS gradient | Mesh gradient |
|---|---|---|
| Direction | One axis | Multi-directional |
| Color sources | 2+ stops on a line | Many points across the surface |
| Look | Clean, geometric | Organic, photorealistic |
| Animation | CSS transitions (limited) | Real-time GPU shader |
| Browser support | Native | Requires WebGL |

See [Mesh gradient vs CSS gradient](/concepts/mesh-gradient-vs-css-gradient) for a full comparison.

## Where mesh gradients are used

- **App UI backgrounds** — iOS and macOS use mesh-style gradients throughout system UI
- **Website hero sections** — popular in SaaS and product landing pages
- **Social media graphics** — eye-catching backgrounds for posts and stories
- **Presentations** — slide backgrounds that feel premium without complex design work
- **Wallpapers** — abstract art that adapts to any screen

## How to create a mesh gradient online

[GradLab](https://gradlab.app) is a free online mesh gradient generator. Open it in any browser, adjust colors and motion parameters, and export the result as a PNG image, MP4 video, or self-contained HTML file — no sign-up required.

## Related

- [Mesh gradient vs CSS gradient](/concepts/mesh-gradient-vs-css-gradient)
- [OKLab color space](/concepts/oklab-color-space)
- [Animated gradient background guide](/guides/animated-gradient-background)
