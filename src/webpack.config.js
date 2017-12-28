// const util = require('util')
const path = require('path')
const existsSync = require('fs').existsSync
const execSync = require('child_process').execSync
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pxtorem = require('postcss-pxtorem')
const DashboardPlugin = require('webpack-dashboard/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const FastUglifyJsPlugin = require('fast-uglifyjs-plugin')

const cwd = process.cwd()
const pkgPath = path.join(cwd, 'package.json')

const NODE_ENV = process.env.NODE_ENV
const ENV = process.env.ENV || NODE_ENV || 'development'

const __DEV__ = global.__DEV__ = (ENV === 'development')
const __TEST__ = global.__TEST__ = (ENV === 'test')
const __PROD__ = global.__PROD__ = (ENV === 'production')
const __DATETIME__ = (new Date()).toLocaleString()
const cmd = 'git branch | grep \\* | cut -d \' \' -f2'
const __BRANCH__ = execSync(cmd).toString().trim()

// __EDU__ = (process.env.SYS === 'EDU')

const definePlugin = new webpack.DefinePlugin({
  ENV,
  NODE_ENV,
  __DEV__,
  __TEST__,
  __PROD__,
  __BRANCH__: JSON.stringify(__BRANCH__),
  __DATETIME__: JSON.stringify(__DATETIME__),
  __TITLE__: JSON.stringify('test_title')
})

global.__TITLE__ = ''
if (__DEV__) {
  global.__TITLE__ = `DEV -- ${__BRANCH__}@${__DATETIME__}`
} else if (__TEST__) {
  global.__TITLE__ = `TEST -- ${__BRANCH__}@${__DATETIME__}`
} else if (__PROD__) {

}

const vendor = ['redux']
module.exports = function (webpackConfig, env) {

  // 对roadhog默认配置进行操作，比如：
  Object.assign(webpackConfig, {
    node: {
      fs: 'empty'
    },
    devtool: 'source-map',
    resolve: {
      root: __dirname,
      modulesDirectories: ['src', 'node_modules'],
      extensions: ['', '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.json', '.jsx'],
      // alias: {
      //   'react': 'inferno-compat',
      //   'react-dom': 'inferno-compat',
      //   'react-redux': 'inferno-redux'
      // },
    },
    externals: {
      // 'react': 'React',
      // 'react-dom': 'ReactDOM',
      // 'wx': 'wx'
    }
  })

  // webpackConfig.module.loaders[1] = {test: /\.jsx?$/, loader: 'babel?cacheDirectory=.cache', include: path.join(__dirname, 'src')}
  // webpackConfig.module.loaders.push({ test: /\.less$/, include: /node_modules/, loader: 'style!css!postcss'  })

  // const svgDirs = [
  //   require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
  //   // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
  // ];
  // console.log(svgDirs)
  // webpackConfig.module.loaders.push({
  //   test: /\.(svg)$/i,
  //   loader: 'svg-sprite',
  //   include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
  // },)

  // webpackConfig.babel.babelrc = true

  webpackConfig.postcss = () => {
    return [
      pxtorem({
        rootValue: 100,
        propWhiteList: [],
        selectorBlackList: [/^html$/, /^\.ant-/, /^\.github-/, /^\.gh-/],
      })]
  }

  if (__DEV__) {
    webpackConfig.plugins.push(new DashboardPlugin({port: 3013}))
  }

  if (__TEST__) {

  }

  if (__PROD__) {

  }

  if (__TEST__ || __PROD__) {
    webpackConfig.plugins[3] = new ExtractTextPlugin('[name].[chunkhash:5].css')
  }

  /*
  if (__PROD__) {
    // webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }
  */

  webpackConfig.plugins.push(definePlugin)
  webpackConfig.plugins.push(new webpack.ProvidePlugin({
    React: 'react'
  }))
  webpackConfig.plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/))
  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    filename: './index.html',
    template: './src/index.tpl',
  }))

  return webpackConfig
}

if (__DEV__) {
  // const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000
  // const express = require('express')
  // const app = express()
  // app.use(express.static(path.join(__dirname, '../www')))
  // app.listen(DEFAULT_PORT + 1)
}
