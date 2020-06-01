const path = require('path')
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  lintOnSave: true,
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '首页',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 8061,
    https: false,
    hotOnly: false,
    proxy: null
  },
  pwa: {},
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, `src/assets/less/${process.env.VUE_APP_COLOR_THEME}/global.less`),
        path.resolve(__dirname, `src/assets/less/common.less`)
      ]
    }
  },
  configureWebpack: config => {
    config.entry.app = ['babel-polyfill', './src/main.js']
  }
}
