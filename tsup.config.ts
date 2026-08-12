import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@pose-tracker/pose-estimation-web',
    '@tensorflow/tfjs',
  ],
});
