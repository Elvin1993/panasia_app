import React from 'react'
import { connect } from 'dva'
import autobind from 'autobind-decorator'
import { routerRedux } from 'dva/router'
import Nav from 'components/Nav'
import CourseItem from 'components/CourseItem'
import { InitWXShare } from 'utils/WeiXin'
import styles from './Special.less'

@connect(state => ({
  ...state.edu.specialListModel,
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
      type: 'edu/fetchSpecialList',
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
    const {dispatch, dataset = [], loading, info = {}} = this.props
    console.log(dataset)

    return (
      <div className='page'>
        <div className={styles.series_course_page}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => dispatch(routerRedux.goBack())} center='专题推荐' />
          <h1 className={styles.title}>{info.name}</h1>
          <div className={styles.summary} dangerouslySetInnerHTML={{__html: info.desc}} />
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
    )
  }
}
