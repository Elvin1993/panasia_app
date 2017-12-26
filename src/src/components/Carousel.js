import React from 'react'
import { Carousel } from 'antd-mobile'
import styles from './Carousel.less'

export default class Carousel_ extends React.Component {
  constructor (props) {
    super(props)
  }

  locationTo(e) {
    const href = e.currentTarget.dataset['href']
    location.href = href
  }

  render () {
    const {dataset = []} = this.props

    if (dataset.length <= 0) {
      return null
    }

    return (
      <Carousel
        infinite
        autoplay={false}
        className='carousel'
      >
        {
          dataset.reverse().map((item, key) => {
            return (
              <a data-href={item.jump_url} key={key} className={styles.img_box} onClick={this.locationTo.bind(this)}>
                <img src={item.thumb_image} />
              </a>
            )
          })
        }
      </Carousel>
    )
  }
}
