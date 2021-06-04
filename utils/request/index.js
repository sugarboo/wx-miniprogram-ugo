/**
 * 封装网络请求模块
 */

/**
 * 使用Promise封装请求
 */
 export const request = (params) => {
  
  //  定义公共url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"

   return new Promise((resolve, reject) => {
     wx.request({
       ...params,
       url: baseUrl + params.url,
       success: (result) => {
         resolve(result)
       },
       fail: (err) => {
         reject(err)
       }
     })
   })
 }