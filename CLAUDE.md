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

## 组件音效规则

**每新增一个可交互 UI 组件，必须同步在 `src/sound.js` 中匹配对应音效，并在组件初始化时调用。**

对应关系参考：

| 交互类型 | 调用 |
|---|---|
| 打开弹窗 / popover | `sound.open()` |
| 关闭弹窗 / popover | `sound.close()` |
| 普通按钮点击、链接 | `sound.tap()` |
| 开关 checkbox | `sound.toggle(checked)` |
| 下拉选择 select | `sound.select()` |
| 滑块拖动 | `sound.tick()` |
| 切换预设 | `sound.preset()` |
| 确认操作（导出、发送等完成态） | `sound.confirm()` |
| 开始录制 | `sound.recordStart()` |
| 停止录制 | `sound.recordStop()` |

如果现有音效都不合适，先在 `sound.js` 中新增一个具名函数，再调用。  
不允许直接操作 `AudioContext` 散落在业务代码里。
