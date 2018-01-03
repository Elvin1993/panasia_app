import { Tabs } from 'antd-mobile'
import cx from 'classname'
import ClassInfo from 'components/ClassInfo'
import Icon from 'components/CustomIcon'
import DataList from 'components/DataList'
import Nav from 'components/Nav'
import React, { Component } from 'react'
import { RectShape } from 'react-placeholder/lib/placeholders'
import styles from './Classroom.less'

const TabPane = Tabs.TabPane

@connect(
  state => ({
    myHistory: state.app.myHistory,
    loading: state.loading.global,
    courseModel: {...state.college.courseModel},
    userInfo: {...state.my.myInfoModel.dataset},
    applyStatus: state.college.applyStatus,
  })
)
export default class Classroom extends Component {
  constructor (props) {
    super(props)
    this.callback = this.callback.bind(this)
    this.postEmail = this.postEmail.bind(this)
    this.calItemClassName = this.calItemClassName.bind(this)
    this.handleVideoChange = this.handleVideoChange.bind(this)
    this.handlerGoBack = this.handlerGoBack.bind(this)
    this.loadMore = false
  }

  state = {
    activeTabkey: '2',
    videoHeight: 375,
    playItem: {
      url: '',
      index: null
    },
    playStatus: null
  }

  callback (activeTabkey) {
    this.setState({
      activeTabkey: activeTabkey
    })
  }

  componentDidMount () {
    const {width} = this.videoContainer.getClientRects()[0]
    let height = width * 9 / 16, that = this
    this.setState({
      videoHeight: height,
      // activeTabkey: '1'
    })

    const {dispatch, match: {params: {id}}} = this.props
    dispatch({
      type: 'college/fetchApplyStatus',
      payload: {
        cb: () => {}
      }
    })
    dispatch({
      type: 'college/fetchCourse',
      payload: {
        params: {id},
        cb: (courseModel) => {
          console.log(courseModel)
          if (courseModel.chapter && courseModel.chapter.length > 0) {
            const playItem = {
              index: 0,
              url: courseModel.chapter[0].url
            }
            this.setState({
              playItem
            })
          }
        }
      }
    })
  }

  postEmail (params, cb) {
    const {dispatch} = this.props
    params.business_course_id = params.id
    delete params.id
    dispatch({type: 'college/postFile2Email', payload: {params, cb}})
  }

  awesomePlaceholder () {
    const color = ''
    return (
      <div style={{padding: '.3rem', flex: 1, background: '#FFF'}}>
        <RectShape style={{height: 300}} color={color} />
        <RectShape style={{height: 30, margin: '.3rem 0'}} color={color} />
        <RectShape style={{height: 30, width: 200, margin: '.3rem 0'}} color={color} />
        <RectShape style={{height: 30, margin: '.3rem 0'}} color={color} />
        <RectShape style={{height: 30, width: 400, margin: '.3rem 0'}} color={color} />
      </div>
    )
  }

  calItemClassName (index) {
    return cx({
      [styles['video-item']]: true,
      [styles['active']]: index === this.state.playItem.index,
    })
  }

  selectVideo (index, url) {
    // this.video.pause()
    this.setState({
      playItem: {
        index,
        url
      },
      playStatus: null
    })
  }

  handleVideoChange (e) {
    console.log(e.type)
    const {courseModel: {chapter}} = this.props
    const {playItem} = this.state
    const type = e.type
    if (type === 'ended') {
      if (playItem.index < chapter.length - 1) {
        const newPlayItem = {
          index: playItem.index + 1,
          url: chapter[playItem.index + 1].url
        }
        this.setState({
          playItem: newPlayItem
        })
        setTimeout(() => {
          this.video.play()
        }, 0)
      }
    } else {
      this.setState({
        playStatus: e.type
      })
    }
  }

  handlerGoBack () {
    const {dispatch, myHistory = {}} = this.props
    const {pUrl} = myHistory
    if (pUrl) {
      dispatch(routerRedux.goBack())
    } else {
      dispatch(routerRedux.replace('/college'))
    }
  }

  render () {
    const {courseModel, loading, userInfo, applyStatus} = this.props
    const {activeTabkey, videoHeight, ask, playItem, playStatus} = this.state
    const tabs = [
      {title: '课程介绍'},
      {title: '视频'},
      {title: '资料'}
    ]
    return (
      <div className={styles['classroom']}>
        <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={this.handlerGoBack}
             center={courseModel.name} />
        <div className={styles['header']} ref={ref => this.videoContainer = ref} style={{height: videoHeight}}>
          <video
            ref={video => this.video = video}
            className={styles['live-video']}
            poster={courseModel.thumb_img}
            src={playItem.url}
            controls
            playsInline
            onPlay={this.handleVideoChange}
            onPause={this.handleVideoChange}
            onEnded={this.handleVideoChange}
          >视频
          </video>
        </div>
        <div className={styles.tab_box}>
          <Tabs tabs={tabs}
                initialPage='1'
                onChange={this.callback}
                swipeable={false}
          >
            <div>
              <ClassInfo info={courseModel} />
            </div>

            <div>
              <ul className={styles['video-list']}>
                {
                  courseModel.chapter && courseModel.chapter.map((item, index) => (
                    <li className={this.calItemClassName(index)} key={index}
                        onClick={this.selectVideo.bind(this, index, item.url)}>
                      <Icon type={require('assets/svg/video_play.svg')} />
                      <span className={styles['video-item-name']}>{item.name}</span>
                      {
                        playItem.index === index ? (
                          <span style={{float: 'right'}}>
                          <i className={cx({
                            'icon': true,
                            'icon-video-playing': playStatus === 'play',
                            'icon-video-pause': playStatus === 'pause'
                          })} />
                        </span>
                        ) : null
                      }
                    </li>
                  ))
                }
                {!courseModel.chapter || courseModel.chapter.length <= 0 ?
                  <div className={styles['empty-hint']}>{applyStatus !== 6 ? '抱歉，您还不是正式学员' : '暂无视频'}</div> : null}
              </ul>
            </div>

            <div>
              {
                applyStatus !== 6 ? (
                  <div className={styles['empty-hint']}>抱歉，您还不是正式学员</div>
                ) : (
                  <DataList dataset={courseModel.datum_list || []} loading={loading} id={courseModel.id}
                            postEmail={this.postEmail} email={userInfo.email} />
                )
              }
            </div>
          </Tabs>
        </div>
      </div>
    )
  }
}
