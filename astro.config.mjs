// @ts-check
import { defineConfig } from 'astro/config'

import alpinejs from '@astrojs/alpinejs'
import cloudflare from '@astrojs/cloudflare'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    prerenderEnvironment: 'node',
  }),
  integrations: [
    alpinejs({ entrypoint: './src/utilities/alpine/index.ts' }),
    icon({
      iconDir: 'src/assets/icons',
      include: {
        mdi: [
          'menu',
          'moon-waning-crescent',
          'white-balance-sunny',
          'star',
          'lightning-bolt',
          'shield-check',
          'chevron-down',
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
