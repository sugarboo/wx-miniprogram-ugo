/**
 * 封装网络请求模块
 */

// 同时发送的异步请求数量
let ajaxCounts = 0

/**
 * 使用Promise封装请求
 */
 export const request = (params) => {
  
  //  定义公共url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"

  // 当request被调用时, 页面发送了异步请求
  ajaxCounts++

  // 开启加载中
  wx.showLoading({
    title: "加载中",
    mask: true,
  })

   return new Promise((resolve, reject) => {
     wx.request({
       ...params,
       url: baseUrl + params.url,
       success: result => {
         resolve(result)
       },
       fail: err => {
         reject(err)
       },
       complete: () => {
        ajaxCounts--
        if (ajaxCounts == 0) {
          // 关闭加载中
          wx.hideLoading()
        }
       }
     })
   })
 }