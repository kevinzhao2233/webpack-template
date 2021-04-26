const appConf = require('../app.config')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const pageTitle = 'webpack-template'

// 定义路径常量
const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  // assets 用于输出目录结构
  assets: 'assets/'
}

// 定义页面常量
// 页面全都写到 src/pages 文件夹中
const PAGES_DIR = `${PATHS.src}/pages`
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter(fileName => fileName.endsWith('.html'))

// 生成入口文件映射关系，具体在 app.config.js 中配置
const ENTRY = {}
Object.entries(appConf.pageEntry).forEach(item => {
  ENTRY[item[0]] = `${PATHS.src}${item[1]}`
})

module.exports = {
  entry: {
    // 公共 js 入口文件
    common: `${PATHS.src}/js/common.js`,
    ...ENTRY
  },

  output: {
    filename: `${PATHS.assets}js/[name].[contenthash].js`,
    path: PATHS.dist,
    clean: true
  },

  externals: {
    paths: PATHS
  },

  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },

  resolve: {
    alias: {
      '~': PATHS.src, // 例如: import Dog from "~/assets/img/dog.jpg"
      '@': `${PATHS.src}/js` // 例如: import Sort from "@/utils/sort.js"
    }
  },

  module: {
    rules: [
      {
        // html
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        // JavaScript
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        // Images
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name]-[hash][ext][query]'
        }
      },
      {
        // Fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name]-[hash][ext][query]'
        }
      },
      {
        // scss
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        // css
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.src}/static`,
          to: ''
        }
      ]
    }),

    /*
      自动创建 HTML
    */
    ...PAGES.map(
      page =>
        new HtmlWebpackPlugin({
          template: `${PATHS.src}/pages/${page}`,
          filename: `./${page}`,
          title: pageTitle,
          minify: false,
          chunks: ['common', page.replace('.html', '')]
        })
    )
  ]
}

