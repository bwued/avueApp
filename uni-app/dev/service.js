// 登录状态
const STATE_KEY = 'STATE_KEY';
const getToken = function () {
    let ret = uni.getStorageSync(STATE_KEY);
    return ret;
}
const addToken = function (token) {
    uni.setStorageSync(STATE_KEY, token);
}
export default {
    getToken,
    addToken
}
