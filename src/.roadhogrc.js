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
      rootValue: 100,
      propWhiteList: [],
      selectorBlackList: [/^html$/, /^\.ant-/, /^\.github-/, /^\.gh-/],
    })
  ],
  // 'theme': {
  //   '@fill-body': '#1DA57A',
  //   "@primary-color": "#1DA57A",
  //   "@link-color": "#1DA57A",
  //   "@border-radius-base": "2px",
  //   "@font-size-base": "16px",
  //   "@line-height-base": "1.2"
  // },
  // // 'theme': null,
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
    ['import', [{'libraryName': 'antd-mobile', 'style': 'css'}, {'libraryName': 'react-router', 'camel2DashComponentName': false}]]
  ],
  'env': {
    'development': {
      'extraBabelPlugins': [
        'dva-hmr'
      ]
    },
    'production': {
      'extraBabelPlugins': []
    },
    'autoprefixer': {
      'browsers': [
        'iOS >= 8', 'Android >= 4'
      ]
    },
  },
  // dllPlugin: {
  //   'exclude': [
  //     'babel-runtime'
  //   ],
  //   'include': [
  //     'dva/router',
  //     'dva/saga',
  //     'dva/fetch'
  //   ]
  // }
}
