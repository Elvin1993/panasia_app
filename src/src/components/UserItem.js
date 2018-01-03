import React from 'react'
import autobind from 'autobind-decorator'
import Dialog from 'rc-dialog'
import { Icon } from 'antd-mobile'
import 'rc-dialog/assets/index.css'
import DeptBreadcrumb from 'components/DeptBreadcrumb'
import styles from './UserItem.less'

@autobind
export default class UserItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dialogVisible: false,
      showBtn: false
    }
  }

  hideBussinessCard () {
    this.setState({
      dialogVisible: false
    })
  }

  showBussinessCard (e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      dialogVisible: true
    })
  }

  isEmpty (value) {
    return !(value && value.trim() !== '')
  }

  render () {
    const {data, data: {id, name, user_face, position, bussiness_card, company, department, job}, onLink, showCheckBox, selectUser = {}, onSelect} = this.props
    const {organization_name} = position || {}
    const noUserJobInfo = this.isEmpty(company) && this.isEmpty(department) && this.isEmpty(job)
    const jobDisplay = job === 'XXX' ? '' : job
    return (
      <div className={styles.user_item} onClick={() => { showCheckBox ? onSelect(data) : onLink(id) }}>
        {
          showCheckBox &&
          <Icon style={{marginRight: '15px', color: '#3d74c7'}} type={id === selectUser.id ? 'check-circle-o' : require('assets/svg/circle.svg')} />
        }
        <div className={styles.user_face}>
          <img src={user_face || 'img/user_face_default.png'} alt='头像' onClick={() => {}} />
        </div>
        <div className={styles.user_info}>
          <div className={styles.top}>
            <span className={styles.name}>{name}</span>
            {
              bussiness_card &&
              <div className={styles.bussiness_card} onClick={this.showBussinessCard}>
                <img src={bussiness_card} alt='名片' />
              </div>
            }
          </div>
          {
            !position ? (!noUserJobInfo && <span>{`${company}/ ${department}${jobDisplay !== '' ? '/' : ''} ${jobDisplay}`}</span>)
              : <div className={styles.job_level}><span>{organization_name} / </span><DeptBreadcrumb link={false} position={position} job crumb={false} size='small' /></div>
          }
        </div>
        <Dialog
          visible={this.state.dialogVisible}
          animation='zoom'
          maskAnimation='fade'
          onClose={this.hideBussinessCard}
          closable={false}
          wrapClassName='bussiness-card-dialog-wrap'
        >
          <img src={bussiness_card} alt='名片' />
        </Dialog>
      </div>
    )
  }
}
