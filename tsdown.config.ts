import { defineConfig } from 'tsdown'

/**
 * `tsdown` configuration options
 */
export default defineConfig({
  entry: ['src/*.ts', 'src/apps/*.ts', 'src/exports/meta/*/index.ts'], // 入口文件
  format: 'esm', // 输出格式
  target: 'node18', // 目标环境
  sourcemap: false, // 是否生成 sourcemap
  clean: true, // 是否清理输出目录
  fixedExtension: false, // 使用 .js 而不是 .mjs
  outExtensions: () => ({
    js: '.js',
  }),
  dts: true, // 是否生成 .d.ts 文件
  outDir: 'lib', // 输出目录
  treeshake: true, // 树摇优化
  minify: false, // 压缩代码
  external: [
    'node-karin', 'karin-plugin-mys-core'
  ],
  shims: true,
  platform: 'node', // 目标平台
  outputOptions: {
    // 减少 chunk 文件的生成
    chunkFileNames: '_chunks/[name]-[hash].js', // 将所有 chunk 放入 _chunks 文件夹
    // 控制代码分割策略,减少 chunk 数量
    manualChunks (id) {
      // 将 node_modules 中的代码都打包到一个 vendor chunk 中
      if (id.includes('node_modules')) {
        return 'vendor'
      }
      // 不进行其他分块,让 rolldown 自动处理
    },
  },
})
