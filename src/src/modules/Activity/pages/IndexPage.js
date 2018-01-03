import { Link } from 'dva/router'
import Nav from 'components/Nav'
import TabBar from 'components/TabBar'
import ActivityList from 'components/ActivityList.js'
import Spinner from 'components/Spinner'
import { InitWXShare } from 'utils/WeiXin'

@connect(state => ({...state.activity.activityListModel, loading: state.loading.global}))
@autobind
export default class extends React.Component {
  static propTypes = {}

  componentDidMount () {
    const {dispatch, dataset = {}} = this.props
    wx.ready(() => InitWXShare())
    if (dataset.length > 0) {
      return
    }
    dispatch({
      type: 'activity/fetchActivity',
      payload: {params: {current: 1}}
    })
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'activity/saveIndexPageY', payload: {Y: this.scrollY}})
  }

  handlerScrollToBottom (cb) {
    const {dispatch, current, size, total} = this.props
    let params
    if (current * size > total) {
      return cb()
    }

    params = {current: current + 1}
    dispatch({type: 'activity/fetchActivity', payload: {params, cb}})
  }

  handlerOnScroll (Y) {
    this.scrollY = Y
  }

  render () {
    const {loading, dataset = [], current, size, total, Y} = this.props
    const header = <Nav left={<Link to='/activity/search'><i className='icon icon_search' /></Link>} center='活动' />
    return (
      <div className='page'>
        <ActivityList Y={Y} header={header} dataset={dataset} loading={loading} onScroll={this.handlerOnScroll} onScrollToBottom={this.handlerScrollToBottom} current={current} size={size}
          total={total} />
        <TabBar activity='activity' />
        {dataset.length <= 0 && loading ? <Spinner loading mask={false} /> : null}
      </div>
    )
  }
}
