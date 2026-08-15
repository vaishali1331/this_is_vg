import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config: React Fast Refresh via the official plugin is all this
// project needs — no extra bundler config required.
export default defineConfig({
  plugins: [react()],
});
