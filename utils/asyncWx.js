// 使用Promise封装wx内置方法

/**
 * Promise封装wx.getSetting()
 */
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: result => {
        resolve(result)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * Promise封装wx.chooseAddress()
 */
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: result => {
        resolve(result)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * Promise封装wx.openSetting()
 */
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: result => {
        resolve(result)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * Promise封装wx.showModal()
 */

export const showModal = (content) => {
  return new Promise((resolve, reject) =>{
    wx.showModal({
      title: '提示',
      content,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * Promise封装wx.showToast()
 */

export const showToast = (title) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon: 'error',
      mask: true,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/**
 * Promise封装wx.login()
 */
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout:10000,
      success: (res)=>{
        resolve(res)
      },
      fail: (err)=>{
        reject(err)
      }
    })
  })
}

/**
 * Promise封装wx.requestPayment()
 * @param {*} pay 必要的支付参数
 * @returns 
 */
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    })
  })
}
