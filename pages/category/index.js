// pages/category/index.js

// 引入request和runtime
import { request } from "../../utils/request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], // 存放左侧菜单数据的数组, 默认值为空
    rightContentList: [], // 存放右侧内容数据的数组, 默认值为空
    currentIndex: 0, // 当前菜单选项的索引, 默认值为0
    isScrollTop: 0 // 右侧内容滚动条距离顶部的距离, 表示是否滚动至顶部, 默认为是, 即0
  },
  categories: [], // 存放分类数据的数组, 默认值为空

  /**
   * 生命周期函数--监听页面加载
   * 当页面开始加载时, 发送网络请求, 获取数据
   */
  onLoad: function (options) {
    // 从本地缓存中获取分类数据
    const categoriesFromStorage = wx.getStorageSync('categoriesFromStorage')
    if (categoriesFromStorage) {
      // 本地缓存中已存在分类数据
      if (Date.now() - categoriesFromStorage.time > 1000 * 10) {
        // 本地缓存已过期, 重新请求数据
        this.getCategories()
      }else {
        // 本地缓存未过期, 直接使用缓存中的分类数据
        this.categories = categoriesFromStorage
        // 构造左侧菜单数据
        let leftMenuList = this.categories.map(v => v.cat_name)
        // 构造右侧内容数据
        let rightContentList = this.categories[0].children
        this.setData({
          leftMenuList,
          rightContentList
        })
      }
    } else {
      // 本地缓存中不存在分类数据, 调用自定义方法发起请求获取分类数据
      this.getCategories()
    }
  },
  
  /**
   * 发送网络请求, 获取分类数据
   */
  async getCategories () {
    const res = await request({
      url: "/categories"
    })
    // 请求成功响应, 将响应的分类数据保存在data对应的变量中
    this.categories = res.data.message
    // 把获取到的分类数据保存在本地缓存中
    wx.setStorageSync("categoriesFromStorage", {time: Date.now(), data: this.categories})
    // 构造左侧菜单数据
    let leftMenuList = this.categories.map(v => v.cat_name)
    // 构造右侧内容数据
    let rightContentList = this.categories[0].children
    this.setData({
      leftMenuList,
      rightContentList
    })
  },

  // 左侧菜单选项的点击事件监听处理
  handleMenuItemTap (e) {
    // 获取当前点击的菜单选项的索引
    const {index} = e.currentTarget.dataset
    this.setData({
      // 将获取到的索引保存至currentIndex中
      currentIndex: index,
      // 将当前索引对应的右侧内容数据保存至rightContentList中
      rightContentList: this.categories[index].children, 
      isScrollTop: 0 // 重新设置右侧内容的scroll-view标签的距离顶部的距离
    })
  }
})