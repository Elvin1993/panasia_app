import { delay, toCDN } from 'utils/helper'

export default {

  namespace: 'article',

  state: {
    bannerModel: {
      size: 5,
      current: 1,
      dataset: []
    },
    articleModel: {
      Y: 0,
      total: 0,
      size: 10,
      current: 1,
      hasNext: true,
      dataset: []
    },
    searchModel: {
      Y: 0,
      total: 0,
      size: 10,
      current: 1,
      searchText: '',
      dataset: []
    },
    articleDetailModel: {
      dataset: {}
    }
  },

  subscriptions: {},
  effects: {
    * fetchBanner ({payload = {}}, {select, put}) {
      const {params = {}} = payload
      const {size, current} = yield select(state => state.article.bannerModel)
      const result = yield API.get('/Article/getFocusArticleList', {size, current, ...params})
      yield put({type: 'payloadBanner', payload: result})
    },
    * fetchArticle ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.article.articleModel)
      const result = yield API.get('/Article/getArticleList', {size, current, ...params})
      // yield call(delay, 3000)
      yield put({type: 'payloadArticleModal', payload: result})
      cb && cb()
    },
    * searchArticle ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.article.searchModel)
      const result = yield API.get('/Article/getArticleList', {size, current, ...params})
      yield put({type: 'payloadSearchModel', payload: result})
      cb && cb()
    },
    * fetchArticleDetail ({payload = {}}, {call, put}) {
      const {params = {}, cb} = payload
      // yield call(delay, 3000)
      const result = yield call(API.get, '/Article/getArticleInfo', {...params})
      yield put({type: 'payloadArticleDetailModel', payload: result})
    }
  },

  reducers: {
    saveIndexPageY (state, {payload = {}}) {
      const {Y} = payload
      const articleModel = {...state.articleModel, Y}

      return {...state, articleModel}
    },
    saveSearchPageY (state, {payload = {}}) {
      const {Y} = payload
      const searchModel = {...state.searchModel, Y}

      return {...state, searchModel}
    },
    payloadArticleModal (state, {payload = {}}) {
      let {current, dataset, total} = payload
      dataset.map((r) => {
        r.thumb_image = toCDN(r.thumb_image)
      })
      const newData = current === 1
        ? dataset
        : state.articleModel.dataset.concat(dataset)
      const articleModel = {
        ...state.articleModel,
        dataset: newData,
        total,
        current
      }

      return {...state, articleModel}
    },
    payloadSearchModel (state, {payload = {}}) {
      const {current, dataset, total} = payload
      const newData = current === 1
        ? dataset
        : state.searchModel.dataset.concat(dataset)
      const searchModel = {
        ...state.searchModel,
        dataset: newData,
        current,
        total
      }
      if (current === 1) {
        searchModel.Y = 0
      }
      return {...state, searchModel}
    },
    payloadBanner (state, {payload = {}}) {
      const bannerModel = {...state.bannerModel, dataset: payload.dataset}
      return {...state, bannerModel}
    },
    payloadArticleDetailModel (state, {payload = {}}) {
      const articleDetailModel = {...state.articleDetailModel, dataset: payload.dataset}
      return {...state, articleDetailModel}
    },
    clearSearchList (state, action) {
      const searchModel = {
        ...state.searchModel,
        dataset: [],
        current: 1,
        searchText: ''
      }
      return {...state, searchModel}
    },
    setSearchText (state, action) {
      const searchModel = {
        ...state.searchModel,
        searchText: action.payload.searchText
      }
      return {...state, searchModel}
    }

  }

}
