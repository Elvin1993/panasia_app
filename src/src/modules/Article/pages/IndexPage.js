import ArticleList from 'components/ArticleList'
import Carousel from 'components/Carousel'
import DropDownRefresh from 'components/DropDownRefresh'
import Nav from 'components/Nav'
import Spinner from 'components/Spinner'
import TabBar from 'components/TabBar'
import { Link, routerRedux } from 'dva/router'
import { InitWXShare } from 'utils/WeiXin'
import styles from './IndexPage.less'

@connect(state => ({
  ...state.article.articleModel,
  bannerList: state.article.bannerModel,
  loading: state.loading.global
}))
@autobind
export default class ArticleIndexPage extends React.PureComponent {
  static propTypes = {}

  componentDidMount () {
    const {dispatch, size, dataset} = this.props
    wx.ready(() => InitWXShare())
    if (dataset.length) {
      return
    }
    dispatch({
      type: 'article/fetchBanner',
      payload: {
        params: {search: {system_group: 'mobile', system_group_position: 1}}
      }
    }).then(() => {
      console.log('article/fetchBanner done')
    })

    dispatch({
      type: 'article/fetchArticle',
      payload: {
        params: {size, current: 1}
      }
    }).then(() => {
      console.log('article/fetchArticle done')
    })
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'article/saveIndexPageY', payload: {Y: this.scrollY}})
  }

  handlerScrollToBottom (cb) {
    const {dispatch, size, current, total} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {size, current: current + 1}
    dispatch({type: 'article/saveIndexPageY', payload: {Y: this.scrollY}})
    dispatch({type: 'article/fetchArticle', payload: {params, cb}})
  }

  handlerOnScroll (Y) {
    this.scrollY = Y
  }

  handlerClick (id) {
    const {dispatch} = this.props
    dispatch(routerRedux.push(`/article/detail/${id}`))
  }

  render () {
    const {loading, bannerList, dataset, size, current, total, Y} = this.props

    return (
      <div className='page'>
        <DropDownRefresh Y={Y}
                         onScroll={this.handlerOnScroll}
                         loading={loading}
                         className={styles.home_content}
                         onScrollToBottom={this.handlerScrollToBottom}>
          <Nav left={<Link to='/article/search'><i className='icon icon_search' /></Link>} />
          <Carousel {...bannerList} />
          <ArticleList data={dataset} click={this.handlerClick} />
          {!loading && !!+total && (current * size > total) && <div className='empty_box'>———— 列表到底了 ————</div>}
        </DropDownRefresh>
        <TabBar activity='article' />
        {(dataset.length <= 0 && loading) && <Spinner loading mask={false} />}
      </div>
    )
  }
}
