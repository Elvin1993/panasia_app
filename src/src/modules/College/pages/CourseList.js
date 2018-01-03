import { Link } from 'dva/router'
import Nav from 'components/Nav'
import Carousel from 'components/Carousel'
import Spinner from 'components/Spinner'
import DropDownRefresh from 'components/DropDownRefresh'
import {SegmentedControl} from 'antd-mobile'
import moment from 'moment'

import sty from './CourseList.less'

@connect(
  state => ({
    loading: state.loading.global,
    coursesModel: state.college.coursesModel
  })
)
@autobind
export default class CourseList extends React.Component {

  state = {
    selectedIndex: 0
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'college/saveIndexPageY', payload: { modelName: 'coursesModel', scrollY: this.scrollY }})
  }

  componentDidMount () {
    const { dispatch, match: {params: { type }}, coursesModel: {dataset} } = this.props
    this.setState({
      selectedIndex: +type
    })
    if (dataset.length) {
      return
    }
    dispatch({
      type: 'college/fetchCourses',
      payload: { params: {
        'search[status]': +type < 1 ? 'start' : 'end'
      } }
    })
  }

  handlerOnScroll (Y) {
    this.scrollY = Y
  }

  handlerScrollToBottom(cb) {
    const {dispatch, coursesModel: { size, current, total }, match: {params: { type }}} = this.props
    if (current * size > total) {
      return cb()
    }
    const params = {
      size,
      current: current + 1,
      'search[status]': +type < 1 ? 'start' : 'end'
    }

    dispatch({type: 'college/saveIndexPageY', payload: { modelName: 'coursesModel', scrollY: this.scrollY }})
    dispatch({type: 'college/fetchCourses', payload: {params, cb}})
  }

  onChange(e) {
    const { dispatch } = this.props
    const index = e.nativeEvent.selectedSegmentIndex
    dispatch(routerRedux.replace(`/college/course/${index}`))
  }

  render () {
    const {dispatch, loading, coursesModel: { dataset, total, current, size, Y }, match: {params: { type }}} = this.props
    const { selectedIndex } = this.state
    return (
      <div className='page'>
        <DropDownRefresh
          Y={Y}
          onScroll={this.handlerOnScroll}
          loading={loading}
          className={sty.list_page}
          onScrollToBottom={this.handlerScrollToBottom}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => { dispatch(routerRedux.goBack()) }} center='课程列表' />

          <SegmentedControl className={sty.control_bar} tintColor="#3d74c7" selectedIndex={selectedIndex} values={['即将开始', '已结束']} onChange={this.onChange} />
          <div className={sty['list']}>
            {
              dataset.map(item => {
                const start_time = moment(item.start_time * 1000)
                const end_time = moment(item.end_time * 1000)
                return (
                  <Link className={sty['item']} to={`/college/${+type < 1 ? 'trailer' : 'classroom'}/${item.id}`} key={item.id} >
                    <div className={sty['top']}>
                      <img src={item.thumb_img} alt="" />
                      <div className={sty.desc}>
                        <div className={sty.name}>{item.name}</div>
                        <p>主讲人: {item.lecturer}</p>
                        <p>{item.lecturer_identity_desc}</p>
                      </div>
                    </div>
                    <div className={sty['info']}>
                      <p>课程时间：{ `${start_time.format('M月D日 ddd HH:mm')}-${end_time.format('HH:mm')}` }</p>
                      <p>地点：{`${item.city}市${item.address}`}</p>
                    </div>
                  </Link>
                )
              })
            }
            { dataset.length <= 0 ? <div className={sty['empty-hint']}>暂无课程</div> : null }
            {!loading && !!+total && (current * size >= total) && <div className='empty_box'>———— 列表到底了 ————</div>}
          </div>
          {
            (dataset.length <= 0 && loading) && <Spinner loading mask={false} />
          }
        </DropDownRefresh >
      </div >
    )
  }
}
