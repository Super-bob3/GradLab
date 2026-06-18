---
title: 渐变视频背景——制作无缝循环渐变视频
description: 使用 GradLab 制作网站渐变视频背景。导出 MP4，用 HTML5 视频嵌入，并针对性能进行优化。
head:
  - - meta
    - name: keywords
      content: 渐变视频背景, 动态视频背景, 循环视频背景, 渐变背景视频, MP4渐变下载, 网站动态背景视频
---

# 渐变视频背景

渐变视频背景能为内容层添加流动的生命感。与 GIF 或 CSS 动画相比，GradLab 导出的视频循环体积更小、画质更高，且在所有设备上都能保持稳定的帧率。

## 在 GradLab 中制作视频

### 1. 设计渐变

打开 [GradLab](https://gradlab.app) 并设计渐变。用于视频背景时：

- 使用 3–4 种颜色，视觉更干净、专业
- 将 **Speed** 调低（0.1–0.3），营造沉静、环境感的氛围
- 开启**胶片颗粒**，增添电影质感

### 2. 设置画布尺寸

在画布字段中输入目标尺寸：

| 使用场景 | 尺寸 |
|----------|------|
| 桌面端全屏 | 1920 × 1080 |
| 方形（社交） | 1080 × 1080 |
| 竖版（Reels / 短视频）| 1080 × 1920 |
| 轻量级网页 Hero | 1280 × 720 |

### 3. 启用 Ping-pong Loop

录制前开启面板中的 **Ping-pong Loop**。该功能让动画正放后倒放，生成无剪切点的完美循环。

### 4. 录制并下载

1. 点击**录制 MP4**
2. 等待 4–8 秒（动画节奏缓慢时可适当延长）
3. 点击**停止录制**
4. `.mp4` 文件自动下载

::: info
Chrome 和 Edge 生成 MP4（H.264）；Safari 生成 WebM（VP8）。两种格式均可无缝循环，且兼容所有现代浏览器。
:::

## 嵌入视频背景

### 全页背景

```html
<div style="position:relative; min-height:100vh; overflow:hidden;">
  <video
    autoplay loop muted playsinline
    style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
           min-width:100%; min-height:100%; object-fit:cover; z-index:0;"
  >
    <source src="gradient.mp4" type="video/mp4">
  </video>

  <div style="position:relative; z-index:1;">
    <!-- 内容放这里 -->
  </div>
</div>
```

### 仅 Hero 区背景

```html
<section style="position:relative; height:80vh; overflow:hidden;">
  <video autoplay loop muted playsinline
    style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
    <source src="gradient.mp4" type="video/mp4">
  </video>
  <div style="position:relative; z-index:1; padding:4rem;">
    <h1>标题文案</h1>
  </div>
</section>
```

## 必要的视频属性

| 属性 | 作用 |
|------|------|
| `autoplay` | 立即开始播放 |
| `loop` | 无限循环 |
| `muted` | Chrome/Safari 自动播放的必要条件 |
| `playsinline` | iOS 必须，否则视频会全屏弹出 |

四个属性缺一不可，才能保证跨浏览器和设备的一致性。

## 性能建议

- **文件体积目标：** 网络使用时控制在 3–5 MB 以内
- **编码：** H.264 压缩效率高，5 秒 720p 视频通常不超过 2 MB
- **尊重用户偏好：** 使用 `@media (prefers-reduced-motion: reduce)` 将视频替换为静态 PNG

```css
@media (prefers-reduced-motion: reduce) {
  video { display: none; }
  .hero { background-image: url('gradient-fallback.png'); background-size: cover; }
}
```

## 相关内容

- [下载与导出格式](/zh/guides/download-export)
- [动态渐变背景](/zh/guides/animated-gradient-background)
- [嵌入网站](/zh/guides/embed-in-website)
