import { routerRedux } from 'dva/router'
import { Toast } from 'antd-mobile'

function MyError (message) {
  this.code = -1000
  this.message = message || 'Default Message'
}
MyError.prototype = Object.create(Error.prototype)
MyError.prototype.constructor = MyError

export default {
  namespace: 'migrate',
  state: {
    vaild: false,
    loading: false
    // timer: localStorage.getItem('timer')
  },
  effects: {
    * check ({payload = {}}, {put, call, select}) {
      const {params = {}, cb} = payload
      yield put({type: 'setLoading', payload: {loading: true}})
      const result = yield API.post('/User/authMigrateUser', {...params}, {ignoreError: true})
      yield put({type: 'setLoading', payload: {loading: false}})
      if (result && result.code === 0) {
        const path = {
          pathname: '/migrate/success'
        }
        yield put(routerRedux.push(path))
      } else {
        // throw new MyError(result.message)
        Toast.fail(result.message || '操作失败~')
      }
    },

    * fetchCode ({payload = {}}, {put, call, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/User/getSmsCode', {...params}, {ignoreError: true})
      if (result.code === 0) {
        cb && cb()
      } else {
        Toast.fail(result.message || '操作失败~')
      }
    },

    * vaild ({payload = {}}, {put, call, select}) {
      const {params = {}, cb} = payload
      yield put({type: 'setLoading', payload: {loading: true}})
      const result = yield API.post('/User/verifySmsCode', {...params}, {ignoreError: true})
      yield put({type: 'setLoading', payload: {loading: false}})
      if (result && result.code === 0) {
        cb && cb()
      } else {
        Toast.fail(result.message || '操作失败~')
      }
    }

    // * setTimer({ payload = {} }, { put, call, select }) {
    //   const { timeStamp } = payload
    //   yield call(() => {
    //     localStorage.setItem('timer', timeStamp)
    //   })
    //   yield put({ type: 'setTimer', payload: { timeStamp } })
    // }
  },

  reducers: {
    setLoading (state, {payload = {}}) {
      const {loading} = payload
      return {...state, loading}
    }
    // setTimer(state, { payload = {} }) {
    //   const { timeStamp } = payload
    //   return { ...state, { timer: timeStamp } }
    // }
  }
}
