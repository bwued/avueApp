function replaceRawValue(value, type) {
  if (type === 'cardNo') {
    /* 卡号显示每4位后加空格 正则处理方法 */
    let format = value
    format = format.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
    return format
  } else if (type === 'identifyNo') {
    /* 卡号显示6,8位后加空格 正则处理方法 */
    let format = value
    format = format.replace(/\s/g, '').replace(/[^0-9X]/g, '').replace(/(\d{6})(?=\d)/, '$1 ').replace(/(\d{8})(?=\d)/, '$1 ')
    return format
  }
}
export default {
  name: 'card-no-input',
  data: function() {
    return {
      previousValue: null// 记录更改前一次值，用作与当前光标位置判断
    }
  },
  props: {
    value: { // v-model的默认绑定值
      type: String
    },
    numType: { // 类型 cardNo银行卡 identifyNo身份证
      type: String
    }
  },
  render(createElement) {
    const self = this
    const initValue = replaceRawValue(self.value, self.numType)
    self.previousValue = initValue
    return createElement('input', {
      attrs: {
        placeholder: self.$attrs.placeholder,
        disabled: self.$attrs.disabled
      },
      'class': {
        form_input: true,
        bold: self.value
      },
      domProps: {
        value: initValue
      },
      on: {
        keyup: (event) => {
          const cInput = event.target
          // 判断当前光标位置是否小于输入前值的长度，小于则不进行格式转化与传值
          if (cInput.selectionStart < self.previousValue.length) {
            self.previousValue = event.target.value
            return
          }
          self.previousValue = event.target.value
          const displayValue = replaceRawValue(event.target.value, self.numType)
          const rawValue = displayValue.replace(/\s/g, '')
          // 渲染函数中没有与 v-model 的直接对应
          // 组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件
          self.$emit('input', displayValue)
          self.$emit('onRawValue', rawValue)
          event.target.value = replaceRawValue(event.target.value, self.numType)
        },
        blur: (event) => {
          // 失去焦点时，重新执行一次格式转化与传值
          const displayValue = replaceRawValue(event.target.value, self.numType)
          const rawValue = displayValue.replace(/\s/g, '')
          self.$emit('input', displayValue)
          self.$emit('onRawValue', rawValue)
          event.target.value = replaceRawValue(event.target.value, self.numType)
        }
      }
    })
  }
}
