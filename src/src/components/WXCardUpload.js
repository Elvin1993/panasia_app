import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Dialog from 'rc-dialog'
import styles from './WXCardUpload.less'
// import { Init as WX_Init } from 'utils/WeiXin'

// @WX_Init()
@autobind
export default class WXCardUpload extends Component {
  static defaultProps = {
    editing: true
  }

  constructor (props) {
    super(props)
    this.state = {
      successDialogVisible: false
    }
  }

  WXUploadImage (cb, e) {
    e.preventDefault()
    e.stopPropagation()
    // const API_ = this.props.API || API
    if (!wx) {
      return
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let localId = res.localIds[0] // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        wx.uploadImage({
          localId: localId,
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: (res) => {
            const media_id = res.serverId // 返回图片的服务器端ID
            API.get('/user/getTempMedia', {media_id})
               .then((ret) => {
                 if (ret.code !== 0) {
                   alert('上传失败,请重试')
                   return false
                 }
                 let url = ret.dataset
                 cb && cb(url)
               })
          }
        })
      }
    })
  }

  hideBussinessCard () {
    this.setState({
      dialogVisible: false
    })
  }

  showBussinessCard (url) {
    this.setState({
      dialogVisible: url
    })
  }

  render () {
    const {business_card_a = {}, business_card_b = {}, editing} = this.props
    const {value: val_a, onChange: onChangeA} = business_card_a.input || {}
    const {touched, error} = business_card_a.meta || {}
    const {value: val_b, onChange: onChangeB} = business_card_b.input || {}
    const card_a = (
      <div className={styles.upload_box} onClick={editing && !val_a ? this.WXUploadImage.bind(this, onChangeA) : () => this.showBussinessCard(val_a)}>
        {(editing && val_a) ? <div className={styles.btn_update} onClick={this.WXUploadImage.bind(this, onChangeA)}>修改</div> : null}
        {val_a
          ? <img src={val_a} />
          : editing ? <span>+上传名片正面</span> : <span>名片正面</span>}
      </div>
    )

    const card_b = (
      <div className={styles.upload_box} onClick={editing && !val_b ? this.WXUploadImage.bind(this, onChangeB) : () => this.showBussinessCard(val_b)}>
        {(editing && val_b) ? <div className={styles.btn_update} onClick={this.WXUploadImage.bind(this, onChangeB)}>修改</div> : null}
        {val_b
          ? <img src={val_b} />
          : (editing ? <span className={styles.msg}>+上传名片背面<br /><span>(无重要信息可不上传)</span></span> : <span>名片背面</span>)}
      </div>
    )

    return (
      <div className={styles.bussiness_card_box}>
        <div className={styles.bussiness_card_wrapper}>
          {card_a}
          {card_b}
        </div>
        {touched && (error && <span className={styles.error}>{error}</span>)}
        <Dialog
          visible={this.state.dialogVisible}
          animation='zoom'
          maskAnimation='fade'
          onClose={this.hideBussinessCard}
          closable={false}
          wrapClassName='bussiness-card-dialog-wrap'
        >
          {this.state.dialogVisible && <img src={this.state.dialogVisible} onClick={this.hideBussinessCard} />}
        </Dialog>
      </div>
    )
  }
}
