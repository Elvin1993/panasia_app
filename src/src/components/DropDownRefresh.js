import React from 'react'
import ReactDOM from 'react-dom'
import autobind from 'autobind-decorator'
import cx from 'classname'
import styles from './DropDownRefresh.less'

@autobind
export default class ReactReFresh extends React.Component {
  static defaultProps = {
    useDefaultIndicator: true
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.dom.scrollTop = this.props.Y || 0
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.Y !== undefined && this.dom.scrollTop !== nextProps.Y) {
      this.dom.scrollTop = nextProps.Y
    }
  }

  findNodeIndex (dom) {
    let targetNodeIndex = 0
    const nodes = document.getElementsByClassName(dom.className)
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === dom) {
        targetNodeIndex = i
        break
      }
    }
    return targetNodeIndex
  }

  viewDidScroll (event) {
    event.preventDefault()
    event.stopPropagation()
    const dom = this.dom
    const {id: tableViewIdName, className: tableViewClassName, scrollTop: scrollviewOffsetY, clientHeight: scrollviewFrameHeight, scrollHeight: scrollviewContentHeight} = dom
    const targetNodeIndex = this.findNodeIndex(dom)
    const isFindNodeById = !!tableViewIdName
    const indicatorClassName = styles.infinit_table_spinner
    const {loading} = this.props
    const sum = scrollviewOffsetY + scrollviewFrameHeight

    this.props.onScroll && this.props.onScroll(scrollviewOffsetY)

    //  滚动到顶部
    if (sum <= scrollviewFrameHeight) {
      // 未设置onScrollToTop 方法就跳出 disable scroll to top if onScrollToTop isn't set
      if (!this.props.onScrollToTop) { return }
      // 如果正在刷新则跳出
      if (loading) { return }
      // 默认加载样式 use default refresh indicator
      if (this.props.useDefaultIndicator) {
        // spinner for refreshing
        const refreshIndicator = document.createElement('div')
        refreshIndicator.className = indicatorClassName
        const tableView = isFindNodeById ? document.getElementById(tableViewIdName) : document.getElementsByClassName(tableViewClassName)[targetNodeIndex]
        tableView.insertBefore(refreshIndicator, tableView.firstChild)
      }

      // 执行自定义onScrollToTop事件
      this.props.onScrollToTop(() => {
        if (this.props.useDefaultIndicator) {
          const tableView = isFindNodeById ? document.getElementById(tableViewIdName) : document.getElementsByClassName(tableViewClassName)[targetNodeIndex]
          const firstChild = tableView.firstChild
          if (firstChild.className.indexOf(indicatorClassName) > -1) {
            tableView.removeChild(firstChild)
          }
        }
      })
    } else if (sum >= scrollviewContentHeight) {
      // onScrollToBottom 方法就跳出 disable scroll to top if onScrollToTop isn't set
      if (!this.props.onScrollToBottom) { return }

      // 如果正在刷新则跳出
      if (loading) { return }
      // 默认加载样式 use default load more indicator
      if (this.props.useDefaultIndicator) {
        // spinner for loading more
        const loadMoreIndicator = document.createElement('div')
        loadMoreIndicator.className = indicatorClassName

        const tableView = isFindNodeById ? document.getElementById(tableViewIdName) : document.getElementsByClassName(tableViewClassName)[targetNodeIndex]
        tableView.insertBefore(loadMoreIndicator, tableView.lastChild.nextSibling)
      }

      // event
      this.props.onScrollToBottom(() => {
        if (this.props.useDefaultIndicator) {
          const tableView = isFindNodeById ? document.getElementById(tableViewIdName) : document.getElementsByClassName(tableViewClassName)[targetNodeIndex]
          const lastChild = tableView.lastChild
          if (lastChild.className.indexOf(indicatorClassName) > -1) {
            tableView.removeChild(lastChild)
          }
        }
      })
    }
  }

  render () {
    return (
      <div className={this.props.className} style={this.props.style} onScroll={this.viewDidScroll} ref={(node) => { this.dom = node }}>
        {this.props.children}
      </div>
    )
  }
}
