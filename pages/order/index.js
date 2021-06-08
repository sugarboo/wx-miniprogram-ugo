// pages/order/index.js

// 引入request和runtime
import {request} from "../../utils/request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 标签数据
    tab: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 1,
        value: "退款/退货",
        isActive: false
      },
    ],
    orders: [] // 存储获取到的订单数据, 初始化为空
  },

  /**
   * 标签改变时的事件监听处理
   */
  handleTapChange (e) {
    // 获取被点击的tab索引
    const {index} = e.detail
    // 调用changeTitleByIndex()修改tab数据
    this.changeTitleByIndex(index)
  },

  /**
   * 根据当前选中的tab索引修改tab的title
   */
  changeTitleByIndex (index) {
    // 修改data中的tab数据
    let {tab} = this.data
    tab.forEach((v, i) => {
      if (i === index) {
        v.isActive = true
      } else {
        v.isActive = false
      }
    })
    // 将修改后的tab数据保存到data中
    this.setData({
      tab
    })
    // 根据索引计算type值, 调用getOrders()发送请求, 获取对应的订单数据
    this.getOrders(index + 1)
  },

  /**
   * 发送请求获取订单数据
   */
  async getOrders (type) {
    const res = await request({
      url: "/my/orders/all",
      data: {
        type
      }
    })
    // 请求成功响应, 从响应结果中获取对应的订单数据
    const orders = res.data.message.orders
    orders.forEach(v => {
      v.formattedTime = (new Date(v.create_time * 1000)).toLocaleString()
    })
    this.setData({
      orders
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时, 判断缓存中是否存在token, 若不存在则跳转至授权页面
    const token = wx.getStorageSync("token")
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }

    // 获取当前小程序的页面栈
    let curPages =  getCurrentPages()
    // 获取上一个页面url中的type参数
    let prevPage = curPages[curPages.length - 1]
    const {type} = prevPage.options
    // 激活tab标题并获取对应的订单数据
    this.changeTitleByIndex(type -1)
    this.getOrders(type)
  }
})