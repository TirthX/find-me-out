import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get base path from environment variable or default to repo name
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'find-me-out';
const base = process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base,
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
