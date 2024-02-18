// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './app', // Esta linha especifica o diretório raiz do projeto Vite
  plugins: [react()],
  build: {
    outDir: '../../dist', // Esta linha especifica onde o build será colocado relativo ao root
    emptyOutDir: true, // Isto limpa o diretório de saída antes de construir
  },
});
