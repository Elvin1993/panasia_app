import QueryString from 'qs'

export default {

  namespace: 'app',

  state: {
    myHistory: {}
  },

  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(({pathname, search, ...args}) => {
        history.location.query = search ? QueryString.parse(search.substr(1)) : {}
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
