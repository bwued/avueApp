/* eslint-disable */
/**
 * js工具包
 */

/**
 * 判断数组中是否包含指定的元素
 * 使用方法：arr.contains(['指定的元素'])
 */
Array.prototype.contains = function(needle) {
  for (i in this) {
    if (this[i] === needle) return true
  }
  return false
}
/**
 * 对富文本ueditor编辑插入的图片进行处理
 * @desc 1、添加class="r-img"    2、图片路径添加访问域名
 * @parent string content 文本
 * @return string
 */
function handleImage(content) {
  var newStr = ''
  newStr = content.replace(/class="[\s\S]*?"/g, '')
  newStr = newStr.replace(/src="http/g, 'class="r-img" src="http')
  /* newStr = newStr.replace(/src="\/public\/uploads\/ueditor/g,'class="r-img" src="http://yimei.mofengkeji.com/public/uploads/ueditor"');*/
  newStr = newStr.replace(
    /src="\/public\/uploads\/ueditor/g,
    'class="r-img" src="http://wechat3.walkerbang.com/ymfx/public/uploads/ueditor"'
  )
  return newStr

  // return content.replace(/<img src="/g,'<img class="r-img" src="http://wen.apenblog.cn');
}
/**
 * js获取url参数
 * @param string variable 参数名称
 * @return mixed 返回参数名称对应的值
 */
function getQueryVariable(variable) {
  var query = window.location.href.substr(window.location.href.indexOf('?') + 1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}

/**
 * js获取url全部参数
 * @return string 返回所有参数和值组成的字符串
 */
function getAllQueryVariableWithout(arr) {
  if (arr != '') {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    var str = ''
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')

      if (!arr.contains(pair[0])) {
        if (pair[0] != '') {
          if (i === 0) {
            str += '?' + vars[i]
          } else {
            str += '&' + vars[i]
          }
        }
      }
    }
    if (str != '') {
      return str + '&'
    } else {
      return str + '?'
    }
  }
}

/**
 * 判断数组中是否包含指定的元素
 * 使用方法：arr.contains(['指定的元素'])
 */
Array.prototype.contains = function(needle) {
  for (i in this) {
    if (this[i] === needle) return true
  }
  return false
}

/**
 * 检查手机号码
 */
function isPhone(phone) {
  if (!/^1\d{10}$/.test(phone)) {
    return false
  } else {
    return true
  }
}

// 判断邮箱格式
function isEmail(phone) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if (!re.test(phone)) {
    return false
  } else {
    return true
  }
}

// 判断是否是数字
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// 详情页获取列表页传过来的id
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
/**
 * 格式化时间
 * @param number 时间戳
 * @param format 格式
 * return boolean
 */
function formatTime(number, format) {
  var formateArr = ['Y', 'm', 'd', 'H', 'i', 's']
  var returnArr = []

  // var date = new Date(number * 1000);
  var date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }

  return format
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * localStorage
 * 实现定时存储
 * 总容量5M
 * 存入缓存，支持字符串类型、json对象的存储
 * 页面关闭后依然有效 ie7+都有效
 * @param key 缓存key
 * @param stringVal
 * @time 数字 缓存有效时间（秒） 默认60s
 * 注：localStorage 方法存储的数据没有时间限制。第二天、第二周或下一年之后，数据依然可用。不能控制缓存时间，故此扩展
 */
const MyLocalStorage = {
  Cache: {
    put: function(key, stringVal, time) {
      try {
        if (!localStorage) {
          return false
        }
        if (!time || isNaN(time)) {
          time = 60
        }
        var cacheExpireDate = new Date() - 1 + time * 1000
        var cacheVal = { val: stringVal, exp: cacheExpireDate }
        localStorage.setItem(key, JSON.stringify(cacheVal)) // 存入缓存值
        // console.log(key+":存入缓存，"+new Date(cacheExpireDate)+"到期");
      } catch (e) {}
    },
    get: function(key) {
      try {
        if (!localStorage) {
          return false
        }
        const cacheVal = localStorage.getItem(key)
        const result = JSON.parse(cacheVal)
        const now = new Date() - 1
        if (!result) {
          return null
        }
        if (now > result.exp) {
          this.remove(key)
          return ''
        }
        return result.val
      } catch (e) {
        this.remove(key)
        return ''
      }
    },
    remove: function(key) {
      if (!localStorage) {
        return false
      }
      localStorage.removeItem(key)
    },
    clear: function() {
      if (!localStorage) {
        return false
      }
      localStorage.clear()
    }
  }
}

var util = {
  // 获取当前日期的时间戳，不要时分秒
  dateString: function() {
    var a = new Date().toLocaleDateString() // 获取当前的日期
    //		a = a.replace(/\//g,'-');  //转换日期格式
    return new Date(a) / 1000 // 转成时间戳
  },
  // 时间  ==》 时间戳   var date="2014-05-08 00:22:11";
  dateTime: function(dates) {
    dates = new Date(Date.parse(dates.replace(/-/g, '/')))
    return dates.getTime() / 1000
  },
  // 判断密码是否为数字字母组合;
  isPassword: function() {
    var reg2 = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/
    console.log(reg2.test($('.psw').val()))
    return reg2.test($('.psw').val())
  }
}

export default {
  handleImage: handleImage,
  getQueryVariable: getQueryVariable,
  getAllQueryVariableWithout: getAllQueryVariableWithout,
  isPhone: isPhone,
  isEmail: isEmail,
  getQueryString: getQueryString,
  formatTime: formatTime,
  MyLocalStorage: MyLocalStorage,
  isNumeric: isNumeric
}
