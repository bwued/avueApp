/**
 * api接口的统一出口
 */

// xxx模块接口
import login from './login'
import proceeds from './proceeds'
import center from './center'
import card from './card'
import recommend from './recommend'
import member from './member'
import richText from './richText'
import home from './home'
import plan from './plan'
import repay from './repay'

// 导出接口
export default {
  login, proceeds, center, card, recommend, member, richText, home, plan, repay
}
