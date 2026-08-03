export type Duration = 'quick' | 'full'
export type Scene = 'home' | 'out'
export type Goal = 'all' | 'light' | 'highProtein'
export type StoreArea = '蔬果区' | '肉蛋奶区' | '主食干货区' | '调味品区' | '冷冻/其他'

export interface Ingredient {
  name: string
  amount: string
  area: StoreArea
  essential?: boolean
}

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Recipe {
  id: string
  name: string
  emoji: string
  cuisine: string
  tags: string[]
  prepMinutes: number
  cookMinutes: number
  complexity: Duration
  ingredients: Ingredient[]
  nutrition: Nutrition
  fried?: boolean
  highSugar?: boolean
  highProtein?: boolean
  description: string
}

export interface DiningCategory {
  id: string
  name: string
  emoji: string
  keywords: string[]
  quick: boolean
  workoutFriendly: boolean
  nutrition: Nutrition
  description: string
  orderTip: string
}

export const cuisines = ['不限', '中式', '日式', '韩式', '西式', '东南亚']

export const ingredientSuggestions = [
  '鸡蛋',
  '番茄',
  '鸡胸肉',
  '西兰花',
  '豆腐',
  '米饭',
  '面条',
  '牛肉',
  '虾仁',
  '蘑菇',
]

