import React from 'react'
import { connect } from 'dva'
import autobind from 'autobind-decorator'
import { routerRedux } from 'dva/router'
import Nav from 'components/Nav'
import CourseItem from 'components/CourseItem'
import { InitWXShare } from 'utils/WeiXin'
import styles from './SeriesCourse.less'

@connect(state => ({
  ...state.edu.seriesListModel,
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    wx.ready(() => InitWXShare())
    this.init()
  }

  init () {
    const {dispatch, dataset = [], match: {params: {id}}, size} = this.props
    dispatch({
      type: 'edu/fetchSeriesList',
      payload: {
        params: {
          size,
          current: 1,
          pagination: 1,
          id
        }
      }
    })
  }

  handlerClick (item) {
    const {id} = item
    const {dispatch} = this.props

    dispatch(routerRedux.push(`/edu/video/${id}`))
  }

  render () {
    const {dispatch, dataset = [], loading, type, info = {}} = this.props

    return (
      <div className='page'>
        <div className={styles.series_course_page}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => dispatch(routerRedux.goBack())} center={info.name} />
          {
            info.thumb_img &&
            <div className={styles.top_img}>
              <img src={info.thumb_img} alt='' />
            </div>
          }
          <div className={styles.content}>
            <p className={styles.summary}>
              {info.desc}
            </p>
            <div className={styles.course_list}>
              {
                dataset.map((item, key) => {
                  return <CourseItem key={key} dataset={item} onClick={() => this.handlerClick(item)} />
                })
              }
            </div>
            {!loading && <div className='empty_box'>———— 列表到底了 ————</div>}
          </div>
        </div>
      </div>
    )
  }
}
