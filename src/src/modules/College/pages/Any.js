import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import Nav from 'components/Nav'
import styles from './Any.less'
import Spinner from 'components/Spinner'

@connect(state => {
  return {
    applyStatus: state.college.applyStatus,
    applyModel: state.college.applyModel,
    loading: state.loading.global,
  }
})
export default class Any extends Component {
  constructor(props) {
    super(props)
    this.handlerGoBack = this.handlerGoBack.bind(this)
  }



  handlerGoBack () {
    const {dispatch, myHistory = {}} = this.props
    const {pUrl} = myHistory
    if (pUrl) {
      dispatch(routerRedux.goBack())
    } else {
      dispatch(routerRedux.replace('/college'))
    }
  }

  initWXShare () {
    const {origin, pathname, href} = window.location
    const title = '智信资管研习社'
    let imgUrl = `${origin}${pathname}/img/share_logo.jpg`
    const message = {
      imgUrl,
      title,
      desc: "智信资管研习社招生简章",
      link: href,
      type: 'link'
    }

    wx.onMenuShareAppMessage(message)
    wx.onMenuShareQQ(message)
    wx.onMenuShareTimeline(message)
  }

  componentDidMount() {
    const { dispatch } = this.props
    wx.ready(()=>{this.initWXShare()})
    dispatch({
      type: 'college/fetchApplyStatus',
      payload: {
        params: {},
        cb: (data) => {
          console.log(data)
          if (data > 0) {
            dispatch({
              type: 'college/fetchApplyInfo',
              payload: {
                params: {}
              }
            })
          }
        }
      }
    })
  }

  renderDesc() {
    return (
      <div className={styles['desc_box']}>

        <h1 className={styles['title']}>智信资管研习社招生简章</h1>

        {/*<h3 className={styles.guide}></h3>*/}

        <p className={styles.summary}><strong>我们知道：</strong><br />
          1.  <strong>您的时间很宝贵。</strong>抽出周末两天的时间去参加一场培训，对您来说不太现实，不是钱的问题，实在是太忙了。但是每隔一周，花周六下午的时间去开开脑洞，您是可以接受的。<br />
          2.  <strong>您希望听到富有洞见的内容。</strong>市面上流传的各种“干货”，各种交易结构设计，各种所谓的产品创新，让您听得有点厌烦了，您希望听到业界大咖和业务大拿的经验分享，他们的某一句话点醒您，这课就算没白听了。<br />
          3.  <strong>您希望认识到有用的朋友。</strong>太多无效的社交、饭局，已经让您不厌其烦，您需要精准、高效地认识一些有用的朋友， 您希望您的同学是经过严格筛选的。<br />
          <br />
        </p>

        <strong>我们为您提供</strong><br />
        <strong>1.  少而精的课程。</strong>学制半年，每隔一周的周六下午上课，共计12门课程。<br />
        <img src="img/box.jpg" alt="" style={{ width: '100%', height: 'auto', margin: '0.05rem 0 ' }} />
        <p><strong>说明</strong>：
          1.具体授课内容可能酌情调整。
          2.课程的先后顺序，会根据市场热点、学员需求、讲师情况综合确定，每次上课时，会公布下一次课程的讲师和内容。<br />
        </p>
        <br />
        <strong>2.  精心构建的同学生态。</strong>所有学员均由研习社负责人深度电话访谈或面谈，同时按照“行业错配，职级相当，背景多元”的原则构造学员生态。简而言之，不是花钱就可以加入这个研习社的。<br />
        <strong>3.  每个人都有自我展示的机会。</strong>开学第一课为同学自我介绍，每人做一个PPT，用2-3分钟，介绍自己的成长、工作经历，自己从事的业务，希望认识到的朋友。后续插班进来的同学，在每次上课前补充介绍。符合条件的学员，还可以申请做课前分享，更加系统地介绍自己的公司和业务，寻找合作伙伴。<br />
        <br />
        <strong>课程信息</strong>
        <p><strong>主办方</strong>：智信资产管理研究院<br />
          <strong>上课时间</strong>：2017年9月2日-2018年3月3日，每隔一周的周六14:00-17:00（如周六遇法定节假日，则顺延）。<br />
          <strong>上课地点</strong>：北京、上海交通便利的高品质星级酒店<br />
          <strong>学费</strong>：2017年8月31日前报名，审核通过并缴费，仅收取运营服务费6000元/人（从第二期开始按照标准学费收取）。<br />
          <strong>发票</strong>：可根据学员需求，开具“培训费/咨询费/服务费”发票。<br />
          <br />
          <strong>插班制度</strong>：智信资管研习社以6个月为一期，持续滚动举办，可插班学习，上满半年截至。<br />
          <strong>串班制度</strong>：北京班和上海班之间可以互相串班，即欢迎北京班的同学到上海听课，也欢迎上海班的同学到北京学习。<br />
          <br />
          <strong>报名与咨询</strong><br />
          提交报名信息→初审通过→深度电话访谈/面谈→录取→交费→上课
          <br />
          <br />
          <strong>课程咨询</strong><br />
          <p>1.	长按下方二维码，添加智信资管研习社负责人微信号进行咨询</p><br />
          <img src="img/zz_code.jpg" alt="" style={{ width: '100%', height: 'auto', margin: '0.05rem 0 ' }} />

          <p>2.若您还有疑问，欢迎拨打智信资管研习社官方咨询电话 <a href="tel:021-60857660">021-60857660</a></p><br />
          <br />
          <strong>智信资管研习社简介</strong><br />
          “智信资管研习社”是智信资产管理研究面向金融行业青年骨干推出的，集精品课程和品质交流为一体的培训项目。<br />
          智信资产管理研究院是顺应大资管时代的需求，于2013年初成立的独立民间智库组织。研究院秉承“开放式研究，思想众筹”的思路，追求对资管业务、资管机构、资管人三维认知的统一，以“谋士立场”服务中国资产管理行业。<br />
          智信研究院每年编撰的《中国资产管理行业发展报告》在资管行业享有崇高的声誉，每月编撰的内部参考读物《资管高层决策参考》在监管高层、资管机构高管中有精准、独到的决策影响力。<br />
          智信研究院以活动为载体，通过精心策划议题和构建嘉宾生态，营造知识分享和社交场景，致力于让参与者用最短的时间“学到自己想学的知识，认识到自己想认识的人”。
        </p>
        <div className={styles.ztrust_footer_logo} />




      </div>
    )
  }

