# 咖啡计算器 · PWA 部署包

一个可安装、可离线使用的渐进式 Web 应用（PWA）。全屏、移动优先、iPhone 适配（含刘海安全区）。

## 文件
```
pwa/
├─ index.html              入口（已内置「焦糖金」主题 + Sora 字体）
├─ app-pwa.jsx             全屏应用外壳 + 底部导航
├─ shared.jsx              设计系统（调色板/字体/图标/基础组件）
├─ milk-coffee.jsx         奶咖配方计算器
├─ iced-pourover.jsx       冰手冲配方
├─ presets.jsx             杯型预设对照
├─ manifest.webmanifest    PWA 清单（名称/图标/主题色）
├─ sw.js                   Service Worker（应用壳预缓存 + 离线）
└─ icons/                  192 / 512 / maskable / apple-touch 图标
```

## 如何部署
PWA **必须通过 HTTPS** 提供（`localhost` 例外）。把整个 `pwa/` 目录作为静态站点根目录上传即可，零构建：

- **GitHub Pages**：把 `pwa/` 内容推到仓库，开启 Pages。
- **Netlify / Vercel / Cloudflare Pages**：拖拽 `pwa/` 文件夹部署，发布目录设为该文件夹。
- **任意静态服务器 / 对象存储（OSS、S3）**：上传后用 HTTPS 访问 `index.html`。

> `manifest.webmanifest`、`sw.js`、`icons/` 必须与 `index.html` 同级（同源、同目录），相对路径已配置好。

## 本地预览
```bash
cd pwa
python3 -m http.server 8000      # 然后访问 http://localhost:8000
```
（直接双击 `index.html` 用 `file://` 打开时 Service Worker 不会注册，属正常现象。）

## 安装到手机
- **iPhone（Safari）**：分享 → 「添加到主屏幕」。会以全屏独立应用启动，使用我们的金色咖啡杯图标。
- **Android（Chrome）**：地址栏菜单 → 「安装应用 / 添加到主屏幕」。

## 离线
首次联网打开后，Service Worker 会缓存应用壳、JSX 与 CDN 依赖（React / Babel / 字体）。之后断网也能打开使用。
更新内容后，把 `sw.js` 里的 `CACHE = 'coffee-calc-v1'` 版本号 +1，即可让用户端刷新缓存。

## 生产强化（可选，非必须）
当前为「零构建」方案，在浏览器端用 Babel 实时编译 JSX，能直接部署。若追求更快首屏 / 更小体积：
- 预编译 JSX（Vite / esbuild），去掉浏览器端 Babel；
- 改用 React 生产版（`react.production.min.js`）；
- 自托管字体，去掉对 Google Fonts 的外部依赖。

## 主题
视觉定稿：**焦糖金（浅色）+ Sora 数字字体 + 圆角 20px**，已硬编码在 `index.html` 的 `:root` CSS 变量里。其余备选配色见 `shared.jsx` 的 `PALETTES`，需要时把对应值替换进 `:root` 即可。

公式与组件规格详见上级目录的 `HANDOFF.md`。