export const recipes: Recipe[] = [
  {
    id: 'tomato-egg-rice',
    name: '番茄滑蛋盖饭',
    emoji: '🍅',
    cuisine: '中式',
    tags: ['家常', '轻食'],
    prepMinutes: 8,
    cookMinutes: 12,
    complexity: 'quick',
    ingredients: [
      { name: '番茄', amount: '2 个', area: '蔬果区', essential: true },
      { name: '鸡蛋', amount: '3 个', area: '肉蛋奶区', essential: true },
      { name: '米饭', amount: '1 碗', area: '主食干货区', essential: true },
      { name: '小葱', amount: '1 根', area: '蔬果区' },
      { name: '生抽', amount: '1 勺', area: '调味品区' },
    ],
    nutrition: { calories: 518, protein: 23, carbs: 68, fat: 17 },
    description: '酸甜番茄裹住嫩滑鸡蛋，是最快消耗常备食材的一餐。',
  },
  {
    id: 'chicken-broccoli',
    name: '黑椒鸡胸西兰花',
    emoji: '🥦',
    cuisine: '中式',
    tags: ['减脂', '高蛋白'],
    prepMinutes: 10,
    cookMinutes: 15,
    complexity: 'quick',
    ingredients: [
      { name: '鸡胸肉', amount: '200g', area: '肉蛋奶区', essential: true },
      { name: '西兰花', amount: '半颗', area: '蔬果区', essential: true },
      { name: '蘑菇', amount: '100g', area: '蔬果区' },
      { name: '黑胡椒', amount: '适量', area: '调味品区' },
      { name: '生抽', amount: '1 勺', area: '调味品区' },
    ],
    nutrition: { calories: 386, protein: 52, carbs: 19, fat: 11 },
    highProtein: true,
    description: '蛋白质充足、调味干净，健身日也能吃得满足。',
  },
  {
    id: 'salmon-rice',
    name: '照烧三文鱼饭',
    emoji: '🍣',
    cuisine: '日式',
    tags: ['高蛋白', '一人食'],
    prepMinutes: 10,
    cookMinutes: 18,
    complexity: 'full',
    ingredients: [
      { name: '三文鱼', amount: '180g', area: '肉蛋奶区', essential: true },
      { name: '米饭', amount: '1 碗', area: '主食干货区', essential: true },
      { name: '西兰花', amount: '100g', area: '蔬果区' },
      { name: '生抽', amount: '1 勺', area: '调味品区' },
      { name: '蜂蜜', amount: '半勺', area: '调味品区' },
    ],
    nutrition: { calories: 612, protein: 43, carbs: 62, fat: 20 },
    highProtein: true,
    description: '焦香鱼排搭配热米饭，准备简单但仪式感满满。',
  },
  {
    id: 'tofu-mushroom',
    name: '菌菇烧豆腐',
    emoji: '🍄',
    cuisine: '中式',
    tags: ['减脂', '素食'],
    prepMinutes: 8,
    cookMinutes: 16,
    complexity: 'quick',
    ingredients: [
      { name: '豆腐', amount: '1 盒', area: '肉蛋奶区', essential: true },
      { name: '蘑菇', amount: '200g', area: '蔬果区', essential: true },
      { name: '青菜', amount: '1 把', area: '蔬果区' },
      { name: '生抽', amount: '1 勺', area: '调味品区' },
      { name: '淀粉', amount: '1 小勺', area: '主食干货区' },
    ],
    nutrition: { calories: 332, protein: 24, carbs: 28, fat: 15 },
    description: '菌菇鲜味让豆腐更下饭，清爽又有饱腹感。',
  },
  {
    id: 'beef-udon',
    name: '温泉蛋肥牛乌冬',
    emoji: '🍜',
    cuisine: '日式',
    tags: ['暖胃', '高蛋白'],
    prepMinutes: 8,
    cookMinutes: 12,
    complexity: 'quick',
    ingredients: [
      { name: '乌冬面', amount: '1 包', area: '主食干货区', essential: true },
      { name: '肥牛', amount: '150g', area: '肉蛋奶区', essential: true },
      { name: '鸡蛋', amount: '1 个', area: '肉蛋奶区' },
      { name: '洋葱', amount: '半个', area: '蔬果区' },
      { name: '生抽', amount: '1 勺', area: '调味品区' },
    ],
    nutrition: { calories: 638, protein: 36, carbs: 72, fat: 24 },
    highProtein: true,
    description: '一锅完成的暖胃主食，忙碌晚上也能快速开饭。',
  },
  {
    id: 'shrimp-avocado',
    name: '牛油果虾仁能量碗',
    emoji: '🥑',
    cuisine: '西式',
    tags: ['减脂', '高蛋白'],
    prepMinutes: 12,
    cookMinutes: 10,
    complexity: 'quick',
    ingredients: [
      { name: '虾仁', amount: '180g', area: '冷冻/其他', essential: true },
      { name: '牛油果', amount: '半个', area: '蔬果区', essential: true },
      { name: '生菜', amount: '1 把', area: '蔬果区' },
      { name: '玉米', amount: '半根', area: '蔬果区' },
      { name: '糙米', amount: '1 碗', area: '主食干货区', essential: true },
    ],
    nutrition: { calories: 492, protein: 39, carbs: 54, fat: 15 },
    highProtein: true,
    description: '颜色丰富的轻盈能量碗，口感和营养都不单调。',
  },
  {
    id: 'kimchi-tofu-soup',
    name: '泡菜豆腐锅',
    emoji: '🍲',
    cuisine: '韩式',
    tags: ['暖胃', '一锅端'],
    prepMinutes: 8,
    cookMinutes: 20,
    complexity: 'full',
    ingredients: [
      { name: '泡菜', amount: '150g', area: '冷冻/其他', essential: true },
      { name: '豆腐', amount: '1 盒', area: '肉蛋奶区', essential: true },
      { name: '五花肉', amount: '100g', area: '肉蛋奶区' },
      { name: '蘑菇', amount: '100g', area: '蔬果区' },
      { name: '鸡蛋', amount: '1 个', area: '肉蛋奶区' },
    ],
    nutrition: { calories: 474, protein: 31, carbs: 24, fat: 28 },
    description: '酸辣汤底咕嘟冒泡，适合想吃热乎饭的日子。',
  },
  {
    id: 'thai-basil-chicken',
    name: '泰式罗勒鸡肉饭',
    emoji: '🌿',
    cuisine: '东南亚',
    tags: ['高蛋白', '开胃'],
    prepMinutes: 12,
    cookMinutes: 15,
    complexity: 'full',
    ingredients: [
      { name: '鸡胸肉', amount: '200g', area: '肉蛋奶区', essential: true },
      { name: '罗勒', amount: '1 把', area: '蔬果区', essential: true },
      { name: '彩椒', amount: '半个', area: '蔬果区' },
      { name: '米饭', amount: '1 碗', area: '主食干货区', essential: true },
      { name: '鱼露', amount: '1 勺', area: '调味品区' },
    ],
    nutrition: { calories: 536, protein: 47, carbs: 65, fat: 10 },
    highProtein: true,
    description: '罗勒香气浓郁，低脂鸡肉也能非常下饭。',
  },
  {
    id: 'cream-pasta',
    name: '奶油蘑菇意面',
    emoji: '🍝',
    cuisine: '西式',
    tags: ['治愈', '奶香'],
    prepMinutes: 10,
    cookMinutes: 22,
    complexity: 'full',
    ingredients: [
      { name: '意面', amount: '100g', area: '主食干货区', essential: true },
      { name: '蘑菇', amount: '150g', area: '蔬果区', essential: true },
      { name: '淡奶油', amount: '100ml', area: '肉蛋奶区', essential: true },
      { name: '培根', amount: '80g', area: '肉蛋奶区' },
      { name: '芝士', amount: '20g', area: '肉蛋奶区' },
    ],
    nutrition: { calories: 735, protein: 24, carbs: 78, fat: 37 },
    description: '浓郁顺滑的治愈系意面，适合时间充足的放松晚餐。',
  },
  {
    id: 'fried-chicken',
    name: '韩式甜辣炸鸡',
    emoji: '🍗',
    cuisine: '韩式',
    tags: ['快乐餐', '聚会'],
    prepMinutes: 20,
    cookMinutes: 25,
    complexity: 'full',
    ingredients: [
      { name: '鸡腿肉', amount: '300g', area: '肉蛋奶区', essential: true },
      { name: '炸粉', amount: '100g', area: '主食干货区', essential: true },
      { name: '韩式辣酱', amount: '2 勺', area: '调味品区', essential: true },
      { name: '蜂蜜', amount: '1 勺', area: '调味品区' },
    ],
    nutrition: { calories: 846, protein: 42, carbs: 88, fat: 36 },
    fried: true,
    highSugar: true,
    description: '酥脆外壳裹满甜辣酱汁，留给轻松放纵的日子。',
  },
]

