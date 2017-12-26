import autobind from 'autobind-decorator'
import fetch from 'dva/fetch'
import QueryString from 'qs'

@autobind
export default class APIClient {
  constructor (basePath = '/', options = {}) {
    this.basePath = basePath
    this.options = Object.assign({
      // method: 'GET'
      credentials: 'include'
      // credentials: 'same-origin'
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      // }
    }, options)
  }

  request (params, ignoreError = false) {
    const method = (params.method || 'GET').toUpperCase()
    const {api, data = {}, options = {}} = params
    let url = `${options.basePath || this.basePath}${api}`
    let body
    let headers = {}

    // const extra = {
    //   'X-APP': 'WECHAT',
    //   'X-APPID': '1'
    // }
    // Object.assign(data, extra)

    if (method === 'GET' || method === 'DELETE') {
      if (Object.keys(data).length) {
        url = `${url}?${QueryString.stringify(data)}`
      }
    } else {
      // POST or PUT
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      body = QueryString.stringify(data)
      // body = new FormData(params)

      options.headers = headers
      options.body = body
    }

    options.method = method
    if (!options.headers) {
      options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    }
    // options.headers['X-APP'] = 'WECHAT'
    // options.headers['X-APPID'] = '1'

    Object.assign(options, this.options)

    // console.log(options)

    return fetch(url, options)
      .then((resp) => {
        if (resp.status >= 200 && resp.status < 400) {
          return resp
        } else {
          const error = new Error(resp.statusText)
          error.response = resp
          throw error
        }
      })
      .then(resp => {
        return resp.json()
      })
      .then((json) => {
        json.code |= 0
        if (json.code < 0 && json.code !== -1001) {
          const error = new Error(json.message)
          if (!ignoreError) {
            error.code = -1000
            throw error
          }
          // throw  new Error(json.message, -1000)
        }
        // 统一处理 返回值 的 size,current, total 为number类型
        const {size, current, total} = json || {}
        if (size) {
          json.size = +size
        }

        if (current) {
          json.current = +current
        }

        if (total) {
          json.total = +total
        }

        return json
      })
      .catch((ex) => {
        console.log('[catch] parsing failed', ex)
        throw ex
        // 统一提示
        // return {code: -1000, message: '网络错误'}
      })
  }

  get (api, data = {}, options = {}) {
    return this.request({method: 'GET', api, data, options}, options.ignoreError)
  }

  post (api, data, options = {}) {
    return this.request({method: 'POST', api, data, options}, options.ignoreError)
  }
}
