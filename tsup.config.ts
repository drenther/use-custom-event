import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  clean: true, // clean up the dist folder
  external: ['react', 'react-dom', 'zod'],
});
