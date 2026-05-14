// pages/food/food.js

const FOODS = [
  // 中餐
  { name: '宫保鸡丁', emoji: '🍗', category: '川菜', tags: ['辣', '下饭', '经典'], description: '麻辣鲜香，鸡肉嫩滑，花生酥脆，一道永远不会踩雷的经典川菜！' },
  { name: '红烧肉', emoji: '🥩', category: '家常菜', tags: ['下饭', '下酒', '下饭神器'], description: '软糯入味，肥而不腻，一口下去满满的幸福感！' },
  { name: '糖醋里脊', emoji: '🍖', category: '鲁菜', tags: ['酸甜', '酥脆', '开胃'], description: '外酥里嫩，酸甜可口，大人小孩都爱吃！' },
  { name: '麻婆豆腐', emoji: '🧈', category: '川菜', tags: ['辣', '下饭', '素食'], description: '麻辣鲜香，豆腐嫩滑，配上一碗白米饭简直绝了！' },
  { name: '鱼香肉丝', emoji: '🥕', category: '川菜', tags: ['酸甜', '下饭', '经典'], description: '酸甜微辣，肉丝嫩滑，配料丰富，绝对的下饭神器！' },
  { name: '水煮牛肉', emoji: '🐄', category: '川菜', tags: ['辣', '麻', '过瘾'], description: '牛肉嫩滑，麻辣鲜香，配菜丰富，吃一口就停不下来！' },
  { name: '清蒸鲈鱼', emoji: '🐟', category: '粤菜', tags: ['清淡', '健康', '鲜美'], description: '鱼肉鲜嫩，清淡不腻，保留鱼的原汁原味！' },
  { name: '回锅肉', emoji: '🥬', category: '川菜', tags: ['香', '下饭', '经典'], description: '肥而不腻，咸香四溢，川菜馆的必点菜！' },
  { name: '酸辣土豆丝', emoji: '🥔', category: '家常菜', tags: ['酸辣', '开胃', '素食'], description: '爽脆开胃，酸辣可口，简单却让人回味无穷！' },
  { name: '地三鲜', emoji: '🍆', category: '东北菜', tags: ['下饭', '素食', '实惠'], description: '茄子、土豆、青椒的完美组合，超级下饭！' },
  { name: '京酱肉丝', emoji: '🫓', category: '京菜', tags: ['甜面酱', '卷饼', '特色'], description: '肉丝嫩滑，甜面酱香，用豆皮一卷，绝了！' },
  { name: '干煸四季豆', emoji: '🫛', category: '川菜', tags: ['香', '辣', '下饭'], description: '四季豆干香入味，配上肉末，简单却美味！' },

  // 日料
  { name: '三文鱼刺身', emoji: '🍣', category: '日料', tags: ['刺身', '新鲜', '清淡'], description: '新鲜三文鱼，入口即化，搭配芥末和酱油美味极了！' },
  { name: '鳗鱼饭', emoji: '🍱', category: '日料', tags: ['烤鳗鱼', '酱汁', '鲜甜'], description: '蒲烧鳗鱼酱香浓郁，配上白米饭让人欲罢不能！' },
  { name: '拉面', emoji: '🍜', category: '日料', tags: ['汤底浓郁', '配料丰富', '暖身'], description: '浓郁猪骨汤底，配上叉烧和溏心蛋，一碗满足！' },
  { name: '天妇罗', emoji: '🍤', category: '日料', tags: ['炸物', '酥脆', '清淡'], description: '外酥里嫩，蘸上天妇罗酱汁，美味无法挡！' },
  { name: '寿司拼盘', emoji: '🍣', category: '日料', tags: ['多样', '精致', '新鲜'], description: '多种寿司组合，满足你对日本料理的所有幻想！' },

  // 快餐
  { name: '汉堡套餐', emoji: '🍔', category: '快餐', tags: ['快捷', '管饱', '汉堡'], description: '经典汉堡配薯条和可乐，快速解决饥饿！' },
  { name: '披萨', emoji: '🍕', category: '西餐', tags: ['芝士', '多样', '分享'], description: '香浓芝士配各种配料，一家人分享刚刚好！' },
  { name: '炸鸡', emoji: '🍗', category: '快餐', tags: ['酥脆', '香嫩', '过瘾'], description: '外酥里嫩的炸鸡，一口咬下去满嘴幸福！' },
  { name: '意面', emoji: '🍝', category: '西餐', tags: ['番茄', '芝士', '经典'], description: '番茄肉酱意面，酸甜可口，大人小孩都爱！' },
  { name: '烤肉拌饭', emoji: '🥩', category: '快餐', tags: ['快捷', '实惠', '管饱'], description: '香喷喷的烤肉配上米饭和蔬菜，营养又美味！' },
  { name: '麻辣烫', emoji: '🍢', category: '川渝小吃', tags: ['麻辣', '多样', '自选'], description: '各种食材串串，麻辣汤底，想吃什么自己选！' },
  { name: '煎饼果子', emoji: '🥞', category: '中式早餐', tags: ['酥脆', '实惠', '早餐'], description: '薄脆加油条，配上甜面酱，北京人的早餐记忆！' },
  { name: '螺蛳粉', emoji: '🍜', category: '广西小吃', tags: ['酸笋', '辣', '特色'], description: '酸酸辣辣的螺蛳粉，闻着臭吃着香，上头！' },
  { name: '黄焖鸡米饭', emoji: '🍗', category: '快餐', tags: ['焖', '入味', '管饱'], description: '鸡肉嫩滑，汤汁浓郁，配上白米饭绝配！' },
  { name: '酸菜鱼', emoji: '🐟', category: '川菜', tags: ['酸辣', '鱼片', '开胃'], description: '酸菜打底，鱼片嫩滑，酸辣开胃停不下来！' },
  { name: '火锅', emoji: '🍲', category: '川渝', tags: ['聚餐', '丰富', '热闹'], description: '各种食材涮一涮，热气腾腾，和朋友一起最热闹！' },
  { name: '烧烤', emoji: '🍢', category: '宵夜', tags: ['烤', '香', '聚会'], description: '孜然飘香，肉质鲜嫩，宵夜撸串的快乐！' },
  { name: '炒饭', emoji: '🍚', category: '家常菜', tags: ['简单', '管饱', '剩饭'], description: '蛋炒饭、扬州炒饭...简单却美味的光盘神器！' },
  { name: '沙县小吃', emoji: '🥟', category: '福建小吃', tags: ['实惠', '多样', '快捷'], description: '蒸饺、拌面、馄饨...实惠又好吃的工作餐！' },

  // 甜品
  { name: '提拉米苏', emoji: '🍰', category: '甜品', tags: ['咖啡', '芝士', '细腻'], description: '层次分明，甜而不腻，咖啡香与芝士的完美融合！' },
  { name: '芒果班戟', emoji: '🥭', category: '甜品', tags: ['水果', '奶油', '港式'], description: '软糯外皮包着芒果和奶油，港式甜品的经典！' },
  { name: '珍珠奶茶', emoji: '🧋', category: '饮品', tags: ['奶茶', '珍珠', '网红'], description: '香浓奶茶配上Q弹珍珠，喝一口就上头！' },
  { name: '杨枝甘露', emoji: '🥭', category: '甜品', tags: ['芒果', '西柚', '清爽'], description: '芒果西柚椰汁西米，清爽解暑的港式甜品！' },
  { name: '芝士蛋糕', emoji: '🍰', category: '甜品', tags: ['芝士', '浓郁', '细腻'], description: '浓郁芝士味，口感细腻，甜品控的最爱！' },
  { name: '冰淇淋', emoji: '🍨', category: '甜品', tags: ['冰凉', '甜蜜', '夏日'], description: '炎炎夏日，一球冰淇淋就能让你瞬间开心！' },
];

Page({
  data: {
    currentFood: null,
    isSpinning: false,
    showResult: false,
    history: []
  },

  onLoad() {
    this.spin();
    // 加载历史记录
    const history = wx.getStorageSync('foodHistory') || [];
    this.setData({ history: history.slice(-10) });
  },

  spin() {
    if (this.data.isSpinning) return;

    this.setData({ isSpinning: true, showResult: false });

    // 随机选择
    const randomFood = FOODS[Math.floor(Math.random() * FOODS.length)];
    
    setTimeout(() => {
      this.setData({
        currentFood: randomFood,
        isSpinning: false,
        showResult: true
      });
      // 保存到历史记录
      this.addToHistory(randomFood);
    }, 800);
  },

  addToHistory(food) {
    let history = this.data.history;
    // 去重：如果今天已经有这个食物就不重复添加
    const todayFoods = history.filter(h => h.name === food.name);
    if (todayFoods.length === 0) {
      history.unshift(food);
      if (history.length > 10) history.pop();
      this.setData({ history });
      wx.setStorageSync('foodHistory', history);
    }
  },

  goBack() {
    wx.navigateBack();
  }
});