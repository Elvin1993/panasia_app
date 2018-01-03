import React from 'react'
import { Link } from 'dva/router'
import Nav from 'components/Nav'
import CourseList from 'components/CourseList'
import Spinner from 'components/Spinner'
import styles from './MyStudying.less'

@connect(state => ({
  ...state.my.myBrowserHistory,
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {dispatch, size, dataset} = this.props
    // if(dataset.length <= 0) {
    dispatch({
      type: 'my/fetchBrowserHistory',
      payload: {
        params: {size, current: 1}
      }
    })
    // }
  }

  handlerScrollToBottom (cb) {
    console.log('onScrollToBottom')
    const {dispatch, size, current, total} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {size, current: current + 1}
    dispatch({type: 'my/fetchBrowserHistory', payload: {params}}).then(() => cb())
  }

  handlerClick (id) {
    const {dispatch} = this.props
    dispatch(routerRedux.push(`/edu/video/${id}`))
  }

  handlerOnScroll (Y) {
    const {dispatch} = this.props
    dispatch({type: 'my/saveMyStudyingPageY', payload: {Y}})
  }

  render () {
    const {loading, dataset, Y} = this.props
    const header = <Nav left={<Link to='/my/edu'><i className='icon icon-arrows-left' /></Link>} center='最近学习' />

    return (
      <div className='page'>
        <div className={styles.my_studying_page}>
          {dataset.length > 0
            ? <CourseList Y={Y} onScroll={this.handlerOnScroll} header={header} dataset={dataset} loading={loading} onScrollToBottom={this.handlerScrollToBottom} onClick={this.handlerClick} />
            : (!loading ? <div>{header}
              <div className={styles.empty_box}>您最近还没有学习过哦~</div>
            </div> : null)
          }
          {loading && dataset.length <= 0 &&
          <Spinner loading={loading} mask={false} />
          }
        </div>
      </div>
    )
  }
}
