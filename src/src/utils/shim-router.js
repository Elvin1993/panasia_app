// 处理react-router4兼容

import isPlainObject from 'lodash/isPlainObject'
import QueryString from 'qs'

export function processReactRouterProps (props) {
  const newProps = Object.assign({}, props)
  newProps.location.query = QueryString.parse(props.location.search)
  newProps.params = props.match.params || {}
  return newProps
}


export function processHistory (history) {
  const _push = history.push
  const _replace = history.replace

  history.push = function (one) {
    if (!isPlainObject(one)) {
      return _push.apply(this, arguments)
    }

    const o = Object.assign({}, one)

    if (o.query) {
      o.search = QueryString.stringify(o.query)
    }

    _push.apply(this, [o])
  }

  history.replace = function (one) {
    if (!isPlainObject(one)) {
      return _replace.apply(this, arguments)
    }

    const o = Object.assign({}, one)

    if (o.query) {
      o.search = QueryString.stringify(o.query)
    }

    _replace.apply(this, [o])
  }

  return history
}
