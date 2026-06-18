---
title: 如何制作动态渐变背景
description: 使用 GradLab 免费在线渐变生成器，一步步创建适合网站的动态渐变背景，并导出为 PNG、MP4 或 HTML。
head:
  - - meta
    - name: keywords
      content: 动态渐变背景, 渐变背景生成器, 网站动态背景, 渐变动画, 在线渐变生成
---

# 如何制作动态渐变背景

动态渐变背景能为网站、应用或演示文稿带来深度和律动感。本指南介绍如何用 GradLab 制作渐变背景，并将其应用到项目中。

## 第一步：打开 GradLab

访问 [gradlab.app](https://gradlab.app)——无需注册，无需安装，打开即可使用，画布会立即开始动画。

## 第二步：选择配色

在右侧面板中，选择预设主题或自定义配色：

- 点击色块可打开颜色编辑器
- 使用**上传图片**功能从照片中提取调色板
- 使用**+ 添加颜色**和**− 颜色**增减颜色数量

对于动态背景，3–5 种颜色效果最佳，颜色过多会产生视觉噪点。

## 第三步：调整动画

使用**形态与流动**分区的滑块控制运动效果：

| 滑块 | 作用 |
|------|------|
| **Speed（速度）** | 渐变流动的快慢 |
| **Liquid（流体感）** | 流动的有机度 |
| **Zoom（缩放）** | 色块的大小 |

用于背景时，建议将 Speed 设置在 0.3 以下，Liquid 约为 0.5，效果更为克制。

## 第四步：设置画布尺寸

在**画布**区域填写目标尺寸：

- 全高清：1920 × 1080
- 方形：1080 × 1080
- 竖版：1080 × 1920

## 第五步：导出

根据使用场景选择导出格式：

**PNG 静图**——适用于演示文稿、社交媒体或邮件头图。点击**下载当前帧**。

**MP4 视频循环**——适用于网站 Hero 区背景。启用 **Ping-pong Loop**，点击**录制 MP4**，录制 4–6 秒后停止，可获得无缝循环视频。

**独立 HTML 文件**——适用于直接嵌入网页。点击**导出代码**，下载包含完整动画的 `.html` 文件。

## 将背景嵌入网站

### 方案 A：使用 iframe 嵌入 HTML 文件

```html
<iframe
  src="gradient.html"
  style="position:fixed; top:0; left:0; width:100%; height:100%; border:none; z-index:-1;"
></iframe>
```

### 方案 B：视频背景

```html
<video
  autoplay loop muted playsinline
  style="position:fixed; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:-1;"
>
  <source src="gradient.mp4" type="video/mp4">
</video>
```

### 方案 C：CSS 背景图片

导出 PNG，通过 CSS 应用：

```css
body {
  background-image: url('gradient.png');
  background-size: cover;
  background-position: center;
}
```

## 性能建议

- 视频背景建议控制在 5 MB 以内，录制 4–6 秒 1080p 通常可达到此目标
- `<video>` 标签必须包含 `muted` 和 `playsinline` 属性，才能在 iOS 上自动播放
- 导出的 HTML 文件使用 WebGL，运行在 GPU 上，在现代浏览器中性能开销极低

## 相关内容

- [渐变视频背景](/zh/guides/gradient-video-background)
- [嵌入网站](/zh/guides/embed-in-website)
- [下载与导出格式](/zh/guides/download-export)
