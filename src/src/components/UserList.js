import React from 'react'
import autobind from 'autobind-decorator'
import DropDownRefresh from 'components/DropDownRefresh'
import UserItem from 'components/UserItem'
import styles from './UserList.less'

@autobind
export default class UserList extends React.Component {
  constructor (props) {
    super(props)
    // this.state = {
    //   searchText: '',
    //   showBtn: false
    // }
  }

  render () {
    const {dataset = [], loading, onScrollToBottom, model} = this.props

    return (
      <DropDownRefresh loading={loading} className={styles.user_list} onScrollToBottom={onScrollToBottom}>
        {
          dataset.map((item, index) => {
            return <UserItem {...this.props} data={item} key={index} />
          })
        }
        { model ? !model.loading && !!+model.total && (model.current * model.size >= model.total) && <div className='empty_box'>———— 列表到底了 ————</div> : null}
      </DropDownRefresh>
    )
  }
}
