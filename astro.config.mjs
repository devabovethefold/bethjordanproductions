// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';

export default defineConfig({
  integrations: [alpinejs()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
