import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // 网页版 PWA：SW 由插件自动生成（产物带 hash，无需手动 bump 版本）。
    // Capacitor 原生环境从本地加载，SW 注册不生效也不影响。
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: '咖啡计算器',
        short_name: '咖啡计算',
        description: '奶咖配方与冰手冲计算器 — 选杯型与比例，自动算出浓缩与牛奶。',
        lang: 'zh-CN',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F6F0E4',
        theme_color: '#F6F0E4',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
