---
title: 如何将渐变嵌入网站
description: 将 GradLab 导出的动态渐变背景嵌入任何网站——支持纯 HTML、React、Next.js、Webflow 等各类框架。
head:
  - - meta
    - name: keywords
      content: 渐变嵌入网站, 动态渐变HTML, React渐变背景, Next.js渐变, iframe渐变背景, HTML动态背景
---

# 如何将渐变嵌入网站

GradLab 的**导出代码**功能生成一个独立的 HTML 文件，可在任何浏览器中运行完整的渐变动画。本页介绍如何在不同框架和平台中嵌入该文件。

## 第一步：导出渐变

1. 在 [GradLab](https://gradlab.app) 中完成渐变设计
2. 点击**导出代码**
3. 点击**下载**保存 `.html` 文件
4. 将文件上传到服务器或 CDN，与其他静态资源一同托管

## 方式一：iframe（通用方案）

最简单的方式——适用于纯 HTML、任何 CMS、Webflow、Framer、Notion 以及大多数无代码工具。

```html
<iframe
  src="/assets/gradient.html"
  style="position:fixed; top:0; left:0; width:100%; height:100%; border:none; z-index:-1; pointer-events:none;"
  title="动态渐变背景"
></iframe>
```

如需将渐变作为独立区块而非全屏背景，移除 `position:fixed` 并自定义尺寸即可。

## 方式二：React / Next.js

```jsx
export default function GradientBackground() {
  return (
    <iframe
      src="/gradient.html"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      title="动态渐变背景"
    />
  )
}
```

将导出的 `gradient.html` 放入 `/public` 目录，然后在布局或页面文件中引入该组件。

## 方式三：CSS 背景图片（静态版本）

如不需要动画，从 GradLab 导出 PNG，通过 CSS 应用：

```css
.hero {
  background-image: url('/assets/gradient.png');
  background-size: cover;
  background-position: center;
}
```

## 方式四：视频背景

从 GradLab 导出 MP4，使用 HTML5 video 元素：

```html
<video
  autoplay loop muted playsinline
  style="position:fixed; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:-1;"
>
  <source src="/assets/gradient.mp4" type="video/mp4">
</video>
```

`muted` 和 `playsinline` 属性是 iOS Safari 自动播放的必要条件。

## Webflow

1. 在页面中添加 **Embed** 元素
2. 粘贴方式一的 iframe 代码
3. 将导出的 `.html` 文件上传到 CDN（如 Cloudflare R2、AWS S3 或任意静态托管服务），更新 `src` 路径

## Framer

1. 在组件面板中使用 **HTML** 组件
2. 将导出的 `.html` 文件完整内容粘贴到编辑器中

## 性能注意事项

- 导出的 HTML 使用 WebGL，运行在 GPU 上，在现代浏览器中效率很高
- 移动端 iOS 和 Android 均支持硬件加速，动画流畅
- 请在 iframe 或 video 元素上设置 `pointer-events: none`，避免遮挡上层内容的点击事件

## 相关内容

- [下载与导出格式](/zh/guides/download-export)
- [渐变视频背景](/zh/guides/gradient-video-background)
- [动态渐变背景](/zh/guides/animated-gradient-background)