export const diningCategories: DiningCategory[] = [
  {
    id: 'poke',
    name: '轻食能量碗',
    emoji: '🥗',
    keywords: ['轻食', '沙拉', '减脂', '健康'],
    quick: true,
    workoutFriendly: true,
    nutrition: { calories: 480, protein: 36, carbs: 52, fat: 14 },
    description: '蔬菜、主食和蛋白质都能自由组合，适合快速解决一餐。',
    orderTip: '搜索附近轻食店，选双份蛋白、酱汁分装。',
  },
  {
    id: 'beef-rice',
    name: '日式牛肉饭',
    emoji: '🍱',
    keywords: ['日料', '米饭', '牛肉', '盖饭'],
    quick: true,
    workoutFriendly: true,
    nutrition: { calories: 610, protein: 34, carbs: 76, fat: 18 },
    description: '出餐快、份量稳定，忙碌时不容易踩雷。',
    orderTip: '搜索附近日式简餐，健身日可选少汁加温泉蛋。',
  },
  {
    id: 'pho',
    name: '越南牛肉河粉',
    emoji: '🍜',
    keywords: ['越南', '东南亚', '粉', '汤面'],
    quick: true,
    workoutFriendly: true,
    nutrition: { calories: 528, protein: 31, carbs: 70, fat: 13 },
    description: '汤底清爽、香草提味，想吃热汤又不想太负担。',
    orderTip: '搜索附近越南菜，选择瘦牛肉并多加豆芽。',
  },
  {
    id: 'hotpot',
    name: '小火锅',
    emoji: '♨️',
    keywords: ['火锅', '麻辣', '聚餐', '暖胃'],
    quick: false,
    workoutFriendly: true,
    nutrition: { calories: 720, protein: 45, carbs: 58, fat: 34 },
    description: '时间充足时慢慢涮，食材选择权完全在自己手里。',
    orderTip: '搜索附近小火锅，选清汤、瘦肉、豆制品和蔬菜。',
  },
  {
    id: 'yunnan',
    name: '云南菌菇米线',
    emoji: '🍄',
    keywords: ['云南', '米线', '菌菇', '汤粉'],
    quick: true,
    workoutFriendly: false,
    nutrition: { calories: 596, protein: 23, carbs: 88, fat: 17 },
    description: '鲜香汤粉带来满足感，适合不知道吃什么的雨天。',
    orderTip: '搜索附近云南米线，可加鸡肉或豆腐补充蛋白质。',
  },
  {
    id: 'korean-bbq',
    name: '韩式烤肉',
    emoji: '🥩',
    keywords: ['韩餐', '烤肉', '聚餐', '肉'],
    quick: false,
    workoutFriendly: false,
    nutrition: { calories: 880, protein: 48, carbs: 55, fat: 51 },
    description: '适合慢慢吃的快乐聚餐，搭配生菜更清爽。',
    orderTip: '搜索附近韩式烤肉，优先瘦肉并控制蘸料。',
  },
]
