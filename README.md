# 小宝想吃啥

帮你快速决定今天吃什么的像素风网页。根据是否健身、用餐时长、在家 / 外出等条件，结合冰箱库存推荐菜谱或外出品类，并给出营养信息与采购清单。

在线体验：[https://xiaobao-what-to-eat.vercel.app](https://xiaobao-what-to-eat.vercel.app)

## 功能

- **健身模式**：自动过滤油炸 / 高糖，优先高蛋白
- **用餐时长**：快速（约 25 分钟内）或时间充足
- **场景分流**
  - 在家：选菜系、减脂 / 高蛋白标签，录入现有食材
  - 外出：按偏好随机推荐餐饮品类（不虚构真实商户）
- **库存匹配**：高匹配突出「消耗库存」；低匹配生成按超市分区排序的缺料清单
- **食材极少**：先定核心菜谱，只列必买主料，避免冗余购买
- **结果展示**：菜名、卡路里与三大营养素环形图、备料 + 烹饪时间轴
- **换一个**：同条件刷新推荐，并用本地历史避免连续重复
- **像素 UI**：星露谷风格原创像素主题 + 简体中文像素字体

## 技术栈

- React 19 + TypeScript
- Vite 8
- Vitest（推荐逻辑单测）
- Fusion Pixel 12px（`@fontsource`）
- 部署：Vercel

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址即可。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查并生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run test` | 运行推荐逻辑测试 |
| `npm run lint` | Oxlint 代码检查 |

## 项目结构

```text
src/
  App.tsx                 # 条件输入与主流程
  components/
    RecommendationCard.tsx # 推荐结果、营养环、时间轴、采购清单
  data/
    recipes.ts            # 本地食谱与外出品类数据
  lib/
    recommender.ts        # 过滤、评分、采购清单、防重复
    history.ts            # localStorage 推荐历史
    recommender.test.ts   # 核心逻辑测试
  styles.css              # 基础布局样式
  pixel-theme.css         # 像素农场主题覆盖样式
```

## 推荐逻辑简述

1. 按健身、时长做硬过滤
2. 结合菜系 / 目标 / 库存覆盖率打分
3. 高匹配优先消耗现有食材；食材少时只采购核心主料
4. 「换一个」读取本地历史，优先排除近期结果

## License

仅供个人学习与演示使用。界面为原创像素农场风格，未使用任何游戏官方素材。
