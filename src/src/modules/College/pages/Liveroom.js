import React, { Component } from 'react'
import { Link } from 'dva/router'
import { Tabs, InputItem, Button } from 'antd-mobile'
import IScroll from 'iscroll/build/iscroll-probe'
import Nav from 'components/Nav'
import ClassInfo from 'components/ClassInfo'
import QuestionItem from 'components/QuestionItem'
import DataList from 'components/DataList'
import styles from './index.less'

const TabPane = Tabs.TabPane

@connect(
  state => ({
    loading: state.loading.global,
    liveModel: {...state.college.liveModel.dataset},
    liveModelLoading: state.college.liveModel.loading,
    questionsModel: state.college.questionsModel,
    userInfo: {...state.my.myInfoModel.dataset}
  })
)
export default class Liveroom extends Component {
  constructor(props) {
    super(props)
    this.callback = this.callback.bind(this)
    this.send = this.send.bind(this)
    this.questionChange = this.questionChange.bind(this)
    this.postEmail = this.postEmail.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.loadMore = false
  }

  state = {
    activeTabkey: '2',
    videoHeight: 375,
    ask: '',
  }

  callback (activeTabkey) {
    this.setState({
      activeTabkey: activeTabkey
    })
    console.log(this.wrapper)
    if (activeTabkey === '2') {
      this.scrollBottom(this)
    }
  }

  send() {
    console.log(this.state.ask)
    const { dispatch, liveModel, questionsModel } = this.props
    if (this.state.ask.trim() === '') {
      return
    }
    dispatch({
      type: 'college/ask',
      payload: {
        params: {
          content: this.state.ask,
          business_course_id: liveModel.id
        },
        cb: () => {
          this.setState({
            ask: ''
          })
          const lastQusetion = questionsModel[questionsModel.length - 1]
          const fetch_time = lastQusetion ? lastQusetion.create_time : 0
          const id = lastQusetion ? lastQusetion.id : 0
          this.fetchQuestions(fetch_time, id, 'down', () => this.scrollBottom(this))
        }
      }
    })
  }

  scrollBottom(that) {
    setTimeout(function () {
      that.myScroll.refresh()
      const wrapperHeight = that.wrapper.getClientRects()[0].height
      const scrollHeight = that.list.getClientRects()[0].height - wrapperHeight
      if (scrollHeight > 0) {
        that.myScroll.scrollTo(0, -scrollHeight)
      }
    }, 0)
  }

  componentDidMount () {
    const { width } = this.videoContainer.getClientRects()[0]
    const { dispatch } = this.props
    let height = width * 9 / 16, that = this
    this.setState({
      videoHeight: height,
      // activeTabkey: '1'
    })
    
    this.myScroll = new IScroll(this.wrapper, {
      probeType: 2,
      mouseWheel: true 
    })

    this.myScroll.on('scroll', function() {
      that.scrollY = this.y
      if (this.y > 30 && !that.loadMore) {
        that.loadMore = true
        that.setState({
          loadMore: true
        })
      }
    })

    this.myScroll.on('scrollEnd', function() {
      if (that.loadMore) {
        that.myScroll.refresh()
        const lastQusetion = that.props.questionsModel[0]
        const fetch_time = lastQusetion ? lastQusetion.create_time : 0
        const id = lastQusetion ? lastQusetion.id : 0
        that.fetchQuestions.call(that, fetch_time, id, 'up', () => {
          that.setState({
            loadMore: false
          })
          that.loadMore = false
          that.myScroll.refresh()
        })
      }
    })

    this.scrollBottom(this)

    dispatch({
      type: 'college/fetchLive',
      payload: {
        cb: (data) => {
          if (data.is_living) {
            this.timeoutID = setTimeout(() => {
              this.polling()
            }, 5000)
          } else {
            dispatch(routerRedux.replace(`/college/trailer/${data.id}`))
          }
        }
      }
    })

  }

