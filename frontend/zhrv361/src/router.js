import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/home',
    name: 'index',
    meta: { index: 1 } // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
  },
  {
    path: '/login',
    name: 'login',
    meta: { index: 0 },
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/login')
  },
  {
    path: '/register',
    name: 'register',
    meta: { index: 0.1 },
    component: () => import(/* webpackChunkName: "register" */ '@/views/login/register')
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    meta: { index: 0.2 },
    component: () => import(/* webpackChunkName: "forgetPassword" */ '@/views/login/forgetPassword')
  },
  {
    path: '/xieyi',
    name: 'xieyi',
    meta: { index: 0.3 },
    component: () => import(/* webpackChunkName: "xieyi" */ '@/views/login/xieyi')
  },
  {
    path: '/proceeds',
    name: 'proceeds',
    meta: { index: 1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "proceeds" */ '@/views/proceeds/proceeds')
  },
  {
    path: '/recommend',
    name: 'recommend',
    meta: { index: 2 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "recommend" */ '@/views/recommend/recommend')
  },
  {
    path: '/shareCode',
    name: 'shareCode',
    meta: { index: 2.2 },
    component: () => import(/* webpackChunkName: "shareCode" */ '@/views/recommend/shareCode')
  },
  {
    path: '/selectImg',
    name: 'selectImg',
    meta: { index: 2.1 },
    component: () => import(/* webpackChunkName: "selectImg" */ '@/views/recommend/selectImg')
  },
  {
    path: '/revenueList',
    name: 'revenueList',
    meta: { index: 2.1 },
    component: () => import(/* webpackChunkName: "revenueList" */ '@/views/recommend/revenueList')
  },
  {
    path: '/rankingActivities',
    name: 'rankingActivities',
    meta: { index: 2.1 },
    component: () => import(/* webpackChunkName: "rankingActivities" */ '@/views/recommend/rankingActivities')
  },
  {
    path: '/awardRecord',
    name: 'awardRecord',
    meta: { index: 2.2 },
    component: () => import(/* webpackChunkName: "awardRecord" */ '@/views/recommend/awardRecord')
  },
  {
    path: '/center',
    name: 'center',
    meta: { index: 3 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "center" */ '@/views/center/center')
  },
  {
    path: '/authentication',
    name: 'authentication',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "authentication" */ '@/views/center/authentication')
  },
  {
    path: '/authentication-success',
    name: 'authentication-success',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "authentication" */ '@/views/center/authentication-success')
  },
  {
    path: '/authenticationStatus',
    name: 'authenticationStatus',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "authenticationStatus" */ '@/views/center/authenticationStatus')
  },
  {
    path: '/addCard',
    name: 'addCard',
    meta: { index: 3.2 },
    component: () => import(/* webpackChunkName: "addCard" */ '@/views/center/addCard')
  },
  {
    path: '/addCreditCard',
    name: 'addCreditCard',
    meta: { index: 3.2 },
    component: () => import(/* webpackChunkName: "addCreditCard" */ '@/views/center/addCreditCard')
  },
  {
    path: '/receipt',
    name: 'receipt',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "receipt" */ '@/views/center/receipt')
  },
  {
    path: '/bill',
    name: 'bill',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "bill" */ '@/views/center/bill')
  },
  {
    path: '/limit',
    name: 'limit',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "limit" */ '@/views/center/limit')
  },
  {
    path: '/limit2',
    name: 'limit2',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "limit2" */ '@/views/center/limit2')
  },
  {
    path: '/myCard',
    name: 'myCard',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "myCard" */ '@/views/center/myCard')
  },
  {
    path: '/credit',
    name: 'credit',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "credit" */ '@/views/v3/credit')
  },
  {
    path: '/addChannel',
    name: 'addChannel',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "addChannel" */ '@/views/v3/addChannel')
  },
  {
    path: '/zxChannel',
    name: 'zxChannel',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "zxChannel" */ '@/views/v3/zxChannel')
  },
  {
    path: '/lrChannel',
    name: 'lrChannel',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "lrChannel" */ '@/views/v3/lrChannel')
  },
  {
    path: '/v3bindCard',
    name: 'v3bindCard',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "v3bindCard" */ '@/views/v3/v3bindCard')
  },
  {
    path: '/v3bindCardHT',
    name: 'v3bindCardHT',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "v3bindCardHT" */ '@/views/v3/v3bindCardHT')
  },
  {
    path: '/faq',
    name: 'faq',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "faq" */ '@/views/center/faq')
  },
  {
    path: '/statement',
    name: 'statement',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "statement" */ '@/views/center/statement')
  },
  {
    path: '/agreement',
    name: 'agreement',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "agreement" */ '@/views/center/agreement')
  },
  {
    path: '/set',
    name: 'set',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "set" */ '@/views/center/set')
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "withdraw" */ '@/views/center/withdraw')
  },
  {
    path: '/tixian',
    name: 'tixian',
    meta: { index: 3.2 },
    component: () => import(/* webpackChunkName: "withdraw" */ '@/views/center/tixian')
  },
  {
    path: '/myWallet',
    name: 'myWallet',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "myWallet" */ '@/views/center/myWallet')
  },
  {
    path: '/dailyEarnings',
    name: 'dailyEarnings',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "dailyEarnings" */ '@/views/center/dailyEarnings')
  },
  {
    path: '/editPassword',
    name: 'editPassword',
    meta: { index: 3.2 },
    component: () => import(/* webpackChunkName: "editPassword" */ '@/views/center/editPassword')
  },
  {
    path: '/receivingAddress',
    name: 'receivingAddress',
    meta: { index: 3.2 },
    component: () => import(/* webpackChunkName: "receivingAddress" */ '@/views/center/receivingAddress')
  },
  {
    path: '/permanentAddress',
    name: 'permanentAddress',
    meta: { index: 3.2 },
    component: () => import(/* webpackChunkName: "permanentAddress" */ '@/views/center/permanentAddress')
  },
  {
    path: '/newAddress',
    name: 'newAddress',
    meta: { index: 3.3 },
    component: () => import(/* webpackChunkName: "newAddress" */ '@/views/center/newAddress')
  },
  {
    path: '/addAddress',
    name: 'addAddress',
    meta: { index: 3.3 },
    component: () => import(/* webpackChunkName: "addAddress" */ '@/views/center/addAddress')
  },
  {
    path: '/creditChannel',
    name: 'creditChannel',
    meta: { index: 1.1 },
    component: () => import(/* webpackChunkName: "creditChannel" */ '@/views/proceeds/creditChannel')
  },
  {
    path: '/selectCard',
    name: 'selectCard',
    meta: { index: 1.2 },
    component: () => import(/* webpackChunkName: "selectCard" */ '@/views/proceeds/selectCard')
  },
  {
    path: '/huabeiPay',
    name: 'huabeiPay',
    meta: { index: 1.2 },
    component: () => import(/* webpackChunkName: "huabeiPay" */ '@/views/proceeds/huabeiPay')
  },
  {
    path: '/supplementaryCertification',
    name: 'supplementaryCertification',
    meta: { index: 1.3 },
    component: () => import(/* webpackChunkName: "supplementaryCertification" */ '@/views/proceeds/supplementaryCertification')
  },
  {
    path: '/changeCard',
    name: 'changeCard',
    meta: { index: 1.3 },
    component: () => import(/* webpackChunkName: "changeCard" */ '@/views/proceeds/changeCard')
  },
  {
    path: '/bindCard',
    name: 'bindCard',
    meta: { index: 1.4 },
    component: () => import(/* webpackChunkName: "bindCard" */ '@/views/proceeds/bindCard')
  },
  {
    path: '/bindCardT',
    name: 'bindCardT',
    meta: { index: 1.4 },
    component: () => import(/* webpackChunkName: "bindCard" */ '@/views/proceeds/bindCardT')
  },
  {
    path: '/bindCardTX',
    name: 'bindCardTX',
    meta: { index: 1.4 },
    component: () => import(/* webpackChunkName: "bindCard" */ '@/views/proceeds/bindCardTX')
  },
  {
    path: '/member',
    name: 'member',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/member')
  },
  {
    path: '/vmall',
    name: 'vmall',
    meta: { index: 3.1 },
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/vmall')
  },
  {
    path: '/integral',
    name: 'integral',
    meta: { index: 3.2 },
    component: () => import(/* webpackChunkName: "member" */ '@/views/member/integral')
  },
  {
    path: '/team',
    name: 'team',
    meta: { title: '我的团队', index: 3.2 },
    component: () => import(/* webpackChunkName: "team" */ '@/views/member/team')
  },
  {
    path: '/directTeam',
    name: 'directTeam',
    meta: { title: '会员', index: 3.3 },
    component: () => import(/* webpackChunkName: "directTeam" */ '@/views/member/directTeam')
  },
  {
    path: '/secondTeam',
    name: 'secondTeam',
    meta: { title: '二级用户', index: 3.4 },
    component: () => import(/* webpackChunkName: "secondTeam" */ '@/views/member/secondTeam')
  },
  {
    path: '/home',
    name: 'home',
    meta: { title: '首页', index: 1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "home" */ '@/views/home/index')
  },
  {
    path: '/iframe',
    name: 'iframe',
    meta: { title: '首页第三方', index: 1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "s_iframe" */ '@/views/home/iframe')
  },
  {
    path: '/roll',
    name: 'roll',
    meta: { title: '滚动', index: 1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "s_iframe" */ '@/views/home/roll')
  },
  {
    path: '/sf',
    name: 'sf',
    meta: { title: '丰e足食', index: 1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "s_iframe" */ '@/views/home/sf')
  },
  {
    path: '/s_iframe',
    name: 's_iframe',
    meta: { title: '第三方', index: 1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "s_iframe" */ '@/views/externalSecondLinks/s_iframe')
  },
  {
    path: '/noticeList',
    name: 'noticeList',
    meta: { title: '公告', index: 1.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "noticeList" */ '@/views/notice/noticeList')
  },
  {
    path: '/noticeDetail',
    name: 'noticeDetail',
    meta: { title: '公告详情', index: 1.2 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "noticeDetail" */ '@/views/notice/noticeDetail')
  },
  {
    path: '/planList',
    name: 'planList',
    meta: { title: '计划列表', index: 1.2 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "planList" */ '@/views/plan/planList')
  },
  {
    path: '/planDetails',
    name: 'planDetails',
    meta: { title: '计划详情', index: 1.3 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "planDetails" */ '@/views/plan/planDetails')
  },
  {
    path: '/addPlan',
    name: 'addPlan',
    meta: { title: '添加计划', index: 1.3 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "addPlan" */ '@/views/plan/addPlan')
  },
  {
    path: '/intelligence',
    name: 'intelligence',
    meta: { title: '智能还款', index: 1.4 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "intelligence" */ '@/views/plan/intelligence')
  },
  {
    path: '/intelligenceV2',
    name: 'intelligenceV2',
    meta: { title: '智能还款', index: 1.4 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "intelligence" */ '@/views/plan/intelligenceV2')
  },
  {
    path: '/intelligenceV3',
    name: 'intelligenceV3',
    meta: { title: '懒鬼计划', index: 1.9 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "intelligence" */ '@/views/plan/intelligenceV3')
  },
  {
    path: '/custom',
    name: 'custom',
    meta: { title: '自定义还款', index: 1.4 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "custom" */ '@/views/plan/custom')
  },
  {
    path: '/repayment',
    name: 'repayment',
    meta: { title: '自定义还款', index: 1.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "login" */ '@/views/center/repayment')
  },
  {
    path: '/zhihuijin',
    name: 'zhihuijin',
    meta: { title: '智慧金提取', index: 1.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "zhihuijin" */ '@/views/center/zhihuijin')
  },
  {
    path: '/zhihuijinlist',
    name: 'zhihuijinlist',
    meta: { title: '智慧金明细', index: 1.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "zhihuijin" */ '@/views/center/zhihuijinlist')
  },
  {
    path: '/weike',
    name: 'weike',
    meta: { index: 1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "weike" */ '@/views/weike/weike')
  },
  {
    path: '/share',
    name: 'share',
    meta: { index: 2 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "share" */ '@/views/recommend/share')
  },
  {
    path: '/makeMoney',
    name: 'makeMoney',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "makeMoney" */ '@/views/recommend/makeMoney')
  },
  {
    path: '/shareMakeMoney',
    name: 'shareMakeMoney',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "shareMakeMoney" */ '@/views/recommend/shareMakeMoney')
  },
  {
    path: '/forward',
    name: 'forward',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "forward" */ '@/views/recommend/forward')
  },
  {
    path: '/videoTeaching',
    name: 'videoTeaching',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "videoTeaching" */ '@/views/recommend/videoTeaching')
  },
  {
    path: '/consult',
    name: 'consult',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "consult" */ '@/views/consult/consult')
  },
  {
    path: '/C_iframe',
    name: 'C_iframe',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "consult" */ '@/views/consult/C_iframe')
  },
  {
    path: '/xuetang',
    name: 'xuetang',
    meta: { index: 2.2 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "consult" */ '@/views/consult/xuetang')
  },
  {
    path: '/externalSecondLinks',
    name: 'externalSecondLinks',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "externalSecondLinks" */ '@/views/externalSecondLinks/externalSecondLinks')
  },
  {
    path: '/externalLinks',
    name: 'externalLinks',
    meta: { index: 3.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "externalLinks" */ '@/views/externalLinks/externalLinks')
  },
  {
    path: '/iframe',
    name: 'iframe',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "consult" */ '@/components/iframe')
  },
  {
    path: '/hiframe',
    name: 'hiframe',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "consult" */ '@/components/hiframe')
  },
  {
    path: '/xiframe',
    name: 'xiframe',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "consult" */ '@/components/xiframetx')
  },
  {
    path: '/iframetx',
    name: 'iframetx',
    meta: { index: 2.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab 2020.01.15
    component: () => import(/* webpackChunkName: "consult" */ '@/components/iframetx')
  },
  {
    path: '/externalLinksShare', // TODO 微课、视频 分享朋友圈 3/10 hgwnli
    name: 'externalLinksShare',
    meta: { index: 3.1 }, // meta对象的index用来定义当前路由的层级,由小到大,由低到高 0级表示tab
    component: () => import(/* webpackChunkName: "externalLinksShare" */ '@/views/externalLinksShare/externalLinksShare')
  }
]

window.$$ROUTE_NAMES = routes.map((item) => item.name.toLowerCase())

export default new Router({
  routes: routes, // eslint-disable-line
})
