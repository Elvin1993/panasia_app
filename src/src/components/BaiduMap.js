import React, { Component } from 'react'
import PropTypes from 'prop-types'
import scriptLoader from 'react-async-script-loader'
/* global BMap */
/**
 * @class BaiduMap
 */
const API_KEY = 'F0a59f30a904895c4d676539be94b31b'
@scriptLoader([
  `http://api.map.baidu.com/getscript?v=2.0&ak=${API_KEY}&services=&t=20160513110936`
])
export default class BaiduMap extends Component {
  static propTypes = {
    id: PropTypes.string,
    address: PropTypes.string.isRequired,
    onSelect: PropTypes.func
  }

  /**
   * @constructor
   * @id {String} the id to create DOM id
   */
  constructor (props) {
    super(props)
    this.id = props.id || 'allmap'
  }

  /**
   * @method componentDidMount
   */
  componentDidMount () {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps ({isScriptLoaded, isScriptLoadSucceed}) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.initMap()
      } else {
        this.props.onError && this.props.onError()
      }
    }
  }

  initMap () {
    let {address, detail, lng, lat} = this.props
    let map = this._map = new BMap.Map(this.id)
    let opts = {
      width: 300,     // 信息窗口宽度
      height: 120      // 信息窗口高度
      // title: address  // 信息窗口标题
    }

    let content = `<p style='margin-top:10px;font-size:28px;line-height: 1.5;'>${address}</p>`
    let infoWindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
    let geo = new BMap.Geocoder()
    geo.getPoint(address, function (point) {
      if (!point) {
        console.log('您选择地址没有解析到结果!')
        return false
      }
      let marker = new BMap.Marker(point)
      map.centerAndZoom(point, 17)
      map.addOverlay(marker)
      map.openInfoWindow(infoWindow, point)
      marker.addEventListener('click', function () {
        map.openInfoWindow(infoWindow, point) // 开启信息窗口
      })
    })
  }

  initMap_ () {
    this._map = new BMap.Map(this.id)
    this._map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
    this._local = new BMap.LocalSearch(this._map, {
      renderOptions: {map: this._map},
      onInfoHtmlSet: poi => {
        if (typeof this.props.onSelect === 'function') {
          this.props.onSelect(poi.marker.getPosition())
        }
      }
    })
    this.props.address && this._local.search(this.props.address)
  }

  /**
   * @method render
   */
  render () {
    return <div id={this.id} {...this.props} />
  }

  /**
   * @method search
   * @param {String} text - the search keyword
   */
  search (text) {
    this._local.search(text)
  }
}
