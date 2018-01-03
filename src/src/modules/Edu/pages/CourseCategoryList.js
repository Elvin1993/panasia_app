import autobind from 'autobind-decorator'
import CourseItem from 'components/CourseItem'
import DropDownRefresh from 'components/DropDownRefresh'
import Nav from 'components/Nav'
import { connect } from 'dva'
import { Link, routerRedux } from 'dva/router'
import React from 'react'
import { InitWXShare } from 'utils/WeiXin'
import styles from './CourseCategoryList.less'

@connect(state => ({
  ...state.edu.categoryListModel,
  loading: state.loading.models.edu
}))
@autobind
export default class extends React.Component {

  componentDidMount () {
    wx.ready(() => InitWXShare())
    this.init()
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'edu/saveCourseCategoryPageY', payload: {Y: this.scrollY}})
  }

  init () {
    const {categoryId, dispatch, match: {params: {id}}, dataset = [], size} = this.props
    if (categoryId === id) {
      return
    }
    dispatch({
      type: 'edu/fetchCategoryList',
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

  // componentDidUpdate(prevProps, prevState, prevContext) {
  //   if(this.props.params.id !== prevProps.params.id) {
  //     this.init()
  //   }
  // }

  handlerClick (item) {
    const {id} = item
    const {dispatch} = this.props

    dispatch(routerRedux.push(`/edu/video/${id}`))
  }

  renderItem (item = {}, key) {
    const {id, name, thumb_img, type} = item

    return (
      <Link key={key} to={`/edu/series/${id}`} className={styles.item}>
        <img src={thumb_img} alt='缩略图' />
        <div className={styles.name_mask}>
          <div className={styles.name}>
            {name}
          </div>
        </div>
      </Link>
    )
  }

  handlerScrollToBottom (cb) {
    const {dispatch, size, current, total, match: {params: {id}}} = this.props

    if (current * size > total) {
      return cb()
    }
    const params = {size, current: current + 1, pagination: 1, id}

    dispatch({type: 'edu/fetchCategoryList', payload: {params, cb}})
  }

  handlerOnScroll (Y) {
    this.scrollY = Y
  }

  render () {
    const {Y, dispatch, dataset = [], loading, type, info = {}, size, current, total} = this.props
    return (
      <div className='page'>
        <DropDownRefresh Y={Y} loading={loading} className={styles.list_page}
                         onScrollToBottom={this.handlerScrollToBottom} onScroll={this.handlerOnScroll}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => dispatch(routerRedux.goBack())}
               center={info.name || '全部课程'} />
          {
            type === 'video_category' ? dataset.map(this.renderItem)
              : dataset.map((item, key) => {
                return <CourseItem key={key} dataset={item} onClick={() => this.handlerClick(item)} />
              })
          }
          {!loading && (current * size > total) && <div className='empty_box'>———— 列表到底了 ————</div>}
        </DropDownRefresh>
      </div>
    )
  }
}
