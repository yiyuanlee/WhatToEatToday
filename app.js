// app.js
App({
  globalData: {
    userInfo: null,
    nickname: '',
    avatarUrl: '/images/default-avatar.png'
  },

  onLaunch() {
    // 检查本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.nickname = userInfo.nickname || '';
      this.globalData.avatarUrl = userInfo.avatarUrl || '/images/default-avatar.png';
    }
  }
})