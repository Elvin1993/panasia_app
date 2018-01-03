import Mock, { Random } from 'mockjs'

export default {
  'GET /Article/getFocusArticleList': Mock.mock({'size': 5, 'current': 1, 'total': 5,'dataset|5': [{'id|+1': 1, 'thumb_image': "@image('600x380', '#50B347', '#fff','600x380')", 'jump_url': '@url'}]}),
  'GET /Article/getArticleList': Mock.mock({size: 5, current: 3, 'dataset|5': [{'id|+1': 1, 'title': '@cparagraph(2)', 'thumb_image': "@image('209x140', '#999', '#fff','209x140')", 'content': '@cparagraph(4)', 'c_time': '@datetime("T")'}]}),
  'GET /Article/getArticleInfo': Mock.mock({'dataset': {'id|1-100': 1, 'title': '@cparagraph(1)', 'thumb_image': "@image('670x340', '#999', '#fff','670x340')", 'content': '@cparagraph(20)', 'c_time': '@datetime("yyyy-MM-dd HH:mm")', 'literature_author': '@cname', 'literature_author_desc': "智信资产管理研究院 研究员", 'source': '@csentence(3)' }}),
  'GET /Activity/index': Mock.mock({size: 5, current: 3, 'dataset|5': [{'id|+1': 1, 'subject': '@cparagraph(2)', 'logo_url': "@image('670x340', '#50B347', '#fff','670x340)", 'meeting_time': '@datetime("yyyy/MM/dd")(星期日)', 'meeting_hour': '@datetime("HH:mm")', 'meeting_endhour': '@datetime("HH:mm")', 'area_name': '@city','status|+1': ['INVALID','VALID'], 'pending_status|1': [4, 1], 'meeting_endtime|1': ['@datetime("yyyy/MM/dd")(星期日)', null] }]}),
  'GET /Activity/getActivity': Mock.mock({'dataset': {'id|+1': [1,2,3,4,5], 'type|1': ["S", "S"],'subject': '@cparagraph(2)', 'content': '&nbsp;&nbsp;&nbsp;&nbsp;@cparagraph(5)<p>&nbsp;&nbsp;&nbsp;&nbsp;@cparagraph(5)</p>', 'logo_url': "@image('670x340', '#50B347', '#fff','670x340)",
    'area_id': '@city','status|1': ['未通过','通过'], 'meeting_time': '@datetime("yyyy-MM-dd")(星期六)', 'meeting_hour': '@datetime("H:m")', 'meeting_endhour': '@datetime("H:m")', 'max_user_count|1-100': 1, 'join_deadline':  '@datetime("yyyy-MM-dd")(星期六) @datetime("H:m")',
    'speaker': '&nbsp;&nbsp;&nbsp;&nbsp;@cparagraph(1)<p>&nbsp;&nbsp;&nbsp;&nbsp;@cparagraph(5)</p>', 'circuit': '&nbsp;&nbsp;&nbsp;&nbsp;@cparagraph(5)<p>&nbsp;&nbsp;&nbsp;&nbsp;@cparagraph(5)</p>', 'honor_guest':'@cparagraph(1)<br/>@cparagraph(1)<br/>@cparagraph(1)<br/>@cparagraph(1)',
    'requirement': '<p>@cparagraph(3)</p>', 'notice': '<p>@cparagraph(3)</p>', 'weixin': 'elvin_long', 'wx_qrcode': "@image('160x160', '#999', '#fff','160x160')", 'status|1': ['prepare','verify','not_verify','release','execute','finish','is_delete'],
    'pending_status|1': [1,2,3], 'apply_status|+1': [1,0],'user_status|+1': ['INVALID','VALID','PENDING']}}),
  'GET /Activity/getActivityInformation': Mock.mock({'dataset|25': [{'id|+1': 1, 'name': '@cparagraph(1).jpg', 'extension|1': ['zip','rar','doc','xls','ppt','pdf','txt','mp3','avi','bmp','jpg','jpeg','gif','png'], 'create_time': '@datetime("yyyy-MM-dd HH:mm")', 'size|1-100': 1, 'extension_bg|1': ['#0f9d58','#d24726','#e13d34','#5eb533','#8e44ad'], 'url': '@url'}]}),
  'POST /Activity/sendActivityInformationToEmail': Mock.mock({'code': 0, 'msg': '成功'}),
  'GET /Activity/getActivityUser': Mock.mock({size: 1, current: 3, 'dataset|12': [{'id|+1': 1, 'uid|+1': 1001, 'name': '@cname', 'user_face': "@image('670x340', '#50B347', '#fff','670x340)", 'position': {
    'organization_name': '中新融创资本管理有限公司',
    'department|5': [{'id|+1': 1, 'oid|+1': '1', 'pid|+1': 0, 'name': '管理层', 'spread': ['M','Y']}]

  }, 'bussiness_card': "@image('670x340', '#50B347', '#fff','670x340)"}]}),
  'GET /Activity/getActivityUserDetail': Mock.mock({'dataset': {'id|1': 1, 'uid|+1': 1001, 'name': '@cname', 'user_face': "@image('670x340', '#50B347', '#fff','670x340)", 'position': '国信证券 > 资产管理总部 / 投资经理', 'bussiness_card': "@image('670x340', '#50B347', '#fff','670x340)", 'is_exchange|1': [1,0], 'is_valid|1': [1,0]}}),
  'GET /User/getUserInfo': Mock.mock({'dataset': {'id|1': 1, 'uid|+1': 1001, 'name': '@cname', 'user_face': "@image('670x340', '#50B347', '#fff','670x340)", 'position': '国信证券 > 资产管理总部 / 投资经理', 'bussiness_card': "@image('670x340', '#50B347', '#fff','670x340)", 'is_exchange|1': [1,0], 'is_valid|1': 1}}),
  'GET /User/getUserActivitys': Mock.mock({size: 5, current: 3, 'dataset|5': [{'id|+1': 1, 'subject': '@cparagraph(2)', 'logo_url': "@image('670x340', '#50B347', '#fff','670x340)", 'time': '@datetime("MM-dd HH:mm")', 'city': '@city','status|1': ['未通过','通过'] }]}),
  'GET /UserCardcase/getCardcaseList': Mock.mock({size: 1, current: 1, 'dataset|12': [{'id|+1': 1, 'uid|+1': 1001, 'name': '@cname', 'user_face': "@image('670x340', '#50B347', '#fff','670x340)", 'position': '国信证券 > 资产管理总部 / 投资经理', 'bussiness_card': "@image('670x340', '#50B347', '#fff','670x340)"}]}),
  'GET /Login/checkLogin': Mock.mock({size: 1, current: 1, 'dataset|12': [{'id|+1': 1, 'uid|+1': 1001, 'name': '@cname', 'user_face': "@image('670x340', '#50B347', '#fff','670x340)", 'position': '国信证券 > 资产管理总部 / 投资经理', 'bussiness_card': "@image('670x340', '#50B347', '#fff','670x340)"}]}),
  'POST /User/updateUserInfo': Mock.mock({'code': 0,'message':'成功','dataset': {'id|1': 1, 'uid|+1': 1001, 'name': '@cname', 'user_face': "@image('670x340', '#50B347', '#fff','670x340)", 'position': '国信证券 > 资产管理总部 / 投资经理', 'bussiness_card': "@image('670x340', '#50B347', '#fff','670x340)", 'is_friend|1': [1,0], 'is_valid|1': 1}}),
  'GET /Login/auth': Mock.mock({'code': -1})
};
