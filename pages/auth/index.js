// pages/auth/index.js
// 引入
import {request} from "../../utils/request/index"
import regeneratorRunTime from "../../lib/runtime/runtime"
import {login} from "../../utils/asyncWx"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 用户授权按钮的点击事件监听
   */
  async handleGetUserInfo (e) {
    try {
      // 用户授权后, 获取相关参数
      const {encryptedData, rawData, iv, signature} = e.detail
      // 调用login()获取用户登录的code
      const {code} = await login()
      // 发送请求, 获取用户token
      let {token} = await request({
        url: "/users/wxlogin",
        method: "POST",
        data: {
          encryptedData,
          rawData, 
          iv, 
          signature,
          code
        }
      })
      // 把token保存在缓存中, 同时跳转回上一个页面
      if (token === undefined) {
        // !!!token接口失效, 使用测试token
        token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      }
      wx.setStorageSync("token", token)
      wx.navigateBack({
        delta: 1
      })
      console.log(token)
    } catch (error) {
      console.log(error)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})