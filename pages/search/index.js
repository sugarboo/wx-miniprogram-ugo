// pages/search/index.js
// 引入request和runtime
import {request} from "../../utils/request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [], // 存储商品搜索结果, 初始化为空数组
    inputValue: "" // 搜索输入框中的值, 默认为空字符串
  },
  debounceTime: -1, // 防抖时间, 初始化为-1

  /**
   * 发送请求获取搜索结果
  */
  async search (query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query
      }
    })
    // 请求响应成功, 将响应结果保存在data中
    const goods = res.data.message
    this.setData({
      goods
    })
  },

  /**
   * 搜索输入框值改变时的事件监听处理
   */
  handleInput (e) {
    // 获取搜索输入框中的值
    const {value} = e.detail
    // 检验输入合法性
    if (!value.trim()) { 
      // 输入的值全为空格, 输入不合法, 直接返回
      return
    }
    // 输入合法, 调用search()发送请求获取搜索结果数据
    // 请求防抖处理
    clearTimeout(this.debounceTime)
    this.debounceTime = setTimeout(() => {
      this.search(value)
    }, 500)
  },

  /**
   * 取消按钮被点击时的事件监听处理
   */

   handleCancel () {
    // 清空搜索输入框的值, 清除搜索结果数据
    this.setData({
      inputValue: "",
      goods: []
    })
   }
})