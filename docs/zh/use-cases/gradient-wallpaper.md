---
title: 渐变壁纸生成器——制作桌面和手机自定义壁纸
description: 使用 GradLab 免费渐变壁纸生成器，导出适合 Mac、Windows、iPhone 和 Android 的高分辨率渐变壁纸。
head:
  - - meta
    - name: keywords
      content: 渐变壁纸生成器, 桌面壁纸渐变, 4K渐变壁纸, iPhone壁纸渐变, 渐变背景壁纸, 自定义渐变壁纸
---

# 渐变壁纸生成器

GradLab 可以任意分辨率导出渐变图片，可用作电脑、手机和平板的高分辨率渐变壁纸。所有导出均以最低 2× 分辨率渲染，在 Retina 和 HiDPI 屏幕上显示清晰锐利。

## 常见壁纸尺寸

在 GradLab 中将画布宽高设置为你的屏幕分辨率：

| 设备 | 分辨率 |
|------|--------|
| MacBook Pro 14" | 3024 × 1964 |
| MacBook Pro 16" | 3456 × 2234 |
| iMac 27" | 5120 × 2880 |
| 4K 显示器 | 3840 × 2160 |
| 2K 显示器 | 2560 × 1440 |
| 1080p 显示器 | 1920 × 1080 |
| iPhone 15 Pro | 1179 × 2556 |
| iPhone 15 | 1170 × 2532 |
| iPad Pro 12.9" | 2048 × 2732 |
| Android（标准） | 1080 × 2400 |

如果你的分辨率不在列表中，可以在 macOS 的**系统设置 → 显示器**或 Windows / Android 的**设置 → 显示**中查看。

## 导出壁纸

1. 打开 [GradLab](https://gradlab.app)
2. 在**画布** W 和 H 字段填入你的屏幕分辨率
3. 设计渐变
4. 点击**下载当前帧**

导出的 PNG 分辨率为画布尺寸乘以设备像素比。在 Retina Mac 上，GradLab 以 2× 渲染——1920 × 1080 的画布会导出为 3840 × 2160，即原生 4K 分辨率。

::: tip
为获得最清晰的效果，将画布设置为 Retina 屏幕分辨率的一半，GradLab 导出时会自动翻倍。
:::

## 壁纸设计技巧

**克制胜于浓烈。** 桌面壁纸在所有打开的窗口后面。过于鲜艳或高对比度的渐变会让桌面或应用中的文字难以阅读。目标是和谐且饱和度不过高的配色。

**低速度，大缩放。** 将 **Speed** 设置为 0.1–0.2，**Zoom** 设置为 1.5–2.0。这会产生宽阔、柔和的色块区域，作为静态背景效果好，如果使用动态 HTML 版本也能温和地动起来。

**匹配系统颜色。** 在 macOS 上，将渐变与系统强调色搭配以获得连贯的桌面观感。

**添加颗粒增加深度。** 低胶片颗粒值（0.1–0.15）增添微妙质感，让渐变在大屏幕上显得不那么人工化。

## 动态壁纸

想使用动态渐变壁纸：

- **macOS：** 使用 [Plash](https://sindresorhus.com/plash)（免费）将网站或本地 HTML 文件设置为桌面背景。从 GradLab 导出渐变 HTML 并在 Plash 中指向它。
- **Windows：** 使用 [Lively Wallpaper](https://www.rocksdanister.com/lively/)（免费开源）将 HTML 文件设置为动态壁纸。
- **Android：** 部分桌面启动器（如 KLWP）支持视频循环——从 GradLab 导出 MP4 并设置为动态壁纸。
- **iOS / iPadOS：** iOS 动态壁纸限于苹果内置选项。iPhone 和 iPad 使用静态 PNG。

## 相关内容

- [下载与导出格式](/zh/guides/download-export)
- [使用场景：社交媒体](/zh/use-cases/social-media)
- [使用场景：UI 设计与演示文稿](/zh/use-cases/ui-presentations)
