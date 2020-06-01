import api from './Api_com.js' 
let baseurl = api.ZuceUrl
// 公共的请求
 const request = function(options) {
     options.url = baseurl + options.url;
     try {
       const token = uni.getStorageSync('token');
       if (token) {
         options.header = {
           'Authorization' : 'Bearer ' + token
         };
        }else{
            uni.navigateTo({
                url: '../pages/login/login' 
            });
            return;
        }
     } catch (err) {
      console.log(err)
    }
    return uni.request(options);
  }
export default request;



