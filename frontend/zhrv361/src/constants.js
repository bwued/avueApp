export default {
  install(Vue, options) {
    Vue.prototype.STATIC_INFO = {
      appName: process.env.VUE_APP_NAME,
      appVersion: process.env.VUE_APP_VERSION,
      officialQrCodePath: require(`../${process.env.VUE_APP_OFFCIAL_QR_CODE_PATH}`),
      serviceQrCodePath: require(`../${process.env.VUE_APP_SERVICE_QR_CODE_PATH}`),
      servicePhoneNumber: process.env.VUE_APP_SERVICE_PHONE_NUMBER,
      serviceWechatNo: process.env.VUE_APP_SERVICE_WECHAT_NO,
      baseAddress: process.env.VUE_APP_BASE_ADDRESS,
      appDownloadUrl: process.env.VUE_APP_DOWNLOAD_URL,
      sharecodeUrl: process.env.VUE_APP_SHARECODE_URL,
      cfcaAuthUrl: process.env.VUE_APP_CFCA_AUTH_URL,
      colorTheme: process.env.VUE_APP_COLOR_THEME
    }
  }
}

