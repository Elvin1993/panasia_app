/* global API */
import { delay } from 'utils/helper'
// import keymaster from 'keymaster'
export default {

  namespace: 'count',

  state: {
    record: 0,
    current: 0
  },

  subscriptions: {
    setup({dispatch, history}) {  // eslint-disable-line
    },
    keyboardWatcher ({dispatch}) {
      // keymaster('⌘+up, ctrl+up', () => { dispatch({type: 'add'}) })
    }
  },
  effects: {
    * add (action, {call, put, select}) {
      yield call(delay, 1000)
      const ret = yield API.get('/admin/checkLogin', {a: 1, b: 2})
      console.log('ret:', ret)
      yield put({type: 'add__', payload: ret})
    },
    *fetch({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save'})
    }
  },

  reducers: {
    add__ (state, action) {
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
