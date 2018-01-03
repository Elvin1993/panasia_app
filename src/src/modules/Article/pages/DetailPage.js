import autobind from 'autobind-decorator'
import cx from 'classname'
import Nav from 'components/Nav'
import { connect } from 'dva'
import { Link } from 'dva/router'
import moment from 'moment'
import React from 'react'
import Headroom from 'react-headroom'
import ReactPlaceholder from 'react-placeholder'
import { TextBlock, TextRow, RectShape } from 'react-placeholder/lib/placeholders'
import { clearStyle1 } from 'utils/helper'
import styles from './DetailPage.less'

@connect(state => ({
  myHistory: state.app.myHistory,
  ...state.article.articleDetailModel,
  loading: state.loading.global
}))
@autobind
export default class extends React.PureComponent {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {dispatch, match: {params: {id}}} = this.props
    dispatch({
      type: 'article/fetchArticleDetail',
      payload: {params: {id}}
    }).then(() => {
      console.log('after fetchArticleDetail')
    })
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'article/payloadArticleDetailModel', payload: {dataset: {}}})
  }

  awesomePlaceholder () {
    const color = '#f2f6f9'
    return (
      <div className={styles.article_detail}>
        <TextRow className={styles.title} rows={1} color={color} />
        <RectShape className={styles.img} style={{width: 670, height: 340}} color={color} />
        <TextRow className={styles.author} style={{width: 100}} rows={5} color={color} />
        <TextRow className={styles.source} style={{width: 100}} rows='5' color={color} />
        <TextBlock className={styles.summary} rows={7} color={color} />
      </div>
    )
  }

  initWXShare (v) {
    let {dataset: {title: subject, thumb_image: imgUrl}} = v
    const title = document.title = '智信 • 文章'
    const tltitle = `${title} - ${subject}`
    const {origin, hash, href} = location
    const message = {
      title,
      desc: subject,
      link: href,
      imgUrl: imgUrl,
      type: 'link'
    }

    let tlmessage = {...message, title: tltitle}
    wx.onMenuShareAppMessage(message)
    wx.onMenuShareQQ(message)
    wx.onMenuShareTimeline(tlmessage)
  }

  handlerGoBack () {
    const {dispatch, myHistory = {}} = this.props
    const {pUrl} = myHistory
    if (pUrl) {
      dispatch(routerRedux.goBack())
    } else {
      dispatch(routerRedux.replace('/article'))
    }
  }

  render () {
    const {dataset = {}, loading} = this.props
    const {title, content: summary, guide, thumb_image: img_url, c_time: time, literature_author: author, literature_author_desc: author_des, source} = dataset
    return (
      <div className={cx('page', styles.article_detail_page)} style={{height: 'auto'}}>
        <Headroom>
          <Nav className={styles.nav} left={<i className='icon icon-arrows-left' />} onLeftClick={this.handlerGoBack}
               center={<div>文章详情</div>} />
        </Headroom>
        <ReactPlaceholder customPlaceholder={this.awesomePlaceholder()} ready={!loading} ref='box'>
          <div className={styles.article_detail}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.time}>{time && moment(time * 1000).format('YYYY年MM月DD日HH:mm')}</div>
            <div className={styles.guide}>
              {guide}
            </div>
            {/* <img className={styles.img} src={img_url} alt="文章图片" /> */}
            <div className={styles.author}><label>作者：</label><span>{author} {author_des}</span></div>
            <div className={styles.source}><label>来源：</label><span>{source}</span></div>
            <div className={styles.summary} dangerouslySetInnerHTML={{__html: clearStyle1(summary)}} />
            <div className={styles.footer} />
          </div>
        </ReactPlaceholder>
      </div>
    )
  }
}
