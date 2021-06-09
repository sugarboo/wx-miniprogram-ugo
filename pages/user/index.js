// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 存储用户登录信息, 初始化为空
    collectionsNum : 0 // 存储用户收藏的商品数量, 初始化为0
  },

  // 用户登录按钮的点击事件处理
  handleGetUserInfo (e) {
    // 获取登录用户信息数据
    const {userInfo} = e.detail
    console.log(userInfo)
    // 将获取到的用户信息数据保存在data中
    this.setData({
      userInfo
    })
    // 将获取到的用户信息数据保存在缓存中
    wx.setStorageSync("userInfo", userInfo)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从缓存中获取用户信息以及用户收藏的商品数量信息, 保存到data中
    const userInfo = wx.getStorageSync("userInfo")
    const collectionsNum = wx.getStorageSync("collections").length
    if (userInfo) {
      this.setData({
        userInfo,
        collectionsNum
      })
    }
  }
})