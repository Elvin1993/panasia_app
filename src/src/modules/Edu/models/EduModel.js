export default {

  namespace: 'edu',

  state: {
    bannerModel: {
      size: 1000,
      current: 1,
      dataset: []
    },
    banner2: {},
    types: {
      operationList: [],
      industryList: []
    },
    recommend: {
      hot: {},
      other: []
    },
    searchModel: {
      Y: 0,
      total: 0,
      size: 1000,
      current: 1,
      searchText: '',
      dataset: []
    },
    categoryListModel: {
      Y: 0,
      current: 1,
      total: 0,
      size: 10,
      type: 'video',
      info: {},
      dataset: []
    },
    seriesListModel: {
      Y: 0,
      current: 1,
      total: 0,
      size: 10,
      type: 'video',
      info: {},
      dataset: []
    },
    specialListModel: {
      Y: 0,
      current: 1,
      total: 0,
      size: 10,
      type: 'video',
      info: {},
      dataset: []
    },
    categoryDetail: {
      dataset: []
    }
  },

  subscriptions: {},
  effects: {
    * fetchBanner ({payload = {}}, {select, put}) {
      const {params = {}, banner2} = payload
      const {size, current} = yield select(state => state.article.bannerModel)
      const result = yield API.get('/Article/getFocusArticleList', {size, current, ...params})
      if (banner2) {
        yield put({type: 'payloadBanner2', payload: result})
      } else {
        yield put({type: 'payloadBanner', payload: result})
      }
    },
    * fetchTypes ({payload = {}}, {put}) {
      const {params = {}} = payload
      const result = yield API.get('/VideoCategory/getHomeTabCategory', {...params})

      yield put({type: 'payloadTypes', payload: result})
    },
    * fetchRecommend ({payload = {}}, {put}) {
      const {params = {}} = payload
      const result = yield API.get('/VideoCategory/getRecommendCategory', params)
      yield put({type: 'payloadRecommend', payload: result})
    },
    * searchCourse ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.article.searchModel)
      const result = yield API.get('/Video/index', {size, current, ...params})
      yield put({type: 'payloadSearchModel', payload: result})
      cb && cb()
    },
    * fetchCategoryList ({payload = {}}, {call, put}) {
      const {params = {}, cb} = payload
      // id=all 就是查询全部视频
      let url = params.id !== 'all' ? '/VideoCategory/getCategoryInfo' : '/Video/index'
      const result = yield API.get(url, {...params})

      yield put({type: 'payloadCategoryListModel', payload: {...result, categoryId: params.id}})
      cb && cb()
    },
    * fetchSeriesList ({payload = {}}, {call, put}) {
      const {params = {}, cb} = payload
      // id=all 就是查询全部视频
      let url = params.id !== 'all' ? '/VideoCategory/getCategoryInfo' : '/Video/index'
      const result = yield API.get(url, {...params})

      yield put({type: 'payloadSeriesListModel', payload: {...result, categoryId: params.id}})
      cb && cb()
    },
    * fetchSpecialList ({payload = {}}, {call, put}) {
      const {params = {}, cb} = payload
      // id=all 就是查询全部视频
      let url = params.id !== 'all' ? '/VideoCategory/getCategoryInfo' : '/Video/index'
      const result = yield API.get(url, {...params})

      yield put({type: 'payloadSpecialModel', payload: {...result, categoryId: params.id}})
      cb && cb()
    }
  },

  reducers: {
    saveSearchPageY (state, {payload = {}}) {
      const {Y} = payload
      const searchModel = {...state.searchModel, Y}

      return {...state, searchModel}
    },
    saveCourseCategoryPageY (state, {payload = {}}) {
      const {Y} = payload
      const categoryListModel = {...state.categoryListModel, Y}

      return {...state, categoryListModel}
    },
    saveSeriesPageY (state, {payload = {}}) {
      const {Y} = payload
      const seriesListModel = {...state.seriesListModel, Y}

      return {...state, seriesListModel}
    },
    saveSpecialPageY (state, {payload = {}}) {
      const {Y} = payload
      const specialListModel = {...state.specialListModel, Y}

      return {...state, specialListModel}
    },
    payloadArticleModal (state, {payload = {}}) {
      const {current, dataset, total} = payload
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
    payloadTypes (state, {payload = {}}) {
      const {business = [], industry = []} = payload.dataset
      const types = {...state.types, operationList: business, industryList: industry}
      return {...state, types}
    },
    payloadBanner (state, {payload = {}}) {
      const bannerModel = {...state.bannerModel, dataset: payload.dataset}
      return {...state, bannerModel}
    },
    payloadBanner2 (state, {payload = {}}) {
      const {dataset = []} = payload
      return {...state, banner2: {...dataset[0]}}
    },
    payloadRecommend (state, {payload = {}}) {
      return {...state, recommend: {...payload.dataset}}
    },
    payloadCategoryListModel (state, {payload = {}}) {
      const {current, dataset, total, type = 'video', info, categoryId} = payload
      const newData = current === 1
        ? dataset
        : state.categoryListModel.dataset.concat(dataset)

      let categoryListModel = {
        ...state.categoryListModel,
        dataset: newData,
        info,
        current,
        total,
        categoryId,
        type
      }

      if (current === 1) {
        categoryListModel.type = type
        categoryListModel.Y = 0
      }
      return {...state, categoryListModel}
    },
    payloadSeriesListModel (state, {payload = {}}) {
      const {current, dataset, total, type = 'video', info, categoryId} = payload
      const newData = current === 1
        ? dataset
        : state.seriesListModel.dataset.concat(dataset)

      let seriesListModel = {
        ...state.seriesListModel,
        dataset: newData,
        info,
        current,
        total,
        categoryId,
        type
      }

      if (current === 1) {
        seriesListModel.type = type
        seriesListModel.Y = 0
      }
      return {...state, seriesListModel}
    },
    payloadSpecialModel (state, {payload = {}}) {
      const {current, dataset, total, type = 'video', info, categoryId} = payload
      const newData = current === 1
        ? dataset
        : state.specialListModel.dataset.concat(dataset)

      let specialListModel = {
        ...state.specialListModel,
        dataset: newData,
        info,
        current,
        total,
        categoryId,
        type
      }

      if (current === 1) {
        specialListModel.type = type
        specialListModel.Y = 0
      }
      return {...state, specialListModel}
    },
    clearSearchList (state, action) {
      const searchModel = {
        ...state.searchModel,
        dataset: [],
        current: 1,
        searchText: '',
        Y: 0
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
