import { Button } from 'antd-mobile'
import ClassInfo from 'components/ClassInfo'
import Nav from 'components/Nav'
import moment from 'moment'
import React, { Component } from 'react'
import ReactPlaceholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import styles from './index.less'

@connect(
  state => ({
    myHistory: state.app.myHistory,
    loading: state.loading.global,
    courseModel: {...state.college.courseModel}
  })
)
@autobind
export default class Trailer extends Component {
  time = 0
  startTime = new Date().getTime()

  state = {
    hint: null
  }

  setAlert () {
    const {dispatch, match: {params: {id}}} = this.props
    dispatch({
      type: 'college/setAlert',
      payload: {
        params: {business_course_id: id}
      }
    })
  }

  setTimer () {
    this.time++
    let offset = new Date().getTime() - (this.startTime + this.time * 1000)
    let nextTime = 1000 - offset
    if (nextTime < 0) nextTime = 0
    this.timer = setTimeout(this.setTimer, nextTime)
    let offsetTime = (this.props.courseModel.start_time * 1000 - new Date().getTime()) / 1000
    let h = parseInt(offsetTime / 3600)
    let m = parseInt(parseInt(offsetTime % 3600) / 60)
    let s = parseInt(parseInt(offsetTime % 3600) % 60)
    this.setState({
      hint: `距离开课还有：${h}小时${m}分钟${s}秒`
    })
    if (offsetTime <= 0) {
      this.props.dispatch(routerRedux.replace('/college/liveroom'))
    }
    console.log(`距离开课还有：${h}小时${m}分钟${s}秒`)
  }

  awesomePlaceholder () {
    const color = '#f2f6f9'
    return (
      <div style={{padding: '.3rem'}}>
        <RectShape style={{height: 300}} color={color} />
        <RectShape style={{height: 30, margin: '.3rem 0'}} color={color} />
        <RectShape style={{height: 30, width: 200, margin: '.3rem 0'}} color={color} />
        <RectShape style={{height: 30, margin: '.3rem 0'}} color={color} />
        <RectShape style={{height: 30, width: 400, margin: '.3rem 0'}} color={color} />
      </div>
    )
  }

  componentDidMount () {
    const {dispatch, match: {params: {id}}} = this.props
    dispatch({
      type: 'college/fetchCourse',
      payload: {
        params: {id},
        cb: (data) => {
          console.log(data.start_time * 1000 - new Date().getTime())
          console.log(new Date().getTime())
          const diff = data.start_time * 1000 - new Date().getTime()
          if (diff <= 86400000 && diff > 0) {
            this.timer = setTimeout(this.setTimer, 1000)
          }
        }
      }
    })
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
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
    const {dispatch, courseModel, loading} = this.props
    const {hint} = this.state
    const start_time = moment(courseModel.start_time * 1000)
    const end_time = moment(courseModel.end_time * 1000)

    return (
      <div className={styles['trailer']}>
        <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={this.handlerGoBack} center='课程' />
        <ReactPlaceholder customPlaceholder={this.awesomePlaceholder()} ready={!courseModel.loading} ref='box'>
          <div>
            <div className={styles['header']}>
              <img src={courseModel.thumb_img} alt='banner' />
              <div className={styles['banner-title']}>
                <span className='icon icon-volume' />
                <p>{hint ? hint : `开课时间: ${start_time.format('M月D日 ddd HH:mm')}-${end_time.format('HH:mm')}`}</p>
              </div>
            </div>
            <div className={styles['content-item']}>
              <h3>{courseModel.name}</h3>
              <p>开课时间: {`${start_time.format('M月D日 ddd HH:mm')}-${end_time.format('HH:mm')}`}</p>
              <p>地点: {`${courseModel.city}市${courseModel.address}`}</p>
            </div>
            <ClassInfo info={courseModel} />
            <div className={styles['footer']}>
              <Button type='primary' onClick={this.setAlert} loading={loading}
                      disabled={loading || courseModel.is_notice}>{!courseModel.is_notice ? '开课前提醒我' : '已设置开课前提醒'}</Button>
            </div>
          </div>
        </ReactPlaceholder>
      </div>
    )
  }
}
