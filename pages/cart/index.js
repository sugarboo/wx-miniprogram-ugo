// pages/cart/index.js
// 引入Promise封装的wx.内置方法
import { getSetting, openSetting, chooseAddress, showModal, showToast } from "../../utils/asyncWx"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}, // 存储获取到的用户收货地址
    cart: [], // 存储缓存中的购物车数组数据
    allChecked: false, // 是否全选, 初始化为false
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
    const cart = wx.getStorageSync("cart") || []
    // 将获取到的用户地址数据保存在缓存中
    this.setData({
      address
    })
    // 调用setCart()处理购物车数据
    this.setCart(cart)
  },
  
  /**
   * 添加收货地址按钮的点击事件处理
   */
  async handleAddAddress () {
    try {
      // 获取权限状态
      const resGetSetting = await getSetting()
      // 获取用户地址权限状态
      const scopeAddress = resGetSetting.authSetting["scope.address"]
      if (scopeAddress === false) {
        // 用户拒绝过授予权限, 诱导用户打开授权页面
        await openSetting()
      } 
      // 用户未拒绝授予权限, 调用wx.chooseAddress()选择地址
      let address = await chooseAddress()
      // 详细地址拼接
      address.addressAll = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 将用户地址保存在缓存中
      wx.setStorageSync("address", address)
    } catch (error) {
      console.log(error)
    }
  },

  /**
   * 全选框的点击事件处理
   */
  handleItemAllChecked () {
    // 获取data中的数据
    let { cart, allChecked } = this.data
    // 全选按钮被点击时, 修改allChecked属性值, 并遍历修改购物车数据中商品的checked属性
    allChecked = !allChecked
    cart.forEach(v => {
      v.checked = allChecked
    })
    // 调用setCart(), 保存修改后的购物车数据
    this.setCart(cart)
  },


  /**
   * 商品选择框的点击事件处理
   */
  handleItemChange (e) {
    // 获取参数: 商品id
    const goodsId = e.currentTarget.dataset.id
    // 获取购物车数组中对应商品id的数据索引
    let {cart} = this.data
    const index = cart.findIndex(v => v.goods_id === goodsId)
    // 将对应商品数据的checked属性取反
    cart[index].checked = !cart[index].checked
    // 将处理后的购物车数据重新保存到data中
    this.setCart(cart)
  },

  /**
   * 设置购物车状态时, 重新处理全选, 总价格, 总数量
   */
  setCart (cart) {
    // 购物车商品全选处理
    let allChecked = true
    // 商品总价格, 总数量处理
    let totalPrice = 0
    let totalNum = 0
    // 遍历缓存中的购物车数据, 处理全选, 总价格, 总数量
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length !== 0 ? allChecked : false
    // 将处理后的数据保存在data中
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    // 将处理后的购物车数据保存在缓存中
    wx.setStorageSync("cart", cart)
  },

  /**
   * 商品数量修改的事件监听处理
   */
  async handleItemCountEdit (e) {
    // 接收事件传递的参数
    const {id, operation} = e.currentTarget.dataset
    // 获取购物车数组中对应商品id的数据索引
    let {cart} = this.data
    const index = cart.findIndex(v => v.goods_id === id)
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 当前商品数量为1且用户点击-, 弹窗提示, 询问用户是否需要删除购物车中的对应商品
      const res = await showModal("确认从购物车中删除该商品吗?")
      if (res.confirm) {
        // 用户点击确认, 从购物车数据中删除对应的商品数据
        cart.splice(index, 1)
      }
    } else {
      // 当前商品数量不为1, 直接处理对应商品的数量
      cart[index].num += operation
    }
    // 调用setCart(), 保存修改后的购物车数据
    this.setCart(cart)
  },

  /**
   * 用户点击结算的事件监听处理
   */
  async handlePay () {
    // 判断用户是否添加收货地址, 购物车中是否存在商品
    const {address, totalNum} = this.data
    if (!address.userName) {
      await showToast("未添加收货地址")
      return
    }
    if (!totalNum) {
      await showToast("未选择商品")
      return
    }
    // 通过收货地址和购物车商品校验, 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
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