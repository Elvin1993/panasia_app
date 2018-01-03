import { routerRedux } from 'dva/router'

export default {

  namespace: 'my',

  state: {
    myInfoModel: {
      isCheck: false,
      dataset: {}
    },
    activityModel: {
      // size: 5,
      // current: 1,
      // total: 0,
      dataset: []
    },
    cardsModel: {
      size: 10,
      searchText: '',
      current: 1,
      total: 0,
      dataset: []
    },
    myBrowserHistory: {
      Y: 0,
      size: 1000,
      current: 1,
      total: 0,
      dataset: []
    },
    myOrderHistory: {
      size: 1000,
      current: 1,
      total: 0,
      dataset: []
    },
    invoiceOrder: {
      dataset: []
    },
    invoiceInfo: {
      invoiceObj: {},
      initialValues: {type: 'plain'}
    }
  },
  subscriptions: {},
  effects: {
    * fetchUserInfo ({payload = {}}, {put}) {
      const {charge_id, cb} = payload
      if (charge_id) {
        yield API.post('/Order/getChargeStatus', {charge_id})
      }
      const result = yield API.get('/User/getUserInfo')
      yield put({type: 'updateUserInfo__', payload: result})
      cb && cb()
    },
    * fetchUserActivitys ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      // const {size, current} = yield select(state => state.my.activityModel)
      const result = yield API.get('/User/getUserActivitys', {...params})
      yield put({type: 'fetchUserActivitys__', payload: result})
      cb && cb()
    },
    * fetchUserBussinessCards ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.my.cardsModel)
      const result = yield API.get('/UserCardcase/getCardcaseList', {size, current, ...params})
      yield put({type: 'fetchUserBussinessCards__', payload: result})
      cb && cb()
    },
    * updateUserInfo ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/User/updateUserInfo', {...params})
      yield put({type: 'updateUserInfo__', payload: result})
      cb && cb()
    },
    * checkLogin ({payload = {}}, {put, call, select}) {
      const {next_url, cb} = payload
      // const {dataset={}} = yield select((state)=>state.my.myInfoModel)
      // console.log(dataset)
      // if(dataset.id) {
      //   cb && cb()
      //   return yield put({type: 'checkLogin__'})
      // }

      // yield call(delay, 2000)
      const result = yield API.get('/Login/checkLogin', {}, {ignoreError: true})

      if (result && result.code === 0) {
        yield put({type: 'updateUserInfo__', payload: result})
        cb && cb(result)
        yield put({type: 'checkLogin__'})
      } else {
        //   const path = {
        //     pathname: '/login',
        //     search: `?next_url=${next_url}`
        //   }
        //   // const path = `/login?next_url=${next_url}`
        //   yield put(routerRedux.replace(path))
        yield call(delay, 500)
      }
      return result
    },
    * Logout ({payload = {}}, {put, select}) {
      const result = yield API.get('/Login/logout')
      yield put({type: 'updateUserInfo__', payload: {dataset: {}}})
      yield put(routerRedux.push('/'))
    },
    * Logined ({payload = {}}, {put, select}) {
      const {cb} = payload
      const {dataset} = yield select(state => state.my.myInfoModel)
      if (dataset.status === 'WEIXIN') {
        yield put(routerRedux.replace('/logon'))
      } else {
        cb && cb()
      }
    },
    async fetchBrowserHistory ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = await select(state => state.my.myBrowserHistory)
      const result = await API.get('/User/getVideoBrowserHistory', {size, current, ...params})
      await put({type: 'fetchBrowserHistory__', payload: result})
      cb && cb()
    },
    * fetchOrderHistory ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.my.myOrderHistory)
      const result = yield API.get('/User/getMyOrder', {size, current, ...params})
      yield put({type: 'fetchOrderHistory__', payload: result})
      cb && cb()
    },
    * fetchInvoiceOrder ({payload = {}}, {put, select}) {
      const {params = {}} = payload
      const result = yield API.get('/User/getMyOrder', params)
      yield put({type: 'fetchInvoiceOrder__', payload: result})
    },
    * addOrderInvoice ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/Invoice/addOrderInvoice', {...params})
      cb && cb(result)
    },
    * fetchInvoiceInfo ({payload = {}}, {put, select}) {
      const {params = {}} = payload
      const result = yield API.get('/Invoice/getInvoiceInfo', params)
      yield put({type: 'fetchInvoiceInfo__', payload: {...result}})
    },
    // * setEmail ({payload = {}}, {put, select}) {
    //   const {params = {}} = payload
    //   yield put({type: 'setEmail__', payload: { email: params.email }})
    // }
  },
  reducers: {
    saveMyStudyingPageY (state, {payload = {}}) {
      const {Y} = payload
      const myBrowserHistory = {...state.myBrowserHistory, Y}

      return {...state, myBrowserHistory}
    },
    saveMyActivityPageY (state, {payload = {}}) {
      const {Y} = payload
      const activityModel = {...state.activityModel, Y}

      return {...state, activityModel}
    },
    checkLogin__ (state) { return state },
    updateUserInfo__ (state, {payload = {}}) {
      const myInfoModel = {...state.myInfoModel, dataset: payload.dataset, isCheck: true}
      return {...state, myInfoModel}
    },
    fetchUserActivitys__ (state, {payload = {}}) {
      const {dataset} = payload
      // console.log(payload)
      // const newData = current === 1
      //   ? dataset
      //   : state.activityModel.dataset.concat(dataset)
      const activityModel = {...state.activityModel, dataset}
      return {...state, activityModel}
    },
    fetchUserBussinessCards__ (state, {payload = {}}) {
      const {dataset, total, current} = payload
      const newData = (current | 0) === 1
        ? dataset
        : state.cardsModel.dataset.concat(dataset)
      const cardsModel = {...state.cardsModel, dataset: newData, current: +current, total}
      return {...state, cardsModel}
    },
    setSearchText (state, {payload = {}}) {
      const cardsModel = {...state.cardsModel, searchText: payload.searchText}
      return {...state, cardsModel}
    },
    fetchBrowserHistory__ (state, {payload = {}}) {
      const {dataset = [], total, current} = payload
      let transformData = dataset.map((item) => { return {...item.video_info, historyTime: item.update_time} })
      const newData = (current | 0) === 1
        ? transformData
        : state.myBrowserHistory.dataset.concat(transformData)
      const myBrowserHistory = {...state.myBrowserHistory, dataset: newData, current: +current, total}
      return {...state, myBrowserHistory}
    },
    fetchOrderHistory__ (state, {payload = {}}) {
      let {dataset = [], total, current} = payload
      dataset = dataset || []
      const newData = (current | 0) === 1
        ? dataset
        : state.myBrowserHistory.dataset.concat(dataset)
      const myOrderHistory = {...state.myOrderHistory, dataset: newData, current: +current, total}
      return {...state, myOrderHistory}
    },
    fetchInvoiceOrder__ (state, {payload = {}}) {
      const {dataset = []} = payload
      let transformData = dataset.map(
        (item) => {
          return {
            ...item.goods_list[0],
            historyTime: item.update_time,
            checked: false,
            myId: item.id,
            is_free: 0,
            money: item.money,
            order_type: item.order_type
          }
        })
      const invoiceOrder = {...state.invoiceOrder, dataset: transformData}
      return {...state, invoiceOrder}
    },
    selectInvoiceOrder (state, {payload = {}}) {
      const {myId} = payload
      let {dataset} = state.invoiceOrder
      dataset = dataset.map((item) => {
        if (myId === item.myId) {
          item.checked = !item.checked
        }
        return item
      })
      const invoiceOrder = {...state.invoiceOrder, dataset}
      return {...state, invoiceOrder}
    },
    selectAllInvoiceOrder (state, {payload = {}}) {
      const {checkAll} = payload
      let {dataset} = state.invoiceOrder
      dataset = dataset.map((item) => {
        item.checked = checkAll
        return item
      })
      const invoiceOrder = {...state.invoiceOrder, dataset}
      return {...state, invoiceOrder}
    },
    fetchInvoiceInfo__ (state, {payload = {}}) {
      const {user_consignee_address = [], user_invoice = {}} = payload.dataset || {}
      const {consignee, address_city, address_info, mobile} = user_consignee_address[0] || {}
      const {plain = {}, vat = {}} = user_invoice || {}
      const invoiceObj = {
        plain: {
          ...plain,
          content: plain.content && plain.content.split(','),
          consignee,
          consignee_mobile: mobile,
          consignee_address_city: address_city && address_city.split(','),
          consignee_address_info: address_info,
          type: 'plain'
        },
        vat: {
          ...vat,
          content: vat.content && vat.content.split(','),
          consignee,
          consignee_mobile: mobile,
          consignee_address_city: address_city && address_city.split(','),
          consignee_address_info: address_info,
          type: 'vat'
        }
      }
      const invoiceInfo = {...state.invoiceInfo, invoiceObj, initialValues: invoiceObj.plain}
      return {...state, invoiceInfo}
    },
    changeInvoiceType (state, {payload = {}}) {
      const {type = 'plain'} = payload
      const {invoiceObj} = state.invoiceInfo
      const invoiceInfo = {...state.invoiceInfo, initialValues: {...invoiceObj[type], type}}
      return {...state, invoiceInfo}
    },
  }

}
