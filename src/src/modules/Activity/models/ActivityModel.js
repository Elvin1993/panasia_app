import { routerRedux } from 'dva/router'
import { delay } from 'utils/helper'

export default {

  namespace: 'activity',

  state: {
    activityListModel: {
      Y: 0,
      total: 0,
      size: 10,
      current: 1,
      dataset: []
    },
    searchModel: {
      total: 0,
      size: 10,
      current: 1,
      searchText: '',
      dataset: []
    },
    activityDetailModel: {
      activityIndex: null
    },
    activityBaseInfo: {
      dataset: {}
    },
    applyModel: {
      applyed: false,
      dataset: {}
    },
    activityDataModel: {
      sendOk: false,
      userEmail: '',
      dataset: []
    },
    guestList: {
      current: 1,
      total: 0,
      size: 10,
      dataset: []
    },
    guestDetailModel: {
      dataset: {}
    },
    agendaModal: {
      dataset: {}
    }

  },

  subscriptions: {},
  effects: {
    * fetchActivity ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const size = yield select(state => state.activity.activityListModel.size)
      const result = yield API.get('/Activity/index', {size, ...params})
      yield put({type: 'payloadActivityModal', payload: result})
      cb && cb()
    },
    * searchActivity ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const size = yield select(state => state.activity.searchModel.size)
      const result = yield API.get('/Activity/index', {size, ...params})
      yield put({type: 'payloadSearchModel', payload: result})
      cb && cb()
      return result
    },
    * fetchActivityBaseInfo ({payload = {}}, {put, call}) {
      const {params = {}, cb} = payload
      // yield call(delay, 3000)
      const result = yield API.get('/Activity/getActivity', params)
      yield put({type: 'payloadActivityBaseInfo', payload: result})
      cb && cb(result)
      return result
    },
    * fetchActivityData ({payload = {}}, {put, select}) {
      const {params = {}} = payload
      const userEmail = yield select(state => state.my.myInfoModel.dataset.email) || ''
      const result = yield API.get('/Activity/getActivityInformation', params)
      yield put({type: 'payloadActivityData', payload: {...result, userEmail}})
    },
    * postFile2Email ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/Activity/sendActivityInformationToEmail', params)
      const dataset = yield select(state => state.my.myInfoModel.dataset)
      yield put({type: 'my/updateUserInfo__', payload: {...dataset, email: params.email}})
      cb && cb(result)
      // if(result.code === 0 ) {
      //   yield put({type: 'postFile2Email__', payload: result})
      // }else {
      //   Modal.alert({title: '提示', message: result.error})
      // }
    },
    * fetchActivityGuest ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const size = yield select(state => state.activity.guestList.size)
      const result = yield API.get('/Activity/getActivityUser', {size, ...params})
      yield put({type: 'payloadActivityGuest', payload: result})
      cb && cb()
    },
    * fetchGuestDetail ({payload = {}}, {put}) {
      const {params = {}} = payload
      const result = yield API.get('/Activity/getActivityUserDetail', params)
      yield put({type: 'payloadGuestDetail', payload: result})
    },
    * fetchUserInfo ({payload = {}}, {put, select}) {
      const result = yield API.get('/User/getUserInfo')
      yield put({type: 'fetchUserInfo__', payload: result})
    },
    * userApply ({payload = {}}, {put, select}) {
      const {params = {}, params: {aid}, cb} = payload
      yield API.post('/Activity/apply', params)
      // const result = yield API.post('/Activity/apply', params)
      // yield put({type: 'userApplyed', payload: {...result}})
      cb && cb()
      // const path = {
      //   pathname: `/activity/${aid}`
      // }
      // yield put(routerRedux.push(path))
    },
    * checkApplyed ({payload = {}}, {put, select}) {
      const {cb, params, params: {aid}} = payload
      const result = yield API.get('/User/applyStatus', params)
      if (result.code === 0) {
        cb && cb()
      } else {
        const path = {
          pathname: `/activity/${aid}`
        }
        yield put(routerRedux.replace(path))
      }
    },
    * fetchAgenda ({payload = {}}, {put}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/activity/getAgenda', params)
      yield put({type: 'fetchAgenda__', payload: result})
      cb && cb(result)
      return result
    },
    * updateAgendaUser ({payload = {}}, {put}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/Activity/updateAgendaUser', params)
      if (result) {
        alert('我们已收到您的确认信息, 请务必准时参加会议。谢谢！')
        yield put({type: 'updateAgendaUser__', payload: {dataset: {is_confirm: 'Y'}}})
      }
    }
  },

  reducers: {
    saveIndexPageY (state, {payload = {}}) {
      const {Y} = payload
      const activityListModel = {...state.activityListModel, Y}

      return {...state, activityListModel}
    },
    saveSearchPageY (state, {payload = {}}) {
      const {Y} = payload
      const searchModel = {...state.searchModel, Y}

      return {...state, searchModel}
    },
    payloadActivityModal (state, {payload = {}}) {
      const {current, total} = payload
      const dataset = current === '1'
        ? payload.dataset
        : state.activityListModel.dataset.concat(payload.dataset)
      const activityListModel = {
        ...state.activityListModel,
        current: +current,
        dataset,
        total
      }

      return {...state, activityListModel}
    },
    payloadSearchModel (state, {payload = {}}) {
      const {current, total} = payload
      const dataset = current === 1
        ? payload.dataset
        : state.searchModel.dataset.concat(payload.dataset)
      const searchModel = {
        ...state.searchModel,
        current: +current,
        dataset,
        total
      }

      if (current === 1) {
        searchModel.Y = 0
      }

      return {...state, searchModel}
    },
    payloadActivityBaseInfo (state, {payload = {}}) {
      const activityBaseInfo = {...state.activityBaseInfo, dataset: payload.dataset}
      return {...state, activityBaseInfo}
    },
    payloadActivityData (state, {payload = {}}) {
      const {code, dataset = [], userEmail} = payload
      const newDataset = (code === 0 && dataset.length > 0) ? dataset.map((item) => {
        item.checked = false
        return item
      }) : []
      const activityDataModel = {...state.activityDataModel, dataset: newDataset, userEmail}
      return {...state, activityDataModel}
    },
    clearSearchList (state) {
      const searchModel = {
        ...state.searchModel,
        dataset: [],
        current: 1,
        searchText: ''
      }
      return {...state, searchModel}
    },
    setSearchText (state, {payload = {}}) {
      const searchModel = {...state.searchModel, searchText: payload.searchText}
      return {...state, searchModel}
    },
    setLayoutActivityIndex (state, {payload = {}}) {
      const activityDetailModel = {...state.activityDetailModel, activityIndex: payload.activityIndex}
      return {...state, activityDetailModel}
    },
    selectFile (state, {payload = {}}) {
      let {dataset} = state.activityDataModel
      dataset = dataset.map((item) => {
        if (payload.id === item.id) {
          item.checked = !item.checked
        }
        return item
      })
      const activityDataModel = {...state.activityDataModel, dataset}
      return {...state, activityDataModel}
    },
    setUserEmail (state, {payload = {}}) {
      const activityDataModel = {...state.activityDataModel, userEmail: payload.userEmail}
      return {...state, activityDataModel}
    },
    postFile2Email__ (state) {
      const activityDataModel = {...state.activityDataModel, sendOk: true}
      return {...state, activityDataModel}
    },
    clearFileOperation (state) {
      let {dataset} = state.activityDataModel
      dataset = dataset.map((item) => {
        item.checked = false
        return item
      })
      const activityDataModel = {...state.activityDataModel, dataset, sendOk: false}
      return {...state, activityDataModel}
    },
    payloadActivityGuest (state, {payload = {}}) {
      const {current, total} = payload
      const dataset = current === 1
        ? payload.dataset
        : state.guestList.dataset.concat(payload.dataset)
      const guestList = {
        ...state.guestList,
        current: +current,
        dataset,
        total
      }
      return {...state, guestList}
    },
    payloadGuestDetail (state, {payload = {}}) {
      const guestDetailModel = {...state.guestDetailModel, dataset: payload.dataset}
      return {...state, guestDetailModel}
    },
    fetchUserInfo__ (state, {payload = {}}) {
      const applyModel = {...state.applyModel, dataset: payload.dataset}
      return {...state, applyModel}
    },
    checkApplyed__ (state) {
      const applyModel = {...state.applyModel, applyed: true}
      return {...state, applyModel}
    },
    fetchAgenda__ (state, {payload = {}}) {
      const agendaModal = {...state.agendaModal, dataset: payload.dataset}
      return {...state, agendaModal}
    },
    updateAgendaUser__ (state, {payload = {}}) {
      const dataset = {...state.agendaModal.dataset, ...payload.dataset}
      const agendaModal = {...state.agendaModal, dataset: dataset}

      return {...state, agendaModal}
    },
    clearActivityDetail (state) {
      const activityBaseInfo = {...state.activityBaseInfo, dataset: {}}
      const activityDataModel = {...state.activityDataModel, current: 1, total: 0, dataset: []}
      const guestList = {...state.guestList, current: 1, total: 0, dataset: []}
      return {...state, activityBaseInfo, activityDataModel, guestList}
    }
  }

}
