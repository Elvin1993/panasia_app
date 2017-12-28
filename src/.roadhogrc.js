const path = require('path')
const existsSync = require('fs').existsSync
const execSync = require('child_process').execSync
const pxtorem = require('postcss-pxtorem')

const NODE_ENV = process.env.NODE_ENV
const ENV = process.env.ENV || NODE_ENV || 'development'

const __DEV__ = (ENV === 'development')
const __TEST__ = (ENV === 'test')
const __PROD__ = (ENV === 'production')
const __DATETIME__ = (new Date()).toLocaleString()
const cmd = 'git branch | grep \\* | cut -d \' \' -f2'
const __BRANCH__ = execSync(cmd).toString().trim()

const svgSpriteDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // antd-mobile 内置svg
  path.resolve(__dirname, 'src/assets/svg'),  // 业务代码本地私有 svg 存放目录
]

export default {
  'entry': 'src/index.js',
  'publicPath': './',
  "outputPath": "../www",
  'multipage': false,
  'svgSpriteLoaderDirs': svgSpriteDirs,
  'extraPostCSSPlugins': [
    pxtorem({
      rootValue: 100 ,
      propWhiteList: [],
      selectorBlackList: [/^html$/, /^\.ant-/, /^\.github-/, /^\.gh-/],
    })
  ],
  "theme": {
    "@hd": "2px"
  },
  // 'proxy': {
  //   '/api': {
  //     'target': 'http://jsonplaceholder.typicode.com/',
  //     'changeOrigin': true,
  //     'pathRewrite': {'^/api': ''}
  //   }
  // },
  'externals': {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  'define': {
    ENV,
    NODE_ENV,
    __DEV__,
    __TEST__,
    __PROD__,
    __BRANCH__,
    __DATETIME__
  },

  'extraBabelPlugins': [
    'transform-runtime',
    'transform-decorators-legacy',
    'add-module-exports',
    ['import', [{'libraryName': 'antd-mobile', 'style': 'css'}, {
      'libraryName': 'react-router',
      'camel2DashComponentName': false
    }]]
  ],
  'env': {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        ['import', {'libraryName': 'antd-mobile', 'libraryDirectory': 'lib', 'style': true}]
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        ['import', {'libraryName': 'antd-mobile', 'libraryDirectory': 'lib', 'style': true}]
      ]
    }
  },
  'autoprefixer': {
    'browsers': [
      'iOS >= 8', 'Android >= 4'
    ]
  }
}
