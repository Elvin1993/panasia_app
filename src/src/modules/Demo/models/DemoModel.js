/* global API */
// import keymaster from 'keymaster'
export default {

  namespace: 'demo',

  state: {
    form: {}
  },

  subscriptions: {
    setup({dispatch, history}) {  // eslint-disable-line
    }
  },
  effects: {
    * submitForm (action, {call, put}) {
      const {type, payload: {values}} = action
      const ret = yield API.get('/admin/checkLogin', {a: 1, b: 2})
    },
    * fetch ({payload}, {call, put}) {
      // TODO loading
      const ret = yield API.get('/admin/checkLogin', {a: 1, b: 2})
    }
  },

  reducers: {
    add (state, action) {
      const newCurrent = state.current + 1
      return {
        ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent
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
