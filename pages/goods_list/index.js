// pages/goods_list/index.js

// 引入request和runtime
import {request} from "../../utils/request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 定义tab数据
    tab: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: [], // 存储获取的商品列表数据, 初始化为空数组
  },
  totalPage: 0, // 存储获取到的商品列表数据总页数, 初始化为0

  // 接口需要的参数
  QueryParams: {
    // query: "",
    // cid: "",
    pagenum: 1,
    pagesize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   * 当页面加载时, 调用自定义事件发出网络请求, 获取数据
   */
  onLoad: function (options) {
    // this.QueryParams.cid = options.cid || ""
    // this.QueryParams.query = options.query || ""
    this.getGoodsList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 用户下拉时, 刷新商品列表数据
   */
  onPullDownRefresh: function () {
    // 清空原goodsList数据
    this.setData({
      goodsList: []
    })
    // 重置请求页码
    this.QueryParams.pagenum = 1
    // 调用getGoodsList()方法发起请求, 重新加载商品列表数据
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   * 页面上拉触底, 加载下一页商品列表数据
   */
  onReachBottom: function () {
    // 判断是否存在下一页数据
    if (this.QueryParams.pagenum >= this.totalPage) {
      // 不存在下一页数据, 提示用户
      wx.showToast({
        title: '无更多数据',
        mask: true,
      })
    } else {
      // 存在下一页数据, 调用getGoodsList()方法发请求, 获取下一页数据
      this.QueryParams.pagenum++ // 页码+1, 请求下一页的数据
      this.getGoodsList()
    }
  },

  /**
   * 发送请求获取商品列表数据
   */
  async getGoodsList () {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    })
    // 请求成功响应, 将响应结果保存在data中
    const {message} = res.data // 保存响应结果中的data.message
    const total = message.total // 保存响应结果中的商品列表数据总条数
    this.totalPage  = Math.ceil(total / this.QueryParams.pagesize) // 总页数 = 向上取整(数据总条数 / 每页数据条数)
    let goodsList = [...this.data.goodsList, ...message.goods] // 保存响应结果中的商品列表数据, es6数组拼接
    this.setData({
      goodsList
    })
    // 已成功获取响应数据, 关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * tab被点击时, 处理子组件Tab传过来的自定义事件的事件处理
   */
   handleTabChange (e) {
    // 获取被点击的tab索引
    const {index} = e.detail
    // 修改data中的tab数据
    let {tab} = this.data
    tab.forEach((v, i) => {
      if (i === index) {
        v.isActive = true
      }else {
        v.isActive = false
      }
    })
    // 将修改后的tab数据赋值到data中
    this.setData({
      tab
    })
  }
})