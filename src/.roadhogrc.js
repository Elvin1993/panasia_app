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
const __BRANCH__ = execSync('git branch | grep \\* | cut -d \' \' -f2').toString().trim()
let __TITLE__ = ''
if (__DEV__) {
  __TITLE__ = `DEV -- ${__BRANCH__}@${__DATETIME__}`
} else if (__TEST__) {
  __TITLE__ = `TEST -- ${__BRANCH__}@${__DATETIME__}`
} else if (__PROD__) {

}

const svgSpriteDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // antd-mobile 内置svg
  path.resolve(__dirname, 'src/assets/svg'),  // 业务代码本地私有 svg 存放目录
]

export default {
  'entry': 'src/index.js',
  'publicPath': './',
  // 'hash': true,
  'outputPath': '../www',
  'multipage': false,
  'svgSpriteLoaderDirs': svgSpriteDirs,
  // 'extraPostCSSPlugins': [
  //   pxtorem({
  //     // rootValue: 100,
  //     propWhiteList: [],
  //     selectorBlackList: [/^html$/, /^\.ant-/, /^\.github-/, /^\.gh-/],
  //   })
  // ],
  'theme': {
    // '@hd': '2px'
    // '@fill-body': '#1DA57A',
    // "@primary-color": "#1DA57A",
    // "@link-color": "#1DA57A",
    // "@border-radius-base": "2px",
    // "@font-size-base": "16px",
    // "@line-height-base": "1.2"
  },
  // // 'theme': null,
  // 'proxy': {
  //   '/api': {
  //     'target': 'http://jsonplaceholder.typicode.com/',
  //     'changeOrigin': true,
  //     'pathRewrite': {'^/api': ''}
  //   }
  // },
  // 'externals': {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM'
  // },
  /*
  'define': {
    ENV,
    NODE_ENV,
    __DEV__,
    __TEST__,
    __PROD__,
    __BRANCH__,
    __DATETIME__,
    __TITLE__
  },
*/
  'extraBabelPlugins': [
    'transform-runtime',
    'transform-decorators-legacy',
    'add-module-exports',
    ['import', [{'libraryName': 'antd-mobile', 'style': true}, {
      'libraryName': 'react-router',
      'camel2DashComponentName': false
    }]],
    // ['module-resolver', {'alias': {'dva': 'dva-react-router-3'}}]

  ],
  'env': {
    'development': {
      'extraBabelPlugins': [
        'dva-hmr',
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
