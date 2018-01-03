import React from 'react'
import PropTypes from 'prop-types'
import styles from './DeptBreadcrumb.less'
import cx from 'classname'

export default class DeptBreadcrumb extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    // position: PropTypes.array,
    job: PropTypes.bool, // 是否显示职位信息
    crumb: PropTypes.bool, // 是否分级链接
    link: PropTypes.bool, // 是否链接
    cut: PropTypes.any, // 是否精简前几级
    target: PropTypes.string
  }

  static defaultProps = {placeholder: '-', link: true, crumb: true, job: false, cut: false, target: '_self'}

  render () {
    let {placeholder, position, link, job, crumb, target, cut} = this.props
    let {dept, breadcrumb, small} = styles
    let classet = cx(
      styles.dept,
      styles.breadcrumb,
      this.props.size === 'small' ? styles.small : null
    )

    if (!position) {
      return <ol className={classet}>
        <li>{placeholder}</li>
      </ol>
    }

    let department_text, job_text, last_did
    const href = '#/org/dept/'

    if (!position.department || !position.department.length) {
      department_text = <li>{placeholder}</li>
    } else {
      let arr = position.department || []

      if (crumb) {
        department_text = arr.map((item, i) => {
          let label = (crumb && link) ? <a className='text_blue' href={href + item.id} target={target}>{item.name}</a> : item.name
          last_did = item.id
          return (
            <li key={i}>{label}</li>
          )
        })
      } else {
        if (arr.length <= 3) {
          const item = arr[arr.length - 1]
          let label = link ? <a className='text_blue' href={href + item.id} target={target}>{item.name}</a> : item.name
          department_text = <li key={'d' + item.id}>{label}</li>
        } else {
          arr = arr.slice(3)
          department_text = arr.map((item, i) => {
            let label = (crumb && link) ? <a className='text_blue' href={href + item.id} target={target}>{item.name}</a> : item.name
            last_did = item.ide
            if (item.spread === 'M') {
              return null
            }
            return (
              <li key={i}>{label}</li>
            )
          })
          if (!crumb && link) {
            department_text = <a className='text_blue' href={href + last_did} target={target}>{department_text}</a>
          }
        }
      }
    }

    job_text = job && <span> / {position.job || placeholder}</span>

    return (
      <ol className={classet}>
        {department_text}
        {job_text}
      </ol>
    )
  }
}