  render() {
    const { applyModel: { id, name, mobile, company, department, job, permanent_area }, applyStatus, dispatch, loading } = this.props
    const area = Config.areaList.find(item => item.value === +permanent_area ) || { label: '' }
    let hint = null, btn = null
    switch (applyStatus) {
      case 1:
        hint = (
          <div className={styles['header']}>
            <h3>抱歉，您的申请未被通过</h3>
          </div>
        )
        break
      case 2:
        hint = (
          <div className={styles['header']}>
            <h3>您已成功提交申请</h3>
            <h3>请耐心等待工作人员审核</h3>
          </div>
        )
        break
      case 3:
        hint = (
          <div className={styles['header']}>
            <h3>您的申请已通过</h3>
            <h3>请您及时支付学费</h3>
          </div>
        )
        btn = <Button type="primary" onClick={() => { dispatch(routerRedux.replace(`college/confirm/${id}`)) }}>立即支付</Button>
        break
      case 4:
        hint = (
          <div className={styles['header']}>
            <h3>您的申请已被通过</h3>
            <h3>请耐心等待工作人员安排入学</h3>
          </div>
        )
        break
      case 5:
        hint = (
          <div className={styles['header']}>
            <h3>抱歉，您的申请已作废</h3>
          </div>
        )
        break
      case 6:
        hint = (
          <div className={styles['header']}>
            <h3>恭喜，您已是正式学员</h3>
          </div>
        )
        break
      default:
        btn = <Button type="primary" onClick={() => { dispatch(routerRedux.replace('college/apply')) }}>申请入学</Button>
        break
    }
    return (
      <div className={styles['any']}>
        { applyStatus > 0 && <Nav left={<i className='icon icon-arrows-left' />} onLeftClick={this.handlerGoBack} center={ applyStatus > 0 ? "申请信息" : "智信资管研习社" } /> }
        { hint }
        {
          applyStatus > 0 ? (
            <div className={styles['confirm-info']}>
              <div className={styles['confirm-info-header']}>报名信息:</div>
                <div className={styles['confirm-info-content']}>
                  <p>姓名: {name}</p>
                  <p>手机: {mobile}</p>
                  <p>上课城市: {area.label}</p>
                  <p>单位: {company}</p>
                  <p>部门: {department}</p>
                  <p>职位: {job}</p>
                </div>
            </div> ) : this.renderDesc()
        }
        <div className={styles['footer']}>
          { btn }
          { applyStatus > 0 && <p className={styles['footer-hint']}>有疑问请联系我们: <a style={{ color: '#3d74c7' }}>{Config.businessSchool.serviceTel}</a></p> }
        </div>
        {
          loading && <Spinner loading mask={false} />
        }
      </div>
    )
  }
}
