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

## 构建与部署

### 构建系统

项目使用 **Vite** 构建，输出到 `dist/`，所有 JS/CSS/字体文件名带内容哈希。

```bash
npm run dev      # 本地开发（Vite dev server，支持 HMR）
npm run build    # 构建生产包 → dist/
npm run preview  # 预览构建产物（模拟 Vercel 行为）
```

`dist/` 和 `node_modules/` 不提交 git，Vercel 在 CI 里执行 `npm run build`。

### 标准上线流程

**每次功能开发必须走这个流程，不允许直接在 main 上开发后推送：**

```
1. git checkout -b feature/xxx        # 从 main 创建功能分支
2. 开发 + npm run dev 本地验证
3. git push origin feature/xxx        # 推送分支，Vercel 自动生成 Preview URL
4. 无痕窗口打开 Preview URL 做生产验证  # 真实 CDN + 真实 COEP headers
5. DevTools Console 确认无红色报错
6. 验证通过 → merge 到 main → 自动部署到 gradlab.app
```

**生产验证检查项（每次上线必做，2分钟）：**

- [ ] Canvas 正常渲染（不黑屏）
- [ ] 控件完整加载（颜色列表、滑块、切换开关均可见）
- [ ] 图标正常显示（Remix Icon 字体）
- [ ] DevTools Console 无红色报错
- [ ] 做一次核心交互（切换 Theme / 调整参数）

**无痕窗口是关键** — 等同于新用户首次访问，没有任何本地缓存干扰。

### 缓存策略

| 路径 | Cache-Control | 原因 |
|---|---|---|
| `/assets/*` | `immutable, max-age=31536000` | Vite 内容哈希文件名，内容不变则 URL 不变 |
| `/*` (含 index.html) | `no-cache` | 每次验证，确保用户拿到最新哈希链 |

**禁止**在 `vercel.json` 里对可变 URL（同路径内容会更新的文件）使用 `immutable` 或 `stale-while-revalidate`。
这是导致 2026-06-11 生产事故的根因之一。

### 紧急回滚

生产出问题时，先回滚，再排查：
Vercel 控制台 → Deployments → 找最近一个正常的版本 → **Promote to Production**（30秒内生效）。
