import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'jsdom',
    alias: {
      '$lib': resolve(__dirname, 'src/lib')
    }
  }
});
