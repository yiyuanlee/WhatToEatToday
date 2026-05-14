// pages/index/index.js
const app = getApp();

const TIPS = [
  '早上吃好，中午吃饱，晚上吃少~',
  '多喝水，每天8杯水目标加油！',
  '蔬菜水果不能少，营养均衡最重要',
  '工作再忙，也要记得按时吃饭哦~',
  '今天尝试一个新餐厅吧，探索未知美味！',
  '别忘了主食，粗细搭配更健康',
  '少油少盐，预防高血压从我做起',
  '吃饭细嚼慢咽，消化更好~',
  '每周至少一次鱼，补脑又健康',
  '甜食虽好，可不要贪多哦~'
];

Page({
  data: {
    avatarUrl: '',
    useEmojiAvatar: true,
    nickname: '',
    greetingText: '你好',
    dailyTip: '',
    currentTipIndex: 0
  },

  onLoad() {
    // 获取存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.avatarUrl) {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        useEmojiAvatar: false,
        nickname: userInfo.nickname || '',
        greetingText: this.getGreeting()
      });
    } else {
      this.setData({
        avatarUrl: '',
        useEmojiAvatar: true,
        greetingText: this.getGreeting()
      });
    }
    // 随机每日提示
    this.setDailyTip();
  },

  onShow() {
    this.setData({ greetingText: this.getGreeting() });
  },

  // 获取问候语
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  },

  // 设置每日提示（每天不同）
  setDailyTip() {
    const today = new Date().toDateString();
    const storedDate = wx.getStorageSync('tipDate');
    let tipIndex = wx.getStorageSync('tipIndex') || 0;

    if (storedDate !== today) {
      tipIndex = Math.floor(Math.random() * TIPS.length);
      wx.setStorageSync('tipDate', today);
      wx.setStorageSync('tipIndex', tipIndex);
    }

    this.setData({
      dailyTip: TIPS[tipIndex],
      currentTipIndex: tipIndex
    });
  },

  // 昵称输入
  onNicknameInput(e) {
    const nickname = e.detail.value;
    this.setData({ nickname });
    // 保存到本地
    const userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.nickname = nickname;
    wx.setStorageSync('userInfo', userInfo);
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ avatarUrl: tempFilePath });
        // 保存到本地
        const userInfo = wx.getStorageSync('userInfo') || {};
        userInfo.avatarUrl = tempFilePath;
        wx.setStorageSync('userInfo', userInfo);
      }
    });
  },

  // 跳转推荐页面
  goToRecommend() {
    wx.navigateTo({
      url: '/pages/food/food'
    });
  }
});