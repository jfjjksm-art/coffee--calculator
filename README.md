# 咖啡计算器

奶咖配方与冰手冲配方计算器。React + Vite 构建，同一份代码同时输出：
- **网页版 PWA**（部署到 EdgeOne Pages 等静态托管）
- **安卓离线 App**（Capacitor 打包 APK）

## 目录结构
```
src/
├─ main.jsx            应用入口，注册字体
├─ App.jsx              全屏应用外壳 + 底部导航
├─ shared.jsx            设计系统（调色板/字体/图标/基础组件）
├─ milk-coffee.jsx       奶咖配方计算器（含杯型预设）
└─ iced-pourover.jsx     冰手冲配方（热平衡物理模型）
public/
├─ icons/                PWA 图标
└─ manifest.webmanifest  PWA 清单
android/                 Capacitor 生成的原生工程（已提交进仓库）
.github/workflows/       GitHub Actions：push 后自动构建 debug APK
```

## 本地开发
```bash
npm install
npm run dev        # http://localhost:5173
```

## 构建网页版
```bash
npm run build       # 产物在 dist/
npm run preview      # 本地预览生产构建
```

部署到 EdgeOne Pages：构建命令 `npm run build`，输出目录 `dist`。

## 构建安卓 APK

### 方式一：GitHub Actions（无需本地环境）
push 到 `main` 分支后自动触发，在仓库的 Actions 页面下载 `app-debug` 产物（debug 签名，安装前需在手机设置里允许"未知来源安装"）。

### 方式二：本地构建
需要 Android Studio（含 SDK）+ JDK 17：
```bash
npm run build && npx cap sync android
npx cap open android      # 用 Android Studio 打开，运行到模拟器/真机
```

## 离线能力
- **网页版**：`vite-plugin-pwa` 自动生成 Service Worker，首次联网访问后可离线打开。
- **安卓 App**：Capacitor 把构建产物打进 APK，运行时从本地文件加载，天然离线，无需网络。

## 主题
视觉定稿：**焦糖金（浅色）+ Sora 数字字体 + 圆角 20px**，CSS 变量定义在 `index.html` 的 `:root` 里。其余备选配色见 `src/shared.jsx` 的 `PALETTES`（当前未接入切换入口）。
