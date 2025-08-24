import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // React 和核心库
          'react-vendor': ['react', 'react-dom'],
          
          // UI组件库
          'ui-vendor': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          
          // 路由和状态管理
          'router-vendor': ['react-router-dom'],
          
          // 工具库
          'utils-vendor': ['zod', 'clsx', 'tailwind-merge'],
          
          // 大型依赖
          'heavy-vendor': ['react-beautiful-dnd'],
          
          // 翻译文件
          'locales': ['./src/locales/index.ts'],
        }
      }
    },
  },
}));
