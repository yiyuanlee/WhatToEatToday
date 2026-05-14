# 今天吃什么 · WhatToEatToday 🍱

> 一个为「吃饭选择困难症」用户打造的微信小程序，一键随机推荐美食，帮你轻松决定"今天吃什么"！

[English](./README_en.md) | 中文

---

## 🎯 功能特点

- 🎲 **一键随机推荐** — 收录 40+ 种美食，解决选择困难
- 👤 **个性化设置** — 支持头像和昵称
- 📖 **每日小贴士** — 健康饮食小知识
- 📝 **历史记录** — 记住你今天的推荐
- 🎨 **美观简洁** — 暖色调设计，温馨体验

---

## 🏗️ 项目结构

```
whattoeattoday/
├── app.json              # 小程序全局配置
├── app.js                # 小程序入口
├── app.wxss              # 全局样式
├── sitemap.json           # SEO 配置
├── project.config.json   # 微信开发者工具配置
├── images/
│   └── default-avatar.png # 默认头像（请自行添加）
└── pages/
    ├── index/            # 首页
    │   ├── index.wxml    # 页面结构
    │   ├── index.wxss    # 页面样式
    │   ├── index.js      # 页面逻辑
    │   └── index.json    # 页面配置
    └── food/             # 推荐页
        ├── food.wxml
        ├── food.wxss
        ├── food.js
        └── food.json
```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yiyuanlee/whattoeattoday.git
cd whattoeattoday
```

### 2. 安装依赖

本项目为微信小程序原生开发，无需额外安装 npm 包。

### 3. 使用微信开发者工具

1. 下载并打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 选择「导入项目」，路径选择项目根目录
3. AppID 填 `touristappid`（体验版），或填入你自己的小程序 AppID
4. 点击「确认」即可预览

### 4. 添加头像图片（可选）

在 `images/` 目录下添加 `default-avatar.png`（建议尺寸 200×200 像素）。

---

## 📖 使用说明

1. **打开小程序** → 进入首页
2. **设置昵称** → 输入你的称呼
3. **点击头像** → 可自定义头像
4. **点击开始推荐** → 获得随机美食推荐
5. **点击换一批** → 重新随机
6. **查看历史** → 回顾今天的推荐

---

## 🍜 美食数据库

目前收录美食分类：

| 分类 | 示例 |
|------|------|
| 川菜 | 宫保鸡丁、麻婆豆腐、水煮牛肉 |
| 粤菜 | 清蒸鲈鱼、白切鸡 |
| 日料 | 三文鱼刺身、鳗鱼饭、拉面 |
| 快餐 | 汉堡、披萨、麻辣烫 |
| 甜品 | 提拉米苏、芒果班戟 |
| 更多... | 火锅、烧烤、螺蛳粉... |

---

## 🔧 自定义美食数据

编辑 `pages/food/food.js`，修改 `FOODS` 数组即可添加更多美食：

```javascript
const FOODS = [
  { name: '宫保鸡丁', emoji: '🍗', category: '川菜', tags: ['辣', '下饭'], description: '...' },
  // 添加你的美食...
];
```

---

## 📦 待办功能

- [ ] 根据口味偏好推荐（辣/素/低卡等）
- [ ] 支持用户收藏喜欢的推荐
- [ ] 接入美团/大众点评 API 提供附近餐厅推荐
- [ ] 增加日历推荐，每天不同推荐菜品
- [ ] 添加营养信息展示
- [ ] 支持分享到微信群

---

## 👩‍💻 开发相关

- 框架：微信小程序原生开发
- 语言：JavaScript + WXML + WXSS
- 无需后端，纯前端实现

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

MIT © Yiyuan Lee