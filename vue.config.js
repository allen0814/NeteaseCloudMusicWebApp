const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')

// 拼接路径
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  filenameHashing: true, // 文件使用hash值命名
  outputDir: process.env.outputDir,
  productionSourceMap: false, // 取消生成map文件
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@components', resolve('src/components'))
      .set('@assets', resolve('src/assets'))
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      config.plugins.push(
        new CompressionPlugin({
          test: /\.(js|css)?$/i, // 哪些文件要压缩
          filename: '[path].gz[query]', // 压缩后的文件名
          algorithm: 'gzip', // 使用gzip压缩
          minRatio: 1, // 压缩率小于1才会压缩
          deleteOriginalAssets: false // 删除未压缩的文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false
        })
      )
    } else {
      // 开发环境

    }
  }
}
