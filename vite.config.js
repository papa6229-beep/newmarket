import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Anthropic SDK uses these Node.js built-ins; point to empty shims
    },
  },
  optimizeDeps: {
    include: ['xlsx', 'chart.js', 'react-chartjs-2'],
  },
})
