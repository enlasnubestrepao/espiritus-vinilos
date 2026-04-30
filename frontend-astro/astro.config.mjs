// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://enlasnubestrepao.com',
  base: '/',
  trailingSlash: 'always',
  build: {
    assets: 'assets',
  },
  vite: {
    resolve: {
      alias: {
        '@frontend': path.resolve(__dirname, '../frontend/src'),
      },
    },
  },
})
