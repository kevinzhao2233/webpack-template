const webpack = require('webpack')

const { merge } = require('webpack-merge')
// Base config
const baseWebpackConfig = require('./webpack.base.config')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-nosources-cheap-module-source-map',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 10001,
    overlay: {
      errors: true
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})
