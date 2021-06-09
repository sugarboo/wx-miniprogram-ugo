// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 为tab组件提供的数据
    tab: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false
      },
    ],
    collections: [] // 存储从缓存中获取到的收藏商品数据
  },


  /**
   * tab组件不同标签被点击时的事件监听处理
   */
  handleTabTap (e) {
    // 获取被点击的tab索引
    const {index} = e.detail
    // 修改data中的tab数据
    let {tab} = this.data
    tab.forEach(v => {
      if (v.id === index) {
        v.isActive = true
      } else {
        v.isActive = false
      }
    })
    // 将修改后的tab数据存储到data中
    this.setData({
      tab
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从缓存中获取收藏商品数据
    const collections = wx.getStorageSync("collections")
    // 将获取到的数据保存至data中
    this.setData({
      collections
    })
  }
})