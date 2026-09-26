import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/unify-campus-portal/',
  build: {
    chunkSizeWarningLimit: 2000,
  }
})