import { Tabs } from 'antd-mobile'
import autobind from 'autobind-decorator'
import cx from 'classname'
import Carousel from 'components/Carousel'
import Nav from 'components/Nav'
import Spinner from 'components/Spinner'
import TabBar from 'components/TabBar'
import { connect } from 'dva'
import { Link } from 'dva/router'
import React from 'react'
import { InitWXShare } from 'utils/WeiXin'
import styles from './IndexPage.less'

const TabPane = Tabs.TabPane
const Colors = ['#9fd369', '#fa7053', '#ffcd54', '#62a2f3', '#bda6f5', '#68d9f5', '#ed9898', '#f7b67c', '#7fbef3']
@connect(state => ({
  ...state.edu,
  loading: state.loading.models.edu
}))
@autobind
export default class IndexPage extends React.Component {
  static propTypes = {}

  componentDidMount () {
    const {dispatch, match, location: {query: {is_preview}}, bannerModel, banner2, types, recommend} = this.props

    wx.ready(() => InitWXShare())
    if (bannerModel.dataset.length <= 0) {
      dispatch({
        type: 'edu/fetchBanner',
        payload: {
          params: {
            search: {
              system_group: 'training',
              system_group_position: 1
            }
          }
        }
      })
    }

    if (!banner2.id) {
      dispatch({
        type: 'edu/fetchBanner',
        payload: {
          params: {
            search: {
              system_group: 'training',
              system_group_position: 2
            }
          },
          banner2: true
        }
      })
    }

    if (!types || !types.operationList.length || !types.industryList.length) {
      dispatch({
        type: 'edu/fetchTypes'
      })
    }
    if (!recommend.hot.id) {
      dispatch({
        type: 'edu/fetchRecommend',
        payload: {
          params: {
            is_preview
          }
        }
      })
    }
  }

  renderItem (item = {}, key) {
    const {id, name, thumb_img} = item

    return (
      <Link key={key} to={`/edu/video/${id}`} className={styles.course_item}>
        <div className={styles.img_wrapper}>
          <img src={thumb_img} />
        </div>
        <p>{name}</p>
      </Link>
    )
  }

  getSmallType (name = '?') {
    return name.substr(0, 1)
  }

  render () {
    const {bannerModel, banner2, loading, types: {operationList, industryList}, recommend: {hot, other}} = this.props
    const hotList = hot.video_list || []

    const tabs = [
      {title: '业务分类'},
      {title: '行业分类'}
    ]

    return (
      <div className='page'>
        <div className={styles.edu_page}>
          <Nav left={<Link to='/edu/search'><i className='icon icon_search' /></Link>} center='淘金课堂' />
          <Carousel {...bannerModel} />
          <div className={styles.type_box_wrapper}>
            <Tabs initialPage='1'
                  tabs={tabs}
                  onChange={(tab, index) => { console.log('onChange', index, tab) }}
                  onTabClick={(tab, index) => { console.log('onTabClick', index, tab) }}
            >
              <div>
                <ul className={styles.type_box}>
                  {
                    operationList.map((item, key) => {
                      let color = (key > Colors.length - 1) ? Colors[key % Colors.length] : Colors[key]
                      return (
                        <Link key={key} to={`/edu/course/${item.id}`} className={styles.type}>
                          <li>
                            <div className={styles.icon}
                                 style={{backgroundColor: color}}>{this.getSmallType(item.name)}</div>
                            <span>{item.name}</span>
                          </li>
                        </Link>
                      )
                    })
                  }
                  <Link to={`/edu/course/all`} className={styles.type}>
                    <li>
                      <div className={styles.icon} style={{backgroundColor: '#abb5ca'}}>...</div>
                      <span>全部</span>
                    </li>
                  </Link>
                </ul>
              </div>
              <div>
                <ul className={styles.type_box}>
                  {
                    industryList.map((item, key) => {
                      let color = (key > Colors.length - 1) ? Colors[key % Colors.length] : Colors[key]
                      return (
                        <Link key={key} to={`/edu/course/${item.id}`} className={styles.type}>
                          <li>
                            <div className={styles.icon}
                                 style={{backgroundColor: color}}>{this.getSmallType(item.name)}</div>
                            <span>{item.name}</span>
                          </li>
                        </Link>
                      )
                    })
                  }
                  <Link to={`/edu/course/all`} className={styles.type}>
                    <li>
                      <div className={styles.icon} style={{backgroundColor: '#abb5ca'}}>...</div>
                      <span>全部</span>
                    </li>
                  </Link>
                </ul>
              </div>
            </Tabs>
          </div>
          <div className={styles.recomment_banner}>
            <div className={styles.hot} />
            <div className={cx(styles.content_box, 'clearfix')}>
              {
                hotList.map(this.renderItem)
              }
            </div>
          </div>
          <a href={banner2.jump_url} className={styles.banner}>
            <img src={banner2.thumb_image} alt='' />
          </a>

          {
            other.map((recomment, key) => {
              const {name, link, range_id, video_list = [], recommend_type} = recomment
              const link_url = (recommend_type === 'special') ? link : `/edu/course/${range_id}`
              return (
                <div key={key} className={styles.recomment_banner}>
                  <div className={styles.title}>
                    <h1>{name}</h1>
                    {
                      recommend_type === 'special' ? <a href={link} className={styles.showAll}>查看更多></a>
                        : <Link to={`/edu/course/${range_id}`} className={styles.showAll}>
                          查看更多>
                        </Link>
                    }
                  </div>
                  <div className={cx(styles.content_box, 'clearfix')}>
                    {
                      video_list.map(this.renderItem)
                    }
                  </div>
                </div>
              )
            })
          }

        </div>
        <TabBar activity='edu' />
        <Spinner loading={loading} mask={false} />
      </div>
    )
  }
}
