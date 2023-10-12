import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    solidPlugin(),
    dts({
      rollupTypes: true,
    }),
    cssInjectedByJsPlugin(),
  ],
  server: {
    port: 3000,
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: 'simcom_[hash:5]',
    },
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'Simcom',
      formats: ['es', 'iife'],
      fileName: (format) => `simcom.${format}.js`, // 打包后的文件名
    },
  },
})