  polling() {
    const { questionsModel } = this.props
    const lastQusetion = questionsModel[questionsModel.length - 1]
    const fetch_time = lastQusetion ? lastQusetion.create_time : 0
    const id = lastQusetion ? lastQusetion.id : 0
    this.fetchQuestions(fetch_time, id, 'down', () => {
      this.myScroll.refresh()
      const maxScrollY = this.myScroll.maxScrollY
      console.log(maxScrollY, this.myScroll.y)
      if (maxScrollY - this.myScroll.y > -200 ) {
        this.scrollBottom(this)
      }
      this.timeoutID = setTimeout(() => {
        this.polling()
      }, 5000)
    })
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID)
  }

  fetchQuestions(fetch_time, id, direction, cb) {
    const { dispatch, questionsModel, liveModel } = this.props
    console.log('fetchQuestions')
    dispatch({
      type: 'college/fetchQuestions',
      payload: {
        params: {
          fetch_time,
          id,
          direction,
          business_course_id: liveModel.id
        },
        cb: () => {
          cb && cb()
        }
      }
    })
  }

  scrollRefresh(myScroll) {
    setTimeout(function () {
      myScroll.refresh()
    }, 0)
  }

  questionChange(value) {
    this.setState({
      ask: value
    })
  }

  postEmail (params, cb) {
    const { dispatch } = this.props
    params.business_course_id = params.id
    delete params.id
    console.log(params)
    dispatch({type: 'college/postFile2Email', payload: {params, cb}})
  }

  handleFocus() {
    console.log('Focus')
    console.log(document.body.scrollTop, document.body.scrollHeight)
    document.body.scrollTop = document.body.scrollHeight
  }

  render () {
    const { dispatch, liveModel, questionsModel, loading, userInfo, liveModelLoading } = this.props
    const { activeTabkey, videoHeight, ask } = this.state
    return (
      <div className={styles['liveroom']}>
        <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => { dispatch(routerRedux.goBack()) }} center='课程' />
        <div>
          <div className={styles['header']} ref={ref => this.videoContainer = ref} style={{ height: videoHeight }}>
            <video
              className={styles['live-video']}
              poster={liveModel.thumb_img}
              controls
              playsInline
              src={ liveModel.id ? `http://push.ztrust.com/wechat/college_id.m3u8` : null }></video>
          </div>
        </div>
        <Tabs className={styles.tab_box} activeKey={activeTabkey} onChange={this.callback} swipeable={false}>
          <TabPane tab="课程介绍" key="1">
            <ClassInfo info={liveModel} />
          </TabPane>
          <TabPane tab="提问" key="2">
            <div className={styles['question-container']} ref={ ref => this.wrapper = ref }>  
              <div className={styles['question-list']} ref={ ref => this.list = ref }>
                {
                  this.state.loadMore ? (
                    <div className="svg-reload">
                      <img src="img/Reload.gif" alt="Reload" />
                    </div>
                  ) : null
                }
                { questionsModel.map((item, index) => <QuestionItem key={index} {...item} />) }
                { questionsModel.length <= 0 ? <div className={styles['empty-hint']}>暂无提问</div> : null }
              </div>
            </div>
          </TabPane>
          <TabPane tab='资料' key='3'>
            <DataList dataset={liveModel.datum_list} loading={loading} id={liveModel.id} postEmail={this.postEmail} email={userInfo.email}  />
          </TabPane>
        </Tabs>
        <div style={{ display: activeTabkey !== '2' ? 'none' : 'block' }} className={styles['footer']}>
          <div className={styles['notice']}>请注意，一次课程仅有三次提问机会哦。</div>
          <div className={styles['input-container']}>
            <InputItem className={styles['footer-input']} placeholder="我要提问" value={ask} onChange={this.questionChange} onFocus={this.handleFocus}/>
            <Button type="primary" inline size="small" className={styles['footer-btn']} onClick={this.send}>发送</Button>
          </div>
        </div>
        <div className={styles['mask']} style={{ display: liveModelLoading ? 'block' : 'none' }}>
          <div className={styles['mask-placeholder']} style={{ height: '3rem' }}></div>
          <div className={styles['mask-placeholder']} style={{ width: '90%' }}></div>
          <div className={styles['mask-placeholder']} style={{ width: '80%' }}></div>
          <div className={styles['mask-placeholder']} style={{ width: '60%' }}></div>
          <div className={styles['mask-placeholder']} style={{ width: '80%' }}></div>
        </div>
      </div>
    )
  }
}
