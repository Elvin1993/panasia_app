import QueryString from 'qs'

function delay (timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

function clearStyle (html) {
  if (!html) { return html }
  html = html.replace(/ style="[^>]*"/gi, '')
  html = html.replace(/<\/?font[^>]*>/gi, '')
  html = html.replace(/<a[^>]*>/gi, '<span>')
  html = html.replace(/<\/a>/gi, '</span>')
  // html = html.replace(/<\/b>/gi, '</span>')
  // html = html.replace(/ align=[^\s|>]*/gi, '')
  return html
}

function clearStyle1 (html) {
  if (!html) { return html }
  html = html.replace(/ !important*"/gi, '')
  html = html.replace(/<a[^>]*>/gi, '<span>')
  html = html.replace(/<\/a>/gi, '</span>')
  return html
}

function isNotEmpty (html) {
  if (!html) { return true }
  html = html.replace(/(\s)|(&nbsp;)/g, '')
  return !!html.length && html !== '<p></p>'
}

function trim (str) {
  str = str || ''
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

function checkEmail (value) {
  const EMAIL_RE = /^[a-zA-Z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+(?:\.[a-zA-Z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/
  const re = new RegExp(EMAIL_RE)
  return re.test(value)
}

function isMobile (phone) {
  return !!phone && /^1\d{10}$/i.test(phone)
}

function resetWXShare () {
  const {origin, pathname, hash, href} = location
  const title = '智信 • 分享金融智慧'
  const desc = '金融高品质沙龙，实务培训，在线课堂，专业好文等一站式服务平台。'
  let imgUrl = `${origin}${pathname}/img/share_logo.jpg`
  imgUrl = encodeURI(imgUrl)
  document.title = title
  const message = {
    title: title,
    link: href,
    imgUrl: imgUrl,
    desc: desc,
    type: 'link'
  }
  wx.onMenuShareAppMessage(message)
  wx.onMenuShareQQ(message)
  wx.onMenuShareTimeline(message)
}

function toCDN (url) {
  if (!__PROD__) {
    return url
  }
  if (url) {
    url = url.replace('api.zentrust.cn', 'zentrust-cn-upload.oss-cn-hangzhou.aliyuncs.com')
  }
  return url
}

function formatTime (seconds) {
  return [
    // parseInt(seconds / 60 / 60),
    parseInt(seconds / 60 % 60),
    parseInt(seconds % 60)
  ]
    .join(':')
    .replace(/\b(\d)\b/g, '0$1')
}

function isAndroid () {
  let ua = navigator.userAgent.toLowerCase()
  return (ua.indexOf('android') > -1 || ua.indexOf('adr') > -1) // android终端
}


export {
  delay,
  clearStyle,
  clearStyle1,
  isNotEmpty,
  trim,
  checkEmail,
  isMobile,
  resetWXShare,
  formatTime,
  isAndroid,
  toCDN
}
