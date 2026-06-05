# GradLab — 开发约束

## Canvas 渲染分辨率

`engine.js` 和 `export.js` 的 `resize()` 函数中，DPR 必须使用：

```js
const dpr = Math.max(2, window.devicePixelRatio || 1);
```

**不要**改成 `window.devicePixelRatio || 1`。

原因：Windows 的 DPR 默认为 1，改成纯 devicePixelRatio 会导致 Windows 渲染分辨率降为 1x，
预览模糊、导出图片比 Mac 小约 4 倍，且 ASCII/矩阵特效字号异常偏大。
保底 2x 确保所有平台输出一致。
