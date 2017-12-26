import { Link } from 'dva/router'
import { Button, Icon } from 'antd-mobile'
import Nav from 'components/Nav'
import CourseItem from 'components/CourseItem'
import styles from './InvoiceList.less'

@connect(state => ({
  ...state.my.invoiceOrder,
  loading: state.loading.global
}))
@autobind
export default class extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const {dispatch} = this.props
    dispatch({
      type: 'my/fetchInvoiceOrder',
      payload: {
        params: {search: {draw_invoice: 1}}
      }
    })
  }

  handlerSelect (myId) {
    const {dispatch} = this.props
    dispatch({
      type: 'my/selectInvoiceOrder',
      payload: {
        myId: myId
      }
    })
  }

  handlerSelectAll (checkAll) {
    const {dispatch} = this.props
    dispatch({
      type: 'my/selectAllInvoiceOrder',
      payload: {
        checkAll
      }
    })
  }

  handlerNext (list, sum) {
    const {dispatch} = this.props
    let order_ids = list.map((item) => item.myId).join(',')

    dispatch(routerRedux.push(`/my/edu/invoice/detail?order_ids=${order_ids}&sum=${sum}`))
  }

  render () {
    const {dataset = []} = this.props
    const selectItem = dataset.filter((item) => item.checked) || []
    const isSelectAll = dataset.length !== 0 && selectItem.length === dataset.length
    let sum = 0
    selectItem.forEach((item) => { sum += (+item.money) })

    return (
      <div className='page'>
        <Nav left={<Link to='/my/edu'><i className='icon icon-arrows-left' /></Link>} center='开发票' />
        <div className={styles.invoice_list_page}>
          <h1 className={styles.title}>
            请选择需要开发票的商品
          </h1>
          <div className={styles.invoice_list}>
            {
              dataset.length > 0 ? dataset.map((item, key) => {
                return <CourseItem key={key} hasCheck onClick={() => this.handlerSelect(item.myId)} dataset={item} hideInfo />
              })
                : <div className={styles.empty_box}>您还没有可以开发票的订单哦~</div>
            }
          </div>
          <div className={styles.footer}>
            <div className={styles.sum} onClick={() => this.handlerSelectAll(!isSelectAll)}>
              <label className={styles.select_all}>
                <Icon type={isSelectAll ? 'check-circle' : require('assets/svg/circle.svg')} size='sm' color='#3d74c7' />全选
              </label>
              当前已选开票总额：<span className='text-blue'>{sum}</span>{sum >= 1000 && <span>（顺丰包邮）</span>}
            </div>
            <div className={styles.btn_wrapper}>
              <div className={styles.left}>满500元起开票（需付22元顺丰到付）<br />满1000元包邮</div>
              <div className={styles.right}>
                <Button type='primary' className={styles.my_btn} onClick={() => this.handlerNext(selectItem, sum)} disabled={sum < 500}>下一步</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
