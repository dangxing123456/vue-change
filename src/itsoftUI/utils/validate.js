
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}
export function validMobile(val) {
  const reg = /^1(3|4|5|7|8)\d{9}$/
  return reg.test(val)
}
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}
/****************************************自定义验证***********************************/
/**
 * 判断是否数字
 * */
export function isNumber(rule, value, callback) {
  if (value === "" || value == null) {
    value = "0"
  }
  if (parseFloat(value).toString() == "NaN") {
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}
/**
 * 邮箱验证
 * */
export function validateEmail(rule, value, callback) {
  if (value && value.length > 0) {
    if (!validEmail(value)) {
      callback(new Error('邮箱格式不正确'));
    } else {
      callback();
    }
  } else if (rule.required) {
    callback(new Error('请输入邮箱'));
  } else {
    callback();
  }
}
/**
 * 手机号码
 * */
// export function validateMobile (rule, value, callback) {
//   if (value && value.length>0) {
//     if (!validMobile(value)) {
//       callback(new Error('手机号码格式不正确'));
//     }else{
//       callback();
//     }
//   }else if (rule.required){
//     callback(new Error('请输入手机号码'));
//   }else{
//     callback();
//   }
// }
export function validateMobile(rule, value, callback) {
  // if (value && value.length > 0) {
  //   if (!validMobile(value)) {
  //     callback(new Error('手机号码格式不正确'));
  //   } else {
  //     callback();
  //   }
  // } else if (rule.required) {
  //   callback(new Error('请输入手机号码'));
  // } else {
  //   callback();
  // }
  if (value === '') {
    callback(new Error('请输入联系人电话'));
  } else {
    // let regPone = null;
    // let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
    // let tel = /^(0[0-9]{2,3})([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
    // let mobile=/^(0|[1-9]\d{5,10})$/ //小于11位
    let mobile = /^[a-zA-Z0-9-]{0,11}$/
    // if (value.charAt(0) == 0) {    // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
    //   regPone = tel;
    // } else {
    //   regPone = mobile;
    // }
    if (!mobile.test(value)) {
      return callback(
        new Error("请填写正确的联系人电话")
      );
    }
    callback();
  }
}
export function Max(rule, value, callback) {

  if (value.length > rule) {
    callback(new Error('长度不能超过' + rule))
  } else {
    callback()
  }
}
