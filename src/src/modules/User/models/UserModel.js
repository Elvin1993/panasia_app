import { routerRedux } from 'dva/router'

export default {

  namespace: 'user',

  state: {
    signinModel: {
      current: 1,
      total: 0,
      size: 10,
      searchTest: '',
      activityUser: []
    },
    checkMobel: {
      mobile: '',
      dataset: {}
    },
    userInfoModel: {
      dataset: {}
    }
  },
  subscriptions: {},
  effects: {
    * fetchDetail ({payload = {}}, {put}) {
      const {params = {}} = payload
      const result = yield API.get('/UserCardcase/getUserCard', {...params})
      yield put({type: 'payloadDetail', payload: {...result}})
    },
    * addExchangeCard ({payload = {}}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/UserCardcase/addExchangeCard', params)
      if (result.code === 0) {
        cb && cb()
      }
    },
    * fetchActivityUser ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.user.signinModel)
      const result = yield API.get('/Activity/getBindActivityUser', {size, current, ...params})
      yield put({type: 'fetchActivityUser__', payload: {...result}})
      cb && cb()
    },
    * checkMobile ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/Activity/bindScanQrCodeActivityUser', {...params})
      if (result.code === 0) {
        yield put(routerRedux.push(`/activity/${params.aid}`))
      }
      cb && cb()
    },
    * checkNext ({payload = {}}, {put, take}) {
      const {params = {}, cb} = payload
      while (yield take('my/checkLogin__')) {
        break
      }
      const result = yield API.post('/Activity/joinScanQrCodeActivityUser', {...params})
      if (result.code === 1 || result.code === -1) {
        yield put(routerRedux.replace(`/activity/${params.aid}`))
      } else {
        cb && cb()
      }
    },
    * fetchUserInfoCode ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/UserCardcase/getContactsQrCode', params) || {}
      if (result.code) {
        alert('获取错误')
      } else {
        const url = `${API.basePath}/Mobile/UserCardcase/getContactsQrCode?uid=187623`
        cb && cb(url)
      }
    }
  },
  reducers: {
    payloadDetail (state, {payload = {}}) {
      const userInfoModel = {...state.userInfoModel, dataset: payload.dataset}
      return {...state, userInfoModel}
    },
    fetchActivityUser__ (state, {payload = {}}) {
      const {current = 1, dataset = [], total} = payload
      const activityUser = current === 1 ? dataset : state.signinModel.activityUser.concat(dataset)
      const signinModel = {...state.signinModel, activityUser, current, total}
      return {...state, signinModel}
    },
    selectUser (state, {payload = {}}) {
      const {selectUser} = payload
      const checkMobel = {...state.checkMobel, dataset: selectUser}
      return {...state, checkMobel}
    },
    changeMobile (state, {payload = {}}) {
      const {mobile = ''} = payload
      const checkMobel = {...state.checkMobel, mobile}
      return {...state, checkMobel}
    }
  }

}
