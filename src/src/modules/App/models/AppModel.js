export default {

  namespace: 'app',

  state: {
    myHistory: {}
  },

  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(({pathname}) => {
        dispatch({type: 'changeUrl', payload: {pathname}})
      })
    }
  },

  effects: {},

  reducers: {
    save (state, action) {
      return {...state, ...action.payload}
    },
    changeUrl (state, {payload = {}}) {
      const {pathname} = payload
      const {nowUrl} = state.myHistory
      const myHistory = {nowUrl: pathname, pUrl: nowUrl}
      return {...state, myHistory}
    }
  }

}
