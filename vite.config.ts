import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'jsdom',
    alias: {
      '$lib': new URL('./src/lib', import.meta.url).pathname
    }
  }
});
