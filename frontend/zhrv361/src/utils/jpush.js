/* eslint-disable */
export default function setJpush(phone, callback) {
  console.log('enter setJpush')
  var param = {
    alias: phone,
    // alias: '13694293141',
    tags: ['a', 'b']
  }
  window.jpush.bindAliasAndTags(param, function(ret) {
    console.log('bindAliasAndTags ret: ' + JSON.stringify(ret));
  })
}
