import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import styles from './SearchBar.less'

@autobind
export default class SearchBar extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      searchText: props.value || '',
      showBtn: false
    }
  }

  componentDidMount () {
    if (this.props.autoFocus) {
      this.searchInput$.focus()
    }
  }

  handlerChange (e) {
    const searchText = e.target.value
    this.setState({
      searchText
    })
  }

  handlerCancel () {
    this.setState({
      showBtn: false,
      searchText: ''
    })
    this.props.onCancel && this.props.onCancel()
  }

  handlerClear () {
    if (!this.state.searchText) { return }

    this.setState({
      searchText: ''
    })
    this.searchInput$.focus()
    this.props.onClear && this.props.onClear()
  }

  handlerBlur () {
    // if (!this.state.searchText) {
    //   this.setState({showBtn: false})
    // }
  }

  handlerSearch (event) {
    event.preventDefault()
    event.stopPropagation()
    this.props.onSearch && this.props.onSearch(this.state.searchText)
  }

  render () {
    const {searchText, showBtn} = this.state
    const {placeholder = '搜索'} = this.props
    return (
      <div className={styles.search_bar}>
        <form action='#' className={styles.search_bar_input_box} onSubmit={this.handlerSearch}>
          <i className='icon icon-search' />
          <input
            ref={(node) => { this.searchInput$ = node }}
            type='search'
            className={styles.search_input}
            placeholder={placeholder}
            value={searchText}
            onChange={this.handlerChange}
            onFocus={() => this.setState({showBtn: true})}
            onBlur={this.handlerBlur}
          />
          {searchText && <i className='icon icon-cancel' onClick={this.handlerClear} />}
        </form>
        {showBtn && <div className={styles.search_btn_cancel} onClick={() => this.handlerCancel()}>取消</div>}
      </div>
    )
  }
}
