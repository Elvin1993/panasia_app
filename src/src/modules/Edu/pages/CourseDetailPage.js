import { Tabs, Button, Toast, Modal } from 'antd-mobile'
import cx from 'classname'
import Nav from 'components/Nav'
import VaildPhoneNum from 'components/VaildPhoneNum'
import ReactPlaceholder from 'react-placeholder'
import { TextBlock, TextRow } from 'react-placeholder/lib/placeholders'
import { formatTime, isAndroid } from 'utils/helper'
import styles from './CourseDetailPage.less'

@connect(state => ({
  myHistory: state.app.myHistory,
  ...state.course.courseModel,
  userInfo: {...state.my.myInfoModel.dataset},
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTime: 0,
      playingId: null,
      playingState: false,
      modal: false
    }

  }

  componentDidMount () {
    this.handlerInit((v) => wx.ready(() => this.initWXShare(v)))
    const {query: {autoplay}} = this.props.location
    if (!!+autoplay) {
      this.handlePay()
    }
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'course/clearCourseModel'})
  }

  handerGoCurrentTime () {
    let {browser_history = {}} = this.props.playingVideo || {}
    browser_history = browser_history || {}
    this.$player.currentTime = browser_history.play_time ? +browser_history.play_time : 0
  }

  initWXShare (v = {}) {
    let {name: title, thumb_img: imgUrl} = v.dataset || {}
    // document.title = `智信 • 培训`
    let link = location.href
    var message = {
      title: '智信 • 培训',
      link: link,
      imgUrl: imgUrl,
      desc: title,
      type: 'link'
    }

    let tlmessage = {...message, title: `智信 • 培训- ${title}`}
    wx.onMenuShareAppMessage(message)
    wx.onMenuShareQQ(message)
    wx.onMenuShareTimeline(tlmessage)
  }

  handlerInit (cb, charge_id) {
    const {dispatch, dataset, match: {params: {id}}} = this.props
    // if (!dataset.id) {
    dispatch({
      type: 'course/fetchCourseInfo',
      payload: {
        params: {id},
        cb,
        charge_id
      }
    })
    // }
  }

  handerChangeTab (v) {
    // console.log(v)
  }

  isWork () {
    const {currentTime, paused, ended, readyState} = this.$player

    return currentTime > 0 && !paused && !ended && readyState > 2
  }

  handlerChangeVideo (playingVideo, isAutoPlay) {
    if (playingVideo.id === this.state.playingId) {
      return
    }
    this.props.dispatch({
      type: 'course/changePlayingVideo',
      payload: {
        playingVideo,
        cb: () => {
          this.setState({
            playingId: playingVideo.id,
            playingState: false,
            currentTime: 0
          })

          this.$player && this.$player.load()
          if (isAutoPlay) {
            const ret = this.$player.play()
            if (ret && ret.catch) {
              ret.catch(() => {
                // Empty catch to prevent useless unhandled promise rejection logging.
                // Play can fail for many reasons such as video getting paused before
                // play() is finished.
                // We use events to know the state of the video and do not care about
                // the success or failure of the play()'s returned promise.
              })
            }
            setTimeout(() => { !this.isWork() && this.$player.play() }, 100)
          }

          // setTimeout(() => {!this.isWork() && this.$player.play();}, 100)
        }
      }
    })
  }

  handlerBuy () {
    const {match: {params: {id}}, dispatch} = this.props
    const next_url = location.href

    dispatch({
      type: 'my/checkLogin',
      payload: {
        next_url: next_url + '?autoplay=1',
        cb: () => {
          const {userInfo} = this.props
          if (!userInfo.mobile || userInfo.mobile === '') {
            this.vaildTel()
          } else {
            this.handlePay()
          }
        }
      }
    })
  }

  vaildTel () {
    this.setState({
      modal: true
    })
  }

  handlePay () {
    this.setState({
      modal: false
    })
    const {match: {params: {id}}, dispatch} = this.props
    dispatch({
      type: 'course/orderPay',
      payload: {
        params: {
          order_type: 'video',
          payment_channel: 'wx_pub',
          payment_method: 'online',
          goods_list: [
            {
              id,
              count: 1
            }]
        },
        cb: (msg, charge_id) => {
          if (msg === '支付成功') {
            this.handlerInit(() => Toast.success('支付成功', 1), charge_id)
          } else {
            Toast.fail(msg || '购买失败', 1)
          }
        }
      }
    })
  }

  handlerSetHistory () {
    const {userInfo = {}, dispatch, match: {params: {id}}} = this.props

    if (userInfo.id) {
      let time1 = this.$player.currentTime || 0
      let time2 = this.state.currentTime || 0
      if (Math.abs(time1 - time2) >= 5) {
        dispatch({
          type: 'course/setVideoHistory',
          payload: {
            params: {id: this.$player.id, play_time: this.$player.currentTime},
            cb: () => this.setState({currentTime: time1})
          }
        })
      }
    }
  }

  awesomePlaceholder () {
    const color = '#f2f6f9'
    return (
      <div className={styles.course_detail_page}>
        <TextRow style={{width: '100%', height: 87}} color={color} />
        <TextRow style={{width: '100%', height: 30}} color={color} />
        <TextBlock className={styles.video_list} rows={10} color={color} />
      </div>
    )
  }

  handlerMsg () {
    const {dispatch, dataset = {}, userInfo: {status}} = this.props
    const {id, is_buy, is_free, chapter = []} = dataset || {}

    if (chapter.length <= 0) {
      return
    }

    if (!!+is_free && status === 'WEIXIN') {
      Modal.alert('提示', '只有注册用户才能收看免费课程！现在注册，马上观看！', [
        {text: '取消'},
        {
          text: '去注册',
          onPress: () => {
            dispatch(routerRedux.push({
                pathname: '/logon',
                query: {
                  video_id: id
                }
              }
            ))
          },
          style: {fontWeight: 'bold'}
        }
      ])
    } else {
      Modal.alert('提示', '您还未购买此课程，是否现在购买？', [
        {text: '取消'},
        {text: '去购买', onPress: this.handlerBuy, style: {fontWeight: 'bold'}}
      ])
    }
  }

  handlerGoBack () {
    const {dispatch, myHistory = {}} = this.props
    const {pUrl} = myHistory
    if (pUrl) {
      dispatch(routerRedux.goBack())
    } else {
      dispatch(routerRedux.replace('/edu'))
    }
  }

  handlerVideoPlay (e) {
    const {playingVideo = {}} = this.props

    this.setState({playingId: playingVideo.id})
    setTimeout(() => { !this.isWork() && this.$player.play() }, 100)
  }

  handlePayNextVideo () {
    const {playingVideo = {}, dataset = {}} = this.props
    const {chapter = []} = dataset
    const {index} = playingVideo
    const nextVideo = chapter[1 + index] && chapter[1 + index]
    // this.exitFullscreen()
    nextVideo && this.handlerChangeVideo(nextVideo)
  }

  exitFullscreen () {
    var de = document
    if (de.exitFullscreen) {
      de.exitFullscreen()
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen()
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen()
    }
  }

  onClose () {
    this.setState({
      modal: false
    })
  }

  render () {
    const {loading, dispatch, dataset = {}, playingVideo = {}} = this.props
    const {status, id, chapter = [], thumb_img, money, name, is_buy, is_free, lecturer, lecturer_identity_desc, lecturer_full_desc, desc} = dataset
    const {playingState, playingId} = this.state
    let {browser_history = {}} = playingVideo || {}
    browser_history = browser_history || {}
    let ctrl = !isAndroid() ? {controls: true} : null
    // alert(isAndroid())
    const tabs = [
      {title: '业务分类'},
      {title: '行业分类'}
    ]
    return (
      <div className='page'>
        {
          status === 'offline' ? <div>
              <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={this.handlerGoBack} center='课程详情' />
              <div className={styles.sold_off_msg}>此课程暂时下架，请过段时间再来学习</div>
            </div>
            : <div className={styles.course_detail_page} style={!+is_buy && !+is_free ? {marginBottom: '98px'} : null}>
              <Nav className={playingState ? styles.hide : styles.show} left={<i className='icon icon-arrows-left' />}
                   onLeftClick={this.handlerGoBack} center='课程详情' />
              {
                !playingVideo.video_url ? <div className={styles.video} style={{backgroundImage: `url("${thumb_img}")`}}>
                    {/* <Icon type={require('assets/svg/video_play_la.svg')} className={styles.icon} onClick={this.handlerMsg}/> */}
                    <div className={styles.mask}>
                      {!loading && <img src='img/bofang.png' alt='播放' className={styles.icon} onClick={this.handlerMsg} />}
                    </div>
                  </div>
                  : <div className={styles.video_wrapper}>
                    <video
                      is
                      id={playingVideo.id}
                      key={playingVideo.id}
                      preload='auto'
                      ref={(player) => { this.$player = player }}
                      width='100%'
                      height='100%'
                      x-webkit-airplay='allow'
                      webkit-playsinline='true'
                      {...ctrl}
                      // x5-video-player-type="h5"
                      // x5-video-player-fullscreen="true"
                      // x5-video-orientation="landscape|portrait"
                      playsInline='true'
                      onLoadedMetadata={this.handerGoCurrentTime}
                      onTimeUpdate={this.handlerSetHistory}
                      onPlay={this.handlerVideoPlay}
                      onPause={() => {
                        this.setState({playingState: false})
                      }}
                      onPlaying={() => {
                        this.setState({playingState: true})
                      }}
                      onEnded={this.handlePayNextVideo}
                      poster={thumb_img}
                      src={playingVideo.video_url}
                    />
                    {
                      !ctrl && <button className={styles.video_paly_button} type='button'>
                        <img src='img/bofang.png' alt='播放' />
                      </button>
                    }

                  </div>

              }

              <ReactPlaceholder customPlaceholder={this.awesomePlaceholder()} ready={!!id}>
                <div className={styles.info_box}>
                  <div className={styles.tab}>
                    <Tabs tabs={[
                      {title: '目录'},
                      {title: '介绍'}
                    ]}
                          initialPage='1'
                          swipeable={false}
                          onChange={this.handerChangeTab}
                          className={styles.tab}>

                      <div>
                        <h3 className={styles.title}>{name}</h3>
                        <ul className={styles.video_list}>
                          {
                            chapter.map((item, key) => {
                              return (
                                <li key={key} className={cx({[styles.playing]: playingVideo.id === item.id})}
                                    onClick={() => this.handlerChangeVideo(item)}>
                                  <div className={styles.name_box}>
                                    {/* <Icon type={require('assets/svg/video_play.svg')} className={styles.icon} /> */}
                                    <p className={styles.name}>{item.name}</p>
                                  </div>
                                  <div className={styles.right}>
                                    {(!+item.is_preview || !!+is_buy || !!+is_free) && playingId !== item.id &&
                                    <span className={styles.time}>
                                  {/*<Icon type={require('../../../assets/svg/clock.svg')} size='sm' className={styles.icon_clock} />*/}
                                      {formatTime(+item.video_time || 0)}
                                  </span>
                                    }
                                    {
                                      playingId === item.id
                                        ? <span className={styles.look}><i className={cx({
                                          'icon': true,
                                          'icon-video-pause': !playingState,
                                          'icon-video-playing': playingState
                                        })} /></span>
                                        : (!!+item.is_preview && !+is_buy && !+is_free &&
                                        <span className={styles.preview}>可试看</span>)
                                    }
                                  </div>
                                </li>
                              )
                            })
                          }
                        </ul>
                        <div className='empty_box' style={{height: '100px'}} />
                      </div>

                      <div>
                        <div className={styles.introduce}>
                          <h2 className={styles.title}>讲师介绍</h2>
                          <div className={styles.teacher_info}>
                            <div className={styles.face}>
                              <img src='img/teacher-face.jpg' alt='头像' />
                            </div>
                            <div className={styles.info}>
                              <h3>{lecturer}</h3>
                              <p>{lecturer_identity_desc}</p>
                            </div>
                          </div>
                          <p className={styles.lecturer_full_desc}>{lecturer_full_desc}</p>

                          <h2 className={styles.title}>课程介绍</h2>
                          <div className={styles.des}>{desc}</div>
                        </div>
                        <div className='empty_box' style={{height: '100px'}} />
                      </div>
                    </Tabs>
                  </div>
                  {
                    !+is_buy && !+is_free &&
                    <div className={styles.footer}>
                      <div className={styles.price}>
                        ￥{money}
                      </div>
                      <Button className={styles.btn_learn} onClick={this.handlerBuy} disabled={loading}>
                        立即购买
                      </Button>
                    </div>
                  }
                </div>
              </ReactPlaceholder>
            </div>
        }
        {
          this.state.modal ? (
            <Modal
              title={<span style={{color: '#3d74c7', fontWeight: 'bold'}}>验证手机号码</span>}
              transparent
              maskClosable
              closable
              visible={this.state.modal}
              onClose={this.onClose}
              style={{width: '6.5rem'}}
            >
              <VaildPhoneNum onSubmit={this.handlePay.bind(this)} />
            </Modal>
          ) : null
        }

      </div>
    )
  }
}
