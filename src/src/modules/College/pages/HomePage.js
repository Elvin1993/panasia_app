import { Link } from 'dva/router'
import Nav from 'components/Nav'
import Carousel from 'components/Carousel'
import Spinner from 'components/Spinner'
import DropDownRefresh from 'components/DropDownRefresh'
import ArticleList from 'components/ArticleList'

import sty from './HomePage.less'

@connect(
  state => ({
    userInfo: {...state.my.myInfoModel.dataset},
    ...state.college.articleModel,
    bannerList: state.college.bannerModel,
    loading: state.loading.global
  })
)
@autobind
export default class HomePage extends React.Component {

  componentDidMount () {
    const { dispatch, dataset } = this.props
    if (dataset.length) {
      return
    }
    dispatch({
      type: 'college/fetchBanner',
      payload: { params: {} }
    })
    dispatch({
      type: 'college/fetchArticles',
      payload: { params: {} }
    })
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'college/saveIndexPageY', payload: { modelName: 'articleModel', scrollY: this.scrollY }})
  }

  handlerClick (id) {
    const { dispatch } = this.props
    dispatch(routerRedux.push(`/article/detail/${id}`))
  }

  handlerOnScroll (Y) {
    this.scrollY = Y
  }

  handlerScrollToBottom (cb) {
    const {dispatch, size, current, total} = this.props
    if (current * size >= total) {
      return cb()
    }
    const params = {size, current: current + 1}

    dispatch({type: 'college/saveIndexPageY', payload: { modelName: 'articleModel', scrollY: this.scrollY }})
    dispatch({type: 'college/fetchArticles', payload: {params, cb}})
  }

  go (url) {
    const { dispatch } = this.props
    dispatch(routerRedux.push(url))
  }

  render () {
    const {dispatch, loading, bannerList, dataset, Y, current, size, total} = this.props
    console.log(Y)
    return (
      <div className='page'>
        <DropDownRefresh Y={Y} onScroll={this.handlerOnScroll} loading={loading} className={sty.home_content} onScrollToBottom={this.handlerScrollToBottom}>
          <Nav center='智信资管研习社' />
          <Carousel {...bannerList} />
          <ul className={sty.menu}>
            <li onClick={() => this.go('/college/classmates')}>
              <i className='icon icon_schoolmate' />
              <p>同学</p>
            </li>
            <li onClick={() => this.go('/college/course/0')}>
              <i className='icon icon_course' />
              <p>课程</p>
            </li>
            <li onClick={() => this.go('/college/liveroom')}>
              <i className='icon icon_live' />
              <p>直播</p>
            </li>
          </ul>
          <Link to='/college/any' className={sty.center_banner}>
            <img src='img/college_center_banner.jpg' alt='banner' />
          </Link>
          <ArticleList data={dataset} click={this.handlerClick} />
          {!loading && !!+total && (current * size >= total) && <div className='empty_box'>———— 列表到底了 ————</div>}
          {(dataset.length <= 0 && loading) && <Spinner loading mask={false} /> }
        </DropDownRefresh>
      </div>
    )
  }
}
