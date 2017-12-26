import 'video-react/dist/video-react.css'
import styles from './VideoPlay.less'
import {
  Player, BigPlayButton, ControlBar, ReplayControl,
  ForwardControl, CurrentTimeDisplay,
  TimeDivider, PlaybackRateMenuButton, VolumeMenuButton
} from 'video-react'//
// import { DefaultPlayer as Video } from 'react-html5video';
// import 'react-html5video/dist/styles.css';

@autobind
export default class extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props)
  }

  componentDidMount () {
  }

  isWork () {
    const {readyState, videoWidth} = this.$player
    console.log(readyState, videoWidth)
    if (readyState === 0 && videoWidth === 0) {
      return false
    }
    return true
  }

  handlerReload () {
    this.setState({
      playVideo: {
        id: 2,
        post: 'http://api.zentrust.cn/data/Uploads/2016-08-05/57a46ed312641.jpg',
        url: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'
      }
    })
    this.$player.reload()

    this.$player.addEventListener('canplaythrough', () => {
      this.$player.play()
    })
  }

  render () {
    return (
      <Player
        poster='http://api.zentrust.cn/test/data/Uploads/2017-05-27/银行视角下创新型理财融资业务.jpg'
        src='http://cdn.m.ztrust.com/video/%E8%AF%BE%E7%A8%8B%E4%B8%8A%E4%BC%A0%E6%9B%B4%E6%96%B0/%E9%93%B6%E8%A1%8C%E8%A7%86%E8%A7%92%E4%B8%8B%E5%88%9B%E6%96%B0%E5%9E%8B%E7%90%86%E8%B4%A2%E8%9E%8D%E8%B5%84%E4%B8%9A%E5%8A%A1/%E7%AC%AC%E4%B8%80%E8%AE%B2%EF%BC%9A%E5%88%9B%E6%96%B0%E5%9E%8B%E7%90%86%E8%B4%A2%E8%9E%8D%E8%B5%84%E4%B8%9A%E5%8A%A1%EF%BC%9A%E8%82%A1%E6%9D%83%E8%9E%8D%E8%B5%84%E6%A8%A1%E5%BC%8F.m4v'
      >
        <BigPlayButton position='center' />
      </Player>

    )
  }
}
