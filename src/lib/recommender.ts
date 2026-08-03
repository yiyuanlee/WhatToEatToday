import {
  diningCategories,
  recipes,
  type DiningCategory,
  type Duration,
  type Goal,
  type Ingredient,
  type Recipe,
  type Scene,
  type StoreArea,
} from '../data/recipes'

export interface RecommendInput {
  workout: boolean
  duration: Duration
  scene: Scene
  cuisine: string
  goal: Goal
  ingredients: string[]
  preference: string
}

export interface ShoppingGroup {
  area: StoreArea
  items: Ingredient[]
}

export interface HomeRecommendation {
  kind: 'home'
  item: Recipe
  matchPercent: number
  matchedIngredients: string[]
  shoppingGroups: ShoppingGroup[]
  reason: string
}

export interface OutRecommendation {
  kind: 'out'
  item: DiningCategory
  reason: string
}

export type Recommendation = HomeRecommendation | OutRecommendation

const areaOrder: StoreArea[] = ['蔬果区', '肉蛋奶区', '主食干货区', '调味品区', '冷冻/其他']

const aliases: Record<string, string> = {
  米: '米饭',
  大米: '米饭',
  鸡肉: '鸡胸肉',
  鸡胸: '鸡胸肉',
  西红柿: '番茄',
  蛋: '鸡蛋',
  鲜虾: '虾仁',
  香菇: '蘑菇',
}

export function normalizeIngredient(value: string) {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '')
  return aliases[normalized] ?? normalized
}

function recipeMatchesInventory(recipe: Recipe, inventory: Set<string>) {
  let matchedWeight = 0
  let totalWeight = 0
  const matchedIngredients: string[] = []

  for (const ingredient of recipe.ingredients) {
    const weight = ingredient.essential ? 2 : 1
    totalWeight += weight
    const normalized = normalizeIngredient(ingredient.name)
    if (inventory.has(normalized)) {
      matchedWeight += weight
      matchedIngredients.push(ingredient.name)
    }
  }

  return {
    ratio: totalWeight === 0 ? 0 : matchedWeight / totalWeight,
    matchedIngredients,
  }
}

function filteredRecipes(input: RecommendInput) {
  return recipes.filter((recipe) => {
    if (input.duration === 'quick' && recipe.prepMinutes + recipe.cookMinutes > 25) return false
    if (input.workout && (recipe.fried || recipe.highSugar)) return false
    return true
  })
}

function recipePreferenceScore(recipe: Recipe, input: RecommendInput) {
  let score = 0
  if (input.cuisine !== '不限' && recipe.cuisine === input.cuisine) score += 18
  if (input.goal === 'light' && recipe.tags.includes('减脂')) score += 18
  if (input.goal === 'highProtein' && recipe.highProtein) score += 18
  if (input.workout && recipe.highProtein) score += 24
  return score
}

function chooseWithoutRecent<T extends { id: string }>(
  candidates: T[],
  history: string[],
  random: () => number,
) {
  const fresh = candidates.filter((candidate) => !history.includes(candidate.id))
  const pool = fresh.length > 0 ? fresh : candidates
  return pool[Math.min(Math.floor(random() * pool.length), pool.length - 1)]
}

export function buildShoppingGroups(
  recipe: Recipe,
  inventoryValues: string[],
  minimalOnly = false,
): ShoppingGroup[] {
  const inventory = new Set(inventoryValues.map(normalizeIngredient))
  const missing = recipe.ingredients.filter((ingredient) => {
    if (inventory.has(normalizeIngredient(ingredient.name))) return false
    return minimalOnly ? ingredient.essential : true
  })

  return areaOrder
    .map((area) => ({
      area,
      items: missing.filter((ingredient) => ingredient.area === area),
    }))
    .filter((group) => group.items.length > 0)
}

function recommendHome(
  input: RecommendInput,
  history: string[],
  random: () => number,
): HomeRecommendation {
  const inventory = new Set(input.ingredients.map(normalizeIngredient).filter(Boolean))
  const scarceInventory = inventory.size < 2
  const ranked = filteredRecipes(input)
    .map((recipe) => {
      const inventoryResult = recipeMatchesInventory(recipe, inventory)
      return {
        recipe,
        inventoryResult,
        score: inventoryResult.ratio * 70 + recipePreferenceScore(recipe, input),
      }
    })
    .sort((a, b) => b.score - a.score)

  const topScore = ranked[0]?.score ?? 0
  const competitive = ranked.filter((entry) => entry.score >= topScore - 16).slice(0, 4)
  const chosen = chooseWithoutRecent(
    competitive.map((entry) => ({ id: entry.recipe.id, entry })),
    history,
    random,
  ).entry
  const matchPercent = Math.round(chosen.inventoryResult.ratio * 100)
  const shoppingGroups = buildShoppingGroups(chosen.recipe, input.ingredients, scarceInventory)

  let reason = '根据你的口味与时间，今天就做这道吧。'
  if (matchPercent >= 65) {
    reason = `库存匹配度很高，优先消耗 ${chosen.inventoryResult.matchedIngredients.slice(0, 3).join('、')}。`
  } else if (scarceInventory) {
    reason = '现有食材较少，已先定下核心菜谱，只列必买主料，避免越买越多。'
  } else if (input.workout && chosen.recipe.highProtein) {
    reason = '已避开油炸与高糖，并优先安排了高蛋白搭配。'
  }

  return {
    kind: 'home',
    item: chosen.recipe,
    matchPercent,
    matchedIngredients: chosen.inventoryResult.matchedIngredients,
    shoppingGroups,
    reason,
  }
}

function recommendOut(
  input: RecommendInput,
  history: string[],
  random: () => number,
): OutRecommendation {
  const preference = input.preference.trim().toLowerCase()
  let candidates = diningCategories.filter((category) => {
    if (input.duration === 'quick' && !category.quick) return false
    if (input.workout && !category.workoutFriendly) return false
    return true
  })

  if (preference) {
    const preferred = candidates.filter(
      (category) =>
        category.name.toLowerCase().includes(preference) ||
        category.keywords.some((keyword) => keyword.toLowerCase().includes(preference)),
    )
    if (preferred.length > 0) candidates = preferred
  }

  const item = chooseWithoutRecent(candidates, history, random)
  return {
    kind: 'out',
    item,
    reason: input.workout
      ? '已过滤偏油腻品类，优先选择蛋白质更充足、容易控制搭配的一餐。'
      : '按你的用餐节奏随机抽到这个品类，打开附近平台搜一搜吧。',
  }
}

export function recommend(
  input: RecommendInput,
  history: string[] = [],
  random: () => number = Math.random,
): Recommendation {
  return input.scene === 'home'
    ? recommendHome(input, history, random)
    : recommendOut(input, history, random)
}
