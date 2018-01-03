import { Link } from 'dva/router'
import Nav from 'components/Nav'
import UserList from 'components/UserList'
import { Modal } from 'antd-mobile'
import DropDownRefresh from 'components/DropDownRefresh'
import UserItem from 'components/UserItem'

import sty from './Classmates.less'

@connect(
  state => ({
    classmatesModel: state.college.classmatesModel,
    loading: state.loading.global
  })
)
@autobind
export default class Classmates extends React.Component {

  state = {
    modal: false
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch({type: 'college/saveIndexPageY', payload: { modelName: 'classmatesModel', scrollY: this.scrollY }})
  }

  componentDidMount () {
    const { dispatch, classmatesModel: {dataset} } = this.props
    dispatch({
       type: 'college/fetchApplyStatus',
       payload: {
         cb: (code) => {
          if (code !== 6) {
            this.setState({
              modal: true
            })
          }
         }
       }
    })
    if (dataset.length) {
      return
    }
    
    dispatch({
      type: 'college/fetchClassmates'
    })
  }

  handlerScrollToBottom (cb) {
    const {dispatch, classmatesModel: { size, current, total }} = this.props
    if (current * size >= total) {
      return cb()
    }
    const params = {size, current: current + 1}

    dispatch({type: 'college/saveIndexPageY', payload: { modelName: 'classmatesModel', scrollY: this.scrollY }})
    dispatch({type: 'college/fetchClassmates', payload: {params, cb}})
  }

  handlerLink (uid) {
    const {dispatch} = this.props
    dispatch(routerRedux.push(`/college/classmate/${uid}`))
  }
  

  handlerOnScroll (Y) {
    this.scrollY = Y
  }

  onClose() {
    this.setState({
      modal: false
    })
  }

  render () {
    const {dispatch, loading, classmatesModel: { Y, size, current, total, dataset }} = this.props

    return (
      <div className='page'>
        <DropDownRefresh Y={Y} onScroll={this.handlerOnScroll} loading={loading} className={sty.home_content} onScrollToBottom={this.handlerScrollToBottom}>
          <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={() => { dispatch(routerRedux.goBack()) }} center='本期学员' />
          {
            dataset.map((item, index) => <UserItem onLink={this.handlerLink} data={item} key={index} />)
          }
          { dataset.length <= 0 ? <div className={sty['empty-hint']}>暂无学员</div> : null }
          {!loading && !!+total && (current * size >= total) && <div className='empty_box'>———— 列表到底了 ————</div>}
        </DropDownRefresh>
        <Modal
          transparent
          maskClosable={false}
          visible={this.state.modal}
          onClose={this.onClose.bind(this)}
          footer={[{ text: '确定', onPress: () => { this.onClose.call(this) } }]}
        >
          <p className={sty['hint']}>抱歉，您还不是正式学员</p>
          <p className={sty['hint']}>不能看到完整通讯录信息</p>
        </Modal>
      </div >
    )
  }
}
