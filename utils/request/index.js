/**
 * 封装网络请求模块
 */

// 同时发送的异步请求数量计数器
let ajaxCounts = 0

/**
 * 使用Promise封装请求
 */
 export const request = params => {
  
  //  定义公共url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"

  // 判断url中是否带有"/my/"请求私有路径, 若是则为header添加token
  let header = {}
  if (params.url.includes("/my/")) {
    // 为header添加token
    header.Authorization = wx.getStorageSync("token")
  }

  // 当request被调用时, 页面发送了异步请求, 异步请求计数器+1
  ajaxCounts++

  // 开启加载中
  wx.showLoading({
    title: "加载中",
    mask: true,
  })

   return new Promise((resolve, reject) => {
    wx.request({
      header,
      ...params,
      url: baseUrl + params.url,
      success: result => {
        resolve(result)
      },
      fail: err => {
        reject(err)
      },
      complete: () => {
      // 请求处理完成, 异步请求计数器-1
        ajaxCounts--
        if (ajaxCounts === 0) {
        // 异步请求计数器为0时, 所有异步请求均已完成, 关闭加载中
        wx.hideLoading()
        }
      }
    })
  })
}