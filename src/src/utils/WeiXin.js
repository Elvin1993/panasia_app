/*
wx.config({
  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: 'wx271ba96fe0c27a40',
  timestamp: 1464316655,
  nonceStr: 'UvTXaVae',
  signature: 'cbe37f37c4baca78cc81c2611c8d56c4ed94d3f2',
  jsApiList: [
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo'
  ]
});

var message = {
  title: "http://www.zentrust.cn/mobile/activity/view/73",
  link: "活动报名 | 消费金融资产及其证券化路径",
  imgUrl: "http://zhixin.oss-cn-hangzhou.aliyuncs.com/activity/24d973d3c981b770a5eb9daddf64d9ad-b712dbc4b1c08904",
  type: 'link', // 分享类型,music、video或link，不填默认为link,
  trigger: function (res) {
//                    alert('用户点击分享到朋友圈');
  },
  success: function (res) {
//                    alert('已分享');
  },
  cancel: function (res) {
//                    alert('已取消');
  },
  fail: function (res) {
    alert(JSON.stringify(res));
  }
}

wx.onMenuShareTimeline(message)
wx.onMenuShareAppMessage(message)
wx.onMenuShareQQ(message)
wx.onMenuShareWeibo(message) */

// TODO 判断url变化自动触发wx.config 整合initShare
import React, { Component } from 'react'

/* export const Init2 = (opts)=> {
  let jsApiList = opts || ['onMenuShareTimeline', 'onMenuShareAppMessage', 'previewImage']
  return (ComposedComponent) => {
    return class extends Component {
      componentDidMount() {
        // console.log(this.props)
        API.get('/shop/getGood', {id: 1}, (ret)=> {
          wx.config({
            debug: true,
            appId: 'wxc2463eb33f98ce35',
            nonceStr: 'tXWy5zY1ewSxpespZhK4',
            timestamp: '1466043286',
            signature: '26fe226542e77343282d7d72276f4b79fc3da5b8',
            jsApiList: jsApiList
          })
        })
      }

      render() {
        return <ComposedComponent {...this.props} />
      }
    }
  }
} */

const allApiList = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareQZone',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'chooseWXPay'
]

export const InitWXConfig = (jsApiList = allApiList, api = '/Login/getWxConfig') => {
  const url = window.location.href.split('#')[0]
  API.get(api, {url})
     .then((ret) => {
       const code = ret.code | 0
       if (code !== 0) {
         return false
       }
       const cfg = ret.dataset
       // wx.ready(()=>InitWXShare())
       wx.config({...cfg, debug: false, jsApiList})
     })
}

export const Init = (jsApiList, api) =>
  (ComposedComponent) => class extends Component {
    componentWillMount () {
      InitWXConfig(jsApiList, api)
    }

    render () {
      return <ComposedComponent {...this.props} />
    }
  }

export const InitWXShare = () => {
  const {origin, pathname, hash, href} = window.location
  const title = '智信 • 分享金融智慧'
  const desc = '金融高品质沙龙，实务培训，在线课堂，专业好文等一站式服务平台。'
  let imgUrl = `${origin}${pathname}/img/share_logo.jpg`
  imgUrl = encodeURI(imgUrl)
  document.title = `智信 • 分享金融智慧`
  const message = {
    title: title,
    link: href,
    imgUrl: imgUrl,
    desc: desc,
    type: 'link'
  }
  // let tlmessage = {...message, title: document.title}
  wx.onMenuShareAppMessage(message)
  wx.onMenuShareQQ(message)
  wx.onMenuShareTimeline(message)
}
