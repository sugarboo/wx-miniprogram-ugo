// pages/goods_detail/index.js

// 引入request和runtime
import { request } from "../../utils/request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
import { showToast } from "../../utils/asyncWx"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {} // 存储查询到的商品详情的对象, 初始化为空
  },
  goodsInfo: {}, // 保存当前商品对象

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从url中获取商品id
    const {goods_id} = options
    // 调用自定义函数, 发送请求, 获取商品数据
    this.getGoodsDetail(goods_id)
  },

  /**
   * 发送网络请求, 获取对应商品id的商品详情数据
   * @param {*} goods_id 商品id
   */
  async getGoodsDetail (goods_id) {
    const res = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    })
    // 请求成功响应, 将响应结果保存在goodsObj中
    const goodsObj = res.data.message
    this.goodsInfo = goodsObj
    // 获取缓存中的商品收藏数组
    let collections = wx.getStorageSync("collections") || []
    // 判断当前商品是否被收藏
    let isCollect = collections.some(v => v.goods_id === this.goodsInfo.goods_id)
    // 将数据保存在data中
    this.setData({
      goodsObj,
      isCollect
    })
  },

  /**
   * 点击轮播图, 放大预览商品图片
   */
  handlePreviewImage (e) {
    // 构造要预览的图片url数组
    const urls = this.goodsInfo.pics.map(v => v.pics_mid)
    // 获取传过来的图片url
    const currentUrl = e.currentTarget.dataset.url
    wx.previewImage({
      currentUrl,
      urls
    })
  },

  /**
   * 加入购物车
   */
  handleAddInCart () {
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || []
    // 判断当前商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      // 购物车中不存在当前商品, 添加购物车
      this.goodsInfo.num = 1
      this.goodsInfo.checked = true
      // 将当前商品信息保存在购物车数组中
      cart.push(this.goodsInfo)
    } else {
      // 购物车中已存在当前商品, 数量+1
      cart[index].num++
    }
    // 将修改后的购物车数组保存在缓存中
    wx.setStorageSync("cart", cart)
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true,
    })
  },

  /**
   * 点击收藏按钮的监听事件处理
   */
   handleCollect () {
    let isCollect = false
    //  判断当前商品是否存在于缓存中的collections数组中
    let collections = wx.getStorageSync("collections") || []
    const index = collections.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      // 当前商品不存在collections中, 把商品添加到collections中, 存入缓存
      collections.push(this.goodsInfo)
      wx.setStorageSync("collections", collections)
      // 修改当前商品data中的isCollect并保存
      isCollect = true
      this.setData({
        isCollect
      })
      // 调用showToast()提示用户
      showToast("收藏成功", "success")
    } else {
      // 当前商品在collections中已存在, 把该商品从collections中删除, 将修改后的collections存入缓存
      collections.splice(index, 1)
      wx.setStorageSync("collections", collections)
      // 修改当前商品data中的isCollect并保存
      isCollect = false
      this.setData({
        isCollect
      })
      // 调用showToast()提示用户
      showToast("已取消收藏", "success")
    }
   }
})