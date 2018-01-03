/* global API */
// import keymaster from 'keymaster'
export default {

  namespace: 'demo',

  state: {
    count: {record: 2, current: 0},
    form: {}
  },

  subscriptions: {
    setup ({dispatch, history}) {  // eslint-disable-line
    }
  },

  effects: {


    * init (state, {put, call, take, takeEvery}) {
      // while(true) {
      //   const action = yield take('*')
      //   console.log('action', action)
      // }

      // yield takeEvery('*', function* logger(action) {
      //   console.log('action', action)
      // })

      for (let i = 0; i < 3; i++) {
        const action = yield take('test')
      }
      console.log('3 times')
      yield put({type: 'test_done'})
    },

    * test () {

    },

    * submitForm (action, {call, put}) {
      const {type, payload: {values}} = action
      const ret = yield API.get('/admin/checkLogin', {a: 1, b: 2})
    },
    * fetch ({payload}, {call, put}) {
      // TODO loading
      const ret = yield API.get('/admin/checkLogin', {a: 1, b: 2})
    },

    // * add(action, {call, put}){
    //   put({'add'})
    // }

  },

  reducers: {
    add (state, action) {
      const {count} = state
      const newCurrent = count.current + 1
      return {
        ...state,
        count: {
          record: newCurrent > count.record ? newCurrent : count.record,
          current: newCurrent
        }
      }
    },
    minus (state) {
      return {...state, current: state.current - 1}
    },

    reset (state) {
      return {...state, current: 0}
    },

    save (state, action) {
      return {...state, ...action.payload}
    }
  }

}
