// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';
import react from '@astrojs/react';
import emdash from 'emdash/astro';
import { d1, r2 } from '@emdash-cms/cloudflare';

export default defineConfig({
  adapter: cloudflare({
    imageService: 'passthrough'
  }),
  output: 'server',
  integrations: [
    alpinejs(),
    react(),
    emdash({
      database: d1({ binding: 'DB', session: 'auto' }),
      storage: r2({ binding: 'MEDIA' }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/kysely')) {
              return 'kysely';
            }
          }
        }
      }
    },
    server: {
      watch: {
        ignored: ['**/emdash-env.d.ts', '**/.wrangler/**'],
      },
    },
  },
});
