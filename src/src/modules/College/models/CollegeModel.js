import { toCDN } from 'utils/helper'
import pingpp from 'pingpp-js'

export default {

  namespace: 'college',

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
    coursesModel: {
      Y: 0,
      total: 0,
      size: 3,
      current: 1,
      hasNext: true,
      dataset: []
    },
    classmatesModel: {
      Y: 0,
      total: 0,
      size: 10,
      current: 1,
      hasNext: true,
      dataset: []
    },
    applyModel: {
      loading: false
    },
    applyStatus: null,
    courseModel: {
      loading: false
    },
    liveModel: {
      loading: false
    },
    classmateModel: {},
    questionsModel: [],
  },

  subscriptions: {},
  effects: {
    // 获取焦点图
    * fetchBanner ({payload = {}}, {select, put}) {
      const {params = {}} = payload
      const {size, current} = yield select(state => state.college.bannerModel)
      const result = yield API.get('/Article/getFocusArticleList', {size, current, ...params, 'search[system_group]': 'business_school'})
      yield put({type: 'payloadBanner', payload: result})
    },
    // 获取文章
    * fetchArticles ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.college.articleModel)
      const result = yield API.get('/Article/getArticleList', {size, current, ...params, 'search[system_group]': 'business_school'})
      yield put({type: 'payloadArticlesModel', payload: result})
      cb && cb()
    },
    // 获取课程
    * fetchCourses ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.college.coursesModel)
      const result = yield API.get('/BusinessSchool/getCourseList', {size, current, ...params})
      yield put({type: 'payloadCoursesModel', payload: result})
      cb && cb()
    },
    // 获取课程详情
    * fetchCourse ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      yield put({type: '_setLoading', payload: { modelName: 'courseModel', loading: true} })
      const {size, current} = yield select(state => state.college.articleModel)
      const result = yield API.get('/BusinessSchool/getCourseInfo', {...params})
      yield put({type: '_setLoading', payload: { modelName: 'courseModel', loading: false} })
      yield put({type: 'payloadCourseModel', payload: result})
      cb && cb(result.dataset)
    },
    // 申请报名
    * apply ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/BusinessSchool/addClassesUserOrder', {...params})
      if (result.code == 0) {
        cb && cb()
      }
    },
    // 获取报名信息
    * fetchApplyInfo ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/BusinessSchool/getClassesUserInfo', {...params})
      yield put({type: 'payloadApplyModel', payload: result})
      cb && cb()
    },
    // 获取报名状态
    * fetchApplyStatus ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/BusinessSchool/checkClassesUserOrder', {...params})
      yield put({type: '_fetchApplyStatus', payload: result})
      cb && cb(result.code)
    },
    // 支付
    * pay ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      try {
        yield put({type: '_setLoading', payload: { modelName: 'applyModel', loading: true} })
        const result = yield API.post('/Order/pay', {...params})
        if (result.code === 0) {
          yield put({type: '_resetData'})
          if (params.payment_method === 'online') {
            pingpp.createPayment(result.dataset.charge, (ret, err) => {
              let message
              if (ret === 'success') {
                message = '支付成功'
              } else if (ret === 'fail') {
                message = '支付失败'
              } else if (ret === 'cancel') {
                message = '支付取消'
              }
              cb && cb(message, result.dataset.charge.id, params.payment_method)
            })
          } else {
            cb && cb('success', '', params.payment_method)
          }
        }
      } catch (e) {
        throw e
      } finally {
         yield put({type: '_setLoading', payload: { modelName: 'applyModel', loading: false} })
      }
    },
    // 设置开课提醒
    * setAlert ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/BusinessSchool/addCourseNotice', {...params})
      yield put({type: 'payloadAlert', payload: result})
      cb && cb()
    },
    // 获取直播课程
    * fetchLive ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      yield put({type: '_setLoading', payload: { modelName: 'liveModel', loading: true} })
      const result = yield API.get('/BusinessSchool/getLiveVideo', {...params})
      yield put({type: '_setLoading', payload: { modelName: 'liveModel', loading: false} })
      yield put({type: 'payloadLiveModel', payload: result})
      // yield put({type: 'payloadQuestionsModel', payload: { dataset: result.dataset.question_list }})
      cb && cb(result.dataset)
    },
    // 提问
    * ask ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/BusinessSchool/addCourseQuestion', {...params})
      // yield put({type: 'payloadLiveModel', payload: result})
      cb && cb()
    },
    // 获取提问
    * fetchQuestions ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/BusinessSchool/getCourseQuestionList', {...params})
      yield put({type: 'payloadQuestionsModel', payload: { dataset: result.dataset, direction: params.direction}})
      cb && cb()
    },
    // 获取同学们
    * fetchClassmates ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const {size, current} = yield select(state => state.college.classmatesModel)
      const result = yield API.get('/BusinessSchool/getBusinessSchoolmateList', {size, current, ...params})
      console.log(result)
      yield put({type: 'payloadClassmatesModel', payload: result})
      cb && cb()
    },
    // 获取同学
    * fetchClassmate ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/BusinessSchool/getBusinessSchoolmateInfo', {...params})
      console.log(result)
      yield put({type: 'payloadClassmateModel', payload: result})
      cb && cb()
    },
    // 获取同学联系方式二维码
    * fetchClassmateQRCode ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/BusinessSchool/getBusinessSchoolmateContactsQrCode', {...params})
      console.log(result)
      cb && cb(result.url)
    },
    // 发送资料到邮箱
    * postFile2Email ({payload = {}}, {call, put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.post('/BusinessSchool/sendCourseDatumToEmail', {...params})
      const dataset = yield select(state => state.my.myInfoModel.dataset)
      const datasetCopy = {...dataset, email: params.email}
      yield put({type: 'my/updateUserInfo__', payload: { dataset: datasetCopy}})
      cb && cb(result)
    },
    // 获取已有开票信息
    * fetchInvoiceInfo ({payload = {}}, {put, select}) {
      const {params = {}, cb} = payload
      const result = yield API.get('/Invoice/getInvoiceInfo', params)
      // yield put({type: '_fetchInvoiceInfo', payload: {...result}})
      cb && cb(result.dataset)
    },
    * saveIndexPageY ({payload = {}}, {call, put, select}) {
      const { modelName, scrollY } = payload
      yield put({type: '_saveIndexPageY', payload: { modelName, Y: scrollY }})
    },
  },

  reducers: {
    _setLoading(state, {payload = {}}) {
      const { loading, modelName } = payload
      const model = {}
      model[modelName] = Object.assign({}, state[modelName], {loading})
      console.log({...state, ...model})
      return {...state, ...model}
    },

    _saveIndexPageY (state, {payload = {}}) {
      const { Y, modelName } = payload
      const model = {}
      model[modelName] = Object.assign({}, state[modelName], {Y})
      return {...state, ...model}
    },

    payloadArticlesModel (state, {payload = {}}) {
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

    payloadCoursesModel (state, {payload = {}}) {
      let {current, dataset, total} = payload
      dataset.map((r) => {
        r.thumb_image = toCDN(r.thumb_image)
      })
      const newData = current === 1
        ? dataset
        : state.coursesModel.dataset.concat(dataset)
      const coursesModel = {
        ...state.coursesModel,
        dataset: newData,
        total,
        current
      }

      return {...state, coursesModel}
    },
    payloadCourseModel(state, {payload = {}}) {
      const courseModel = { ...state.courseModel, ...payload.dataset }
      return {...state, courseModel}
    },
    payloadApplyModel (state, {payload = {}}) {
      const applyModel = { ...state.applyModel, ...payload.dataset }
      return {...state, applyModel}
    },
    payloadBanner (state, {payload = {}}) {
      const bannerModel = {...state.bannerModel, dataset: payload.dataset}
      return {...state, bannerModel}
    },
    payloadLiveModel(state, {payload = {}}) {
      const liveModel = {...state.liveModel, dataset: payload.dataset}
      return {...state, liveModel}
    },
    payloadClassmatesModel(state, {payload = {}}) {
      let {current, dataset, total} = payload
      dataset.map((r) => {
        r.thumb_image = toCDN(r.thumb_image)
      })
      const newData = current === 1
        ? dataset
        : state.classmatesModel.dataset.concat(dataset)
      const classmatesModel = {
        ...state.classmatesModel,
        dataset: newData,
        total,
        current
      }
      return {...state, classmatesModel}
    },
    payloadClassmateModel(state, {payload = {}}) {
      const classmateModel = { ...state.classmateModel, ...payload.dataset }
      return {...state, classmateModel}
    },
    payloadQuestionsModel(state, {payload = {}}) {
      console.log(payload)
      let questionsModel
      if (payload.direction && payload.direction === 'up') {
        questionsModel = payload.dataset.concat(state.questionsModel)
      } else {
        questionsModel = state.questionsModel.concat(payload.dataset)
      }
      console.log(questionsModel)
      return {...state, questionsModel}
    },
    payloadAlert(state, {payload = {}}) {
      const courseModel = { ...state.courseModel, is_notice: 1 }
      return {...state, courseModel}
    },
    _fetchInvoiceInfo(state, {payload = {}}) {
      const invoiceInfo = { ...state.invoiceInfo, ...payload.dataset }
      return {...state, invoiceInfo}
    },
    _fetchApplyStatus(state, {payload = {}}) {
      /*
       * code
       *  0      可以报名
       *  1      审核未通过
       *  2      申请处理中
       *  3      待缴费
       *  4      待注册入学
       *  5      申请已作废
       *  6      已是正式学员
       */
      const applyStatus = payload.code
      // const applyStatus = 0
      return {...state, applyStatus}
    },
    _resetData(state, {payload = {}}) {
      const classmatesModel = {
        Y: 0,
        total: 0,
        size: 10,
        current: 1,
        hasNext: true,
        dataset: []
      }
      return {...state, classmatesModel}
    }
  }

}
