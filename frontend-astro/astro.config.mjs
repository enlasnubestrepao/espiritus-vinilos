// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Páginas de vinilos tienen más peso — contenido editorial único
      serialize(item) {
        if (item.url.includes('/vinilos/') || item.url.includes('/rones/') || item.url.includes('/whiskies/')) {
          return { ...item, priority: 0.9, changefreq: 'monthly' }
        }
        if (item.url === 'https://enlasnubestrepao.com/') {
          return { ...item, priority: 1.0, changefreq: 'weekly' }
        }
        return item
      },
    }),
  ],
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
        // Force all react-query imports to use frontend's version
        // so QueryClientProvider context is shared with App.jsx
        '@tanstack/react-query': path.resolve(
          __dirname,
          '../frontend/node_modules/@tanstack/react-query'
        ),
        'react': path.resolve(__dirname, '../frontend/node_modules/react'),
        'react-dom': path.resolve(__dirname, '../frontend/node_modules/react-dom'),
      },
    },
  },
})
