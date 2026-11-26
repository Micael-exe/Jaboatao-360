import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const proxy = {
  '/api': {
    target: 'http://127.0.0.1:3001',
    // A API compara o Host recebido com o endereço de origem do navegador.
    changeOrigin: false,
  },
}
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy },
  preview: { proxy },
  test: { environment: 'jsdom', setupFiles: './src/test/setup.js', css: false },
})
