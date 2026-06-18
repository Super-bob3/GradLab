---
title: OKLab 色彩空间——为什么 GradLab 的颜色混合与众不同
description: OKLab 是为平滑、精准色彩混合而设计的感知均匀色彩空间。了解 GradLab 为何选择 OKLab，以及它对渐变效果有何影响。
head:
  - - meta
    - name: keywords
      content: OKLab色彩空间, OKLab渐变, 感知色彩混合, OKLab与RGB, 颜色插值, 渐变色彩科学
---

# OKLab 色彩空间

GradLab 在 OKLab 色彩空间中混合颜色。这是一个经过深思熟虑的选择，影响着引擎生成的每一个渐变的质量。本页解释 OKLab 是什么、为什么它对渐变很重要，以及与 RGB 工具相比你会看到什么不同。

## RGB 渐变的问题

大多数图形软件在 RGB 中插值渐变颜色——独立混合红、绿、蓝三个通道。这在数学上很简单，但视觉上是错误的。

人眼对亮度和颜色的感知是非线性的。鲜艳的黄色和深紫色在 RGB 中的中间点落在一个比两端都更暗、更不饱和的灰色上。过渡看起来会下沉，产生设计师所说的"泥灰中间色"问题。

用 CSS 试一下：
```css
/* 这个过渡会经过一个褪色的灰色 */
background: linear-gradient(to right, #f5e642, #7c3aed);
```

渐变在两端看起来不错，但中间点出乎意料地暗淡。

## OKLab 的不同之处

OKLab 是 Björn Ottosson 于 2020 年设计的色彩空间，建立在**感知均匀性**原则上——等量的数值变化产生等量的视觉色彩变化（以人眼感知衡量）。

实际效果：
- 两种鲜艳颜色的混合在整个过渡过程中保持鲜艳
- 亮度从头到尾保持一致
- 互补色通过色相混合，而非通过灰色混合

同样的黄色到紫色过渡，在 OKLab 中会经过明亮的粉色和紫色，而非泥灰色。

## OKLab 与其他色彩空间对比

| 色彩空间 | 感知均匀 | 应用场景 |
|---------|---------|---------|
| RGB | 否 | 大多数图像软件 |
| HSL | 否 | CSS 颜色函数 |
| Lab | 近似 | Photoshop、色彩科学 |
| OKLab | 是 | GradLab、CSS Color Level 4 |

CSS Color Level 4 引入了 `oklch()` 和 `oklab()` 颜色函数，正是因为网页设计师在 RGB 渐变中遭遇了同样的质量瓶颈。

## 对 GradLab 意味着什么

GradLab 中的每次颜色混合都在 OKLab 空间中完成，然后再转换回 RGB 用于显示。实际效果：

**饱和度在整个渐变中保持。** 即使在差异很大的两种色相中间，颜色依然鲜艳。

**过渡感觉自然。** 渐变看起来不像是计算出来的插值，更像是光线穿过彩色表面。

**多色渐变保持连贯。** 用 OKLab 混合三种或更多颜色时，每对颜色之间的过渡在视觉亮度和饱和度上保持一致。

## 混合偏移与混合锐度控制

GradLab 在面板中提供两个与 OKLab 相关的滑块：

- **Blend Bias（混合偏移）** — 将混合权重偏向某一颜色，产生不对称的过渡
- **Blend Sharpness（混合锐度）** — 控制颜色过渡的突变程度；数值越高，颜色区域边界越清晰

这些控制在 OKLab 空间中运作，因此调整时始终能产生感知一致的结果。

## 延伸阅读

- [Björn Ottosson 的原始 OKLab 文章](https://bottosson.github.io/posts/oklab/)（英文）
- CSS Color Level 4 — `oklch()` 和 `oklab()` 现已在所有主流浏览器中原生支持

## 相关内容

- [什么是网格渐变？](/zh/concepts/what-is-mesh-gradient)
- [网格渐变与 CSS 渐变](/zh/concepts/mesh-gradient-vs-css-gradient)
- [调色板](/zh/features/palette)
