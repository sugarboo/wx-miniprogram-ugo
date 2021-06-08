// pages/cart/index.js
import {request} from "../../utils/request/index"
import regeneratorRunTime from "../../lib/runtime/runtime"
// 引入Promise封装的wx.内置方法
import { requestPayment, showToast } from "../../utils/asyncWx"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}, // 存储获取到的用户收货地址
    cart: [], // 存储缓存中的购物车数组数据
    totalPrice: 0, // 存储购物车中商品总价格, 初始化为0
    totalNum: 0 // 存储购物车中商品总数量, 初始化为0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时, 获取缓存中的用户地址数据
    const address = wx.getStorageSync("address")
    // 页面显示时, 获取缓存中的购物车数组数据
    let cart = wx.getStorageSync("cart") || []
    // 过滤购物车数组, 只保留被选中的商品数据
    cart = cart.filter(v => v.checked)
    // 将获取到的用户地址数据保存在缓存中
    this.setData({
      address
    })
    // 调用setCart()处理购物车数据
    this.setCart(cart)
  },

  /**
   * 设置购物车状态时, 重新处理全选, 总价格, 总数量
   */
  setCart (cart) {
    // 商品总价格, 总数量处理
    let totalPrice = 0
    let totalNum = 0
    // 遍历缓存中的购物车数据, 处理全选, 总价格, 总数量
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    // 将处理后的数据保存在data中
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
  },

  /**
   * 用户点击支付的事件监听处理
   */
  async handleOrderPay () {
    try {
      // 准备请求体参数
      const order_price = this.data.totalPrice // 商品总价格
      const consignee_addr = this.data.address.addressAll // 用户收货地址
      const cart = this.data.cart
      let goods = []
      cart.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      // 发送请求, 创建订单, 获取订单编号
      const resCreateOrder = await request({
        url: "/my/orders/create",
        method: "POST",
        // header,
        data: {
          order_price,
          consignee_addr,
          goods
        }
      })
      // 请求成功响应, 从响应数据中获取新创建的订单编号
      const orderNumber = resCreateOrder.data.message.order_number
      // console.log(orderNumber)
      // 发送请求, 获取支付参数
      const resPay = await request({
        url: "/my/orders/req_unifiedorder",
        method: "POST",
        // header,
        data: {
          order_number: orderNumber
        }
      })
      // 请求成功响应, 从响应结果中获取支付参数
      const {pay} = resPay.data.message
      // 调用requestPayment方法处理预支付
      await requestPayment(pay)
      // 预支付成功, 查询后台订单状态
      const res = await request({
        url: "/my/orders/chkOrder",
        method: "POST",
        // header,
        data: {
          order_number: orderNumber
        }
      })
      // 支付成功, 手动删除缓存的购物车数据中已经支付的商品
      let newCart = wx.getStorageSync("cart")
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync("cart", newCart)
      // 支付成功, 提示用户
      await showToast("支付成功")
    } catch (error) {
      console.log(error)
      // 支付失败, 提示用户
      await showToast("支付失败")
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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