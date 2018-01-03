import { Link } from 'dva/router'
import Nav from 'components/Nav'
import Spinner from 'components/Spinner'
import ActivityList from 'components/ActivityList'
import styles from './MyActivityPage.less'

@connect(state => ({
  ...state.my.activityModel,
  loading: state.loading.global
}))
@autobind
export default class MyActivity extends React.Component {
  static propTypes = {}

  componentDidMount () {
    const {dispatch, dataset} = this.props
    // if (dataset.length > 0) {
    //   return
    // }
    dispatch({
      type: 'my/fetchUserActivitys'
      // payload: { params: {current: 1}}
    })
  }

  handlerScrollToBottom (cb) {
    cb && cb()
    // const {dispatch, current} = this.props
    // const params = {current: current + 1}
    //
    // dispatch({type: 'my/fetchUserActivitys', payload: { params, cb}})
  }

  handlerOnScroll (Y) {
    const {dispatch} = this.props
    dispatch({type: 'my/saveMyActivityPageY', payload: {Y}})
  }

  render () {
    const {dispatch, dataset, loading, location, Y} = this.props
    const header = <Nav left={<Link to='/my'><i className='icon icon-arrows-left' /></Link>} center='我的活动' />
    return (
      <div className='page'>
        {!loading && dataset.length <= 0 && header}
        {dataset.length > 0 && <ActivityList Y={Y} onScroll={this.handlerOnScroll} header={header} dataset={dataset} loading={loading} onScrollToBottom={this.handlerScrollToBottom} />}
        {!loading && dataset.length <= 0 && <div className={styles.empty_box}>您还没有参加过活动哟~</div>}
        {/* <Spinner loading={loading} mask={false} /> */}
      </div>
    )
  }
}
