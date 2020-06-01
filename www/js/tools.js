	
	var host = "https://ryapp.longyong.net/ryapp";
	var hosthttp = "http://ryapp.longyong.net/ryapp";

//	var host = "https://test.longyong.net/ryapp";
//	var hosthttp = "http://test.longyong.net/ryapp";

//	var host = "http://192.168.0.165:8080/ryapp";
//	var hosthttp = "http://192.168.0.165:8080/ryapp";
	
	var ua = navigator.userAgent.toLowerCase();
	var requestType = "web";
	if (ua.match(/ruanyina/i) == "ruanyina") {
		requestType = "AndroidWeb";
	} else if (ua.match(/ruanyini/i) == "ruanyini") {
		requestType = "IOSWeb";
	} else if (ua.match(/MicroMessenger/i) == "micromessenger") {
		requestType = "web";
	}
	
	/**
	 * 加密
	 * 
	 * @param message
	 * @param key
	 * @returns
	 */
	function encryptByDES(message, key) {
		message = JSON.parse(message);
		message["client"] = requestType;
		message = JSON.stringify(message);
		var keyHex = CryptoJS.enc.Utf8.parse(key);
		var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
			mode : CryptoJS.mode.ECB,
			padding : CryptoJS.pad.Pkcs7
		});
		return encodeURIComponent("web=" + encrypted.toString());
	}
	
	/**
	 * 加密
	 * 
	 * @param message
	 * @param key
	 * @returns
	 */
	function encryptByDES0(message, key) {
		var keyHex = CryptoJS.enc.Utf8.parse(key);
		var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
			mode : CryptoJS.mode.ECB,
			padding : CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	}
	
	/**
	 * 解密
	 * 
	 * @param message
	 * @param key
	 * @returns
	 */
	function decryptByDES(ciphertext, key) {
		var keyHex = CryptoJS.enc.Utf8.parse(key);
	
		var decrypted = CryptoJS.DES.decrypt({
			ciphertext : CryptoJS.enc.Base64.parse(ciphertext)
		}, keyHex, {
			mode : CryptoJS.mode.ECB,
			padding : CryptoJS.pad.Pkcs7
		});
	
		return decrypted.toString(CryptoJS.enc.Utf8);
	}
	
	function claspan(bankname) {
		var classname = '';
		if ("交通银行" == bankname || "建设银行" == bankname || "江苏银行" == bankname
				|| "浦发银行" == bankname || "兴业银行" == bankname || "兰州银行" == bankname
				|| "渤海银行" == bankname || "哈尔滨银行" == bankname || "花旗中国" == bankname) {
			classname = "pinblue";
		} else if ("农业银行" == bankname || "邮政银行" == bankname || "民生银行" == bankname
				|| "南昌银行" == bankname) {
			classname = "pingreen";
		} else if ("中国银行" == bankname || "北京银行" == bankname || "工商银行" == bankname
				|| "广发银行" == bankname || "广州银行" == bankname || "华夏银行" == bankname
				|| "南京银行" == bankname || "招商银行" == bankname || "中信银行" == bankname
				|| "平安银行" == bankname || "浙商银行" == bankname) {
			classname = "pinred";
		} else if ("光大银行" == bankname || "宁波银行" == bankname || "上海银行" == bankname
				|| "温州银行" == bankname || "包商银行" == bankname) {
			classname = "pinyellow";
		} else {
			classname = "tongyong";
		}
		return classname;
	}
	
	function claspan_new(bankname) {
		var classname = '';
		if ("交通银行" == bankname || "建设银行" == bankname || "江苏银行" == bankname
				|| "浦发银行" == bankname || "兴业银行" == bankname || "兰州银行" == bankname
				|| "渤海银行" == bankname || "哈尔滨银行" == bankname || "花旗中国" == bankname) {
			classname = "card-blue";
		} else if ("农业银行" == bankname || "邮政银行" == bankname || "民生银行" == bankname
				|| "南昌银行" == bankname) {
			classname = "card-green";
		} else if ("中国银行" == bankname || "北京银行" == bankname || "工商银行" == bankname
				|| "广发银行" == bankname || "广州银行" == bankname || "华夏银行" == bankname
				|| "南京银行" == bankname || "招商银行" == bankname || "中信银行" == bankname
				|| "平安银行" == bankname || "浙商银行" == bankname) {
			classname = "card-red";
		} else if ("光大银行" == bankname || "宁波银行" == bankname || "上海银行" == bankname
				|| "温州银行" == bankname || "包商银行" == bankname) {
			classname = "card-yellow";
		} else {
			classname = "card-blue";
		}
		return classname;
	}

	function isWeiXin(){
		var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			} else {
				return false;
			}
	}

	Array.prototype.indexOf = function(val) {
		for ( var i = 0; i < this.length; i++) {
			if (this[i] == val)
				return i;
		}
		return -1;
	};
	
	// 移除数组中的元素
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};
