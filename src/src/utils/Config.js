import areaData from './areaData'
const Config = {
  zentrust_code: 'assets/img/ztrust_er.jpg',
  jinkeyun_code: 'assets/img/jinkeyunCode.jpg',
  WX_FollowURL: 'http://mp.weixin.qq.com/s?__biz=MzA3NjE3MzYwMQ==&mid=203780394&idx=1&sn=fdb290bdef350c039acc5a97ca647060#rd',
  WX_ID: 'zentrust',
  PAY_NOT_REAUTH: !!__PROD__,
  CDN_BASE: 'zentrust-cn-upload.oss-cn-hangzhou.aliyuncs.com',
  activity: {
    category: {
      'S': '沙龙',
      'C': '咖啡',
      'O': '其他'
    }
  },
  edu: {
    edu_tel: '021-68413606',
    invoiceContent: [
      {value: '培训费', label: '培训费'},
      {value: '咨询费', label: '咨询费'},
      {value: '会议费', label: '会议费'},
      {value: '服务费', label: '服务费'}
    ],
    invoiceTypes: [
      {key: 'plain', value: '普通发票'},
      {key: 'vat', value: '增值税专项发票'}
    ]
  },
  weekdayList: [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '日'
  ],
  cityList: [
    {
      key: '北京',
      city: '北京'
    }, {
      key: '上海',
      city: '上海'
    }, {
      key: '广州',
      city: '广州'
    }, {
      key: '深圳',
      city: '深圳'
    }, {
      key: '大连',
      city: '大连'
    }, {
      key: '青岛',
      city: '青岛'
    }, {
      key: '宁波',
      city: '宁波'
    }, {
      key: '苏州',
      city: '苏州'
    }, {
      key: '东莞',
      city: '东莞'
    }, {
      key: '佛山',
      city: '佛山'
    }, {
      key: '厦门',
      city: '厦门'
    }, {
      key: '温州',
      city: '温州'
    }, {
      key: '天津',
      city: '天津'
    }, {
      key: '重庆',
      city: '重庆'
    }, {
      key: '哈尔滨',
      city: '哈尔滨'
    }, {
      key: '长春',
      city: '长春'
    }, {
      key: '沈阳',
      city: '沈阳'
    }, {
      key: '呼和浩特',
      city: '呼和浩特'
    }, {
      key: '石家庄',
      city: '石家庄'
    }, {
      key: '乌鲁木齐',
      city: '乌鲁木齐'
    }, {
      key: '兰州',
      city: '兰州'
    }, {
      key: '西宁',
      city: '西宁'
    }, {
      key: '西安',
      city: '西安'
    }, {
      key: '银川',
      city: '银川'
    }, {
      key: '郑州',
      city: '郑州'
    }, {
      key: '济南',
      city: '济南'
    }, {
      key: '太原',
      city: '太原'
    }, {
      key: '合肥',
      city: '合肥'
    }, {
      key: '武汉',
      city: '武汉'
    }, {
      key: '长沙',
      city: '长沙'
    }, {
      key: '南京',
      city: '南京'
    }, {
      key: '成都',
      city: '成都'
    }, {
      key: '贵阳',
      city: '贵阳'
    }, {
      key: '昆明',
      city: '昆明'
    }, {
      key: '南宁',
      city: '南宁'
    }, {
      key: '拉萨',
      city: '拉萨'
    }, {
      key: '杭州',
      city: '杭州'
    }, {
      key: '南昌',
      city: '南昌'
    }, {
      key: '福州',
      city: '福州'
    }, {
      key: '台北',
      city: '台北'
    }, {
      key: '海口',
      city: '海口'
    }, {
      key: '香港',
      city: '香港'
    }, {
      key: '澳门',
      city: '澳门'
    }],
  // areaList: [{
  //   label: '东北地区',
  //   value: 0
  // }, {
  //   label: '华北地区',
  //   value: 1
  // }, {
  //   label: '华中地区',
  //   value: 2
  // }, {
  //   label: '华东地区',
  //   value: 3
  // }, {
  //   label: '华南地区',
  //   value: 4
  // }, {
  //   label: '西北地区',
  //   value: 5
  // }, {
  //   label: '西南地区',
  //   value: 6
  // }, {
  //   label: '其他',
  //   value: 7
  // }],
    areaList: [{
    label: '北京',
    value: 0
  }, {
    label: '上海',
    value: 1
  }],
  businessSchool: {
    serviceTel: '021-60857660'
  }
}

Config.areaData = areaData

export default Config
