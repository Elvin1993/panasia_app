import pingpp from 'pingpp-js'
import { routerRedux } from 'dva/router'
import { delay } from 'utils/helper'

export default {

  namespace: 'shop',

  state: {
    ShopModel: {
      showForm: false,
      dataset: {},
      orderInfo: {
        book_count: null,
        consigneeInfo: {}
      }
    },
    orderResult: {}
  },

  subscriptions: {},
  effects: {
    * fetchShopInfo ({payload = {}}, {put}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/BookGoods/getBookGoods', params)
      yield put({type: 'fetchShopInfo__', payload: result})
      cb && cb(result)
      return result
    },
    * makeOrder ({payload = {}}, {put}) {
      const {params = {}, url} = payload
      // TODO 接口临时使用 后期需要调用两个接口 1.eupdateUserInfo 2.下单流程
      const result = yield API.post('/shop/register', params)
      if (result.code === 0) {
        location.href = url
      }
    },
    * fetchInvoiceInfo ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/Invoice/getInvoiceInfo', params)
      const {dataset: u} = yield select(state => state.my.myInfoModel)
      const {user_consignee_address = [], user_invoice = {}} = result.dataset || {}
      const {plain} = user_invoice
      let h_info = user_consignee_address[0]
      let consigneeInfo = {is_need_invoice: 0, consignee: u.name, consignee_mobile: u.mobile, header: u.company}

      if (plain) {
        consigneeInfo.header = plain.header
        consigneeInfo.taxpayer_id = plain.taxpayer_id
      }

      if (h_info) {
        Object.assign(consigneeInfo, {
          consignee: h_info.consignee,
          consignee_mobile: h_info.mobile,
          consignee_address: h_info.address,
          consignee_address_city: h_info.address_city.split(','),
          consignee_address_info: h_info.address_info
        })
      }

      yield put({type: 'fetchInvoiceInfo__', payload: {consigneeInfo}})
      cb && cb(consigneeInfo)
    },
    * orderPay ({payload = {}}, {call, put, take}) {
      const {params = {}, consigneeInfo = {}, cb} = payload
      const result = yield API.post('/Order/pay', {...params})
      yield put({type: 'fetchInvoiceInfo__', payload: {...result.dataset, consigneeInfo}})

      if (result.code === 0) {
        pingpp.createPayment(result.dataset.charge, (ret, err) => {
          let message
          if (ret === 'success') {
            // API.post('/Order/getChargeStatus', {charge_id: result.charge.id})
            message = '支付成功'
          } else if (ret === 'fail') {
            message = '支付失败'
          } else if (ret === 'cancel') {
            message = '支付取消'
          }
          cb && cb(message, result.dataset.charge.id, result.id)
        })
      }
    },
    * getChargeStatus ({payload = {}}, {call, put, take}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/Order/getChargeStatus', {charge_id: params.charge_id})
    },
    * fetchOrderResult ({payload = {}}, {call, put, take}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/Order/getOrderInfo', params)
      yield put({type: 'fetchOrderResult__', payload: {...result}})
    }
  },

  reducers: {
    fetchShopInfo__ (state, {payload = {}}) {
      const ShopModel = {...state.ShopModel, dataset: payload.dataset, orderInfo: {book_count: 1}}
      return {...state, ShopModel}
    },
    changeOrderCount (state, {payload = {}}) {
      const orderInfo = {...state.ShopModel.orderInfo, book_count: payload.book_count || 1}
      const ShopModel = {...state.ShopModel, orderInfo}
      return {...state, ShopModel}
    },
    fetchInvoiceInfo__ (state, {payload = {}}) {
      const {consigneeInfo} = payload || {}
      const orderInfo = {...state.ShopModel.orderInfo, consigneeInfo}
      const ShopModel = {...state.ShopModel, orderInfo}
      return {...state, ShopModel}
    },
    clearData (state, {payload = {}}) {
      const ShopModel = {
        showForm: false,
        dataset: {},
        orderInfo: {
          book_count: null,
          consigneeInfo: {}
        }
      }
      return {...state, ShopModel}
    },
    fetchOrderResult__ (state, {payload = {}}) {
      const {dataset} = payload || {}
      return {...state, orderResult: {dataset}}
    }
  }

}
