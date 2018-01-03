import pingpp from 'pingpp-js'
export default {

  namespace: 'course',

  state: {
    courseModel: {
      playingVideo: {},
      dataset: {}
    }

  },
  subscriptions: {},
  effects: {
    * fetchCourseInfo ({payload = {}}, {put}) {
      const {params = {}, cb, charge_id} = payload
      if (charge_id) {
        yield API.post('/Order/getChargeStatus', {charge_id})
      }
      const result = yield API.get('/Video/getVideoInfo', params)
      yield put({type: 'fetchCourseInfo__', payload: result})
      cb && cb(result)
    },
    * changePlayingVideo ({payload = {}}, {put}) {
      const {playingVideo = {}, cb} = payload
      yield put({type: 'changePlayingVideo__', payload: {playingVideo}})
      cb && cb()
    },
    * orderPay ({payload = {}}, {call, put, take}) {
      const {params = {}, cb} = payload
      // while (yield take('my/checkLogin__')) {
      //   break;
      // }
      const result = yield API.post('/Order/pay', {...params})
      if (result.code === 0) {
        pingpp.createPayment(result.dataset.charge, (ret, err) => {
          let message
          if (ret === 'success') {
            // API.post('/Order/getChargeStatus', {charge_id: result.charge.id})
            message = '支付成功'
          } else if (ret === 'fail') {
            message = '支付失败'
          } else if (ret === 'cancel') {
            message = '支付取消'
          }
          cb && cb(message, result.dataset.charge.id)
        })
      }
    },
    * setVideoHistory ({payload = {}}, {put}) {
      const {params = {}, cb} = payload
      yield API.post('/Video/addVideoChapterBrowserHistory', params)
      yield put({type: 'changeCurrentTime', payload: {...params}})
      cb && cb()
    }

  },
  reducers: {
    fetchCourseInfo__ (state, {payload = {}}) {
      let {dataset = {}} = payload
      dataset.chapter = dataset.chapter.map((item, index) => {
        item.index = index
        return item
      })
      const videoList = dataset.chapter || []
      let previewList = videoList.filter((item) => {
        return !!item.video_url
      })
      let playingVideo = previewList[0] || {}
      previewList.forEach((item) => {
        let {browser_history: history1 = {}} = item
        let {browser_history: history2 = {}} = playingVideo
        history1 = history1 || {}
        history2 = history2 || {}
        let time1 = history1.update_time || 0
        let time2 = history2.update_time || 0

        if (+time1 > +time2) {
          playingVideo = {...item}
        }
      })

      const courseModel = {...state.courseModel, playingVideo: playingVideo, dataset}
      return {...state, courseModel}
    },
    changePlayingVideo__ (state, {payload = {}}) {
      const {playingVideo = {}} = payload
      const courseModel = {...state.courseModel, playingVideo}
      return {...state, courseModel}
    },
    changeCurrentTime (state, {payload = {}}) {
      const {id, play_time} = payload
      const chapter = state.courseModel.dataset.chapter.map((item) => {
        if (id === item.id) {
          if (item.browser_history) {
            item.browser_history.play_time = play_time
          } else {
            item.browser_history = {play_time}
          }
        }
        return item
      })
      const dataset = {...state.courseModel.dataset, chapter}
      const courseModel = {...state.courseModel, dataset}
      return {...state, courseModel}
    },
    clearCourseModel (state, {payload = {}}) {
      return {
        ...state,
        courseModel: {
          playingVideo: {},
          dataset: {}
        }
      }
    }
  }

}
