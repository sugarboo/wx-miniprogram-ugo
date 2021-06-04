// index.js

// 引入request
import { request } from "../../utils/request/index.js"

Page({
  data: {
    swiperList: [], // 用于保存轮播图数据的数组, 默认值为空
    categoryList: [],  // 用于保存导航数据的数组, 默认值为空
    floorList: []  // 用于保存楼层数据的数组, 默认值为空
  },

  // 当页面开始加载, 调用自定义方法发起网络请求
  onLoad: function () {
    // 调用自定义方法, 发送异步请求, 获取数据
    this.getSwiperList()
    this.getCategoryList()
    this.getFloorList()
  },

  /**
   * 调用request发送请求, 获取轮播图数据
   */
  getSwiperList () {
    request({
      url: "/home/swiperdata"
    }).then(result => {
       // 请求响应成功, 将响应结果中的轮播图数据保存在swiperList中
      this.setData({
        swiperList: result.data.message
      })
    })
  },

  /**
   * 调用request发送请求, 获取导航分类数据
   */
  getCategoryList () {
    request({
      url: "/home/catitems"
    }).then(result => {
      // 请求响应成功, 将响应结果中的导航分类数据保存在categoryList中
      this.setData({
        categoryList: result.data.message
      })
    })
  },

  /**
   * 调用request发送请求, 获取楼层数据
   */
  getFloorList () {
    request({
      url: "/home/floordata"
    }).then(result => {
      // 请求响应成功, 将响应结果中的楼层数据保存在floorList中
      this.setData({
        floorList: result.data.message
      })
    })
  }
})
