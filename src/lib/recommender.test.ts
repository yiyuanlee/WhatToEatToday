import { describe, expect, it } from 'vitest'
import { recipes } from '../data/recipes'
import { buildShoppingGroups, recommend, type RecommendInput } from './recommender'

const baseInput: RecommendInput = {
  workout: false,
  duration: 'quick',
  scene: 'home',
  cuisine: '不限',
  goal: 'all',
  ingredients: [],
  preference: '',
}

describe('recommend', () => {
  it('健身日过滤油炸和高糖食谱', () => {
    const result = recommend(
      { ...baseInput, workout: true, duration: 'full', cuisine: '韩式' },
      [],
      () => 0,
    )

    expect(result.kind).toBe('home')
    if (result.kind === 'home') {
      expect(result.item.fried).not.toBe(true)
      expect(result.item.highSugar).not.toBe(true)
    }
  })

  it('快速模式只返回 25 分钟内食谱', () => {
    const result = recommend(baseInput, [], () => 0.5)

    expect(result.kind).toBe('home')
    if (result.kind === 'home') {
      expect(result.item.prepMinutes + result.item.cookMinutes).toBeLessThanOrEqual(25)
    }
  })

  it('优先选择与库存高度匹配的食谱', () => {
    const result = recommend(
      {
        ...baseInput,
        ingredients: ['番茄', '鸡蛋', '米饭', '小葱', '生抽'],
      },
      [],
      () => 0,
    )

    expect(result.kind).toBe('home')
    if (result.kind === 'home') {
      expect(result.item.id).toBe('tomato-egg-rice')
      expect(result.matchPercent).toBe(100)
      expect(result.shoppingGroups).toHaveLength(0)
    }
  })

  it('食材极少时只采购核心主料', () => {
    const recipe = recipes.find((item) => item.id === 'tomato-egg-rice')
    expect(recipe).toBeDefined()

    const groups = buildShoppingGroups(recipe!, [], true)
    const names = groups.flatMap((group) => group.items.map((item) => item.name))

    expect(names).toEqual(expect.arrayContaining(['番茄', '鸡蛋', '米饭']))
    expect(names).not.toContain('小葱')
    expect(names).not.toContain('生抽')
  })

  it('近期推荐仍有候选时不会连续重复', () => {
    const first = recommend(baseInput, [], () => 0)
    const second = recommend(baseInput, [first.item.id], () => 0)

    expect(second.item.id).not.toBe(first.item.id)
  })

  it('外出健身模式只推荐运动友好品类', () => {
    const result = recommend(
      { ...baseInput, scene: 'out', workout: true, preference: '' },
      [],
      () => 0.9,
    )

    expect(result.kind).toBe('out')
    if (result.kind === 'out') {
      expect(result.item.workoutFriendly).toBe(true)
    }
  })

  it('有食材输入时结果受食材影响', () => {
    const withEggs = recommend(
      { ...baseInput, ingredients: ['鸡蛋', '面条', '番茄'] },
      [],
      () => 0,
    )
    const withShrimp = recommend(
      { ...baseInput, ingredients: ['虾仁', '米饭'] },
      [],
      () => 0,
    )

    expect(withEggs.kind).toBe('home')
    expect(withShrimp.kind).toBe('home')
    if (withEggs.kind === 'home' && withShrimp.kind === 'home') {
      expect(withEggs.item.id).not.toBe(withShrimp.item.id)
    }
  })

  it('模糊匹配别名可以正确识别食材', () => {
    const result = recommend(
      { ...baseInput, ingredients: ['西红柿', '蛋', '米'] },
      [],
      () => 0,
    )

    expect(result.kind).toBe('home')
    if (result.kind === 'home') {
      expect(result.matchedIngredients.length).toBeGreaterThan(0)
    }
  })

  it('英文食材名可以正确匹配', () => {
    const result = recommend(
      { ...baseInput, ingredients: ['tomato', 'egg', 'rice', 'scallion', 'soy sauce'] },
      [],
      () => 0,
    )

    expect(result.kind).toBe('home')
    if (result.kind === 'home') {
      expect(result.item.id).toBe('tomato-egg-rice')
      expect(result.matchPercent).toBe(100)
    }
  })
})
