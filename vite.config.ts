import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { name } from './package.json'

export default defineConfig((env) => {
  return {
    plugins: [
      solidPlugin(),
      dts({
        rollupTypes: true,
      }),
      cssInjectedByJsPlugin({
        injectCode: (cssCode /* , options */) => {
          return `if (!document.head.querySelector('style[data-styled-${name}]')) {
          const elementStyle = document.createElement('style')
          elementStyle.setAttribute('data-styled-${name}', '')
          elementStyle.append(document.createTextNode(${cssCode}))
          document.head.append(elementStyle)
        }`
        },
      }),
    ],
    server: {
      port: 3000,
    },
    css: {
      modules: {
        scopeBehaviour: 'local',
        generateScopedName:
          env.command === 'build'
            ? 'simcom_[hash:5]'
            : '[local]___[hash:base64:5]',
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
  }
})
