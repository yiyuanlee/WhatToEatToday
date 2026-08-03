import type { Nutrition } from '../data/recipes'
import type { Recommendation } from '../lib/recommender'

interface RecommendationCardProps {
  recommendation: Recommendation
  onRefresh: () => void
}

const macroConfig = [
  { key: 'protein', label: '蛋白质', color: '#e7875d', caloriesPerGram: 4 },
  { key: 'carbs', label: '碳水', color: '#e7bd4f', caloriesPerGram: 4 },
  { key: 'fat', label: '脂肪', color: '#76a86b', caloriesPerGram: 9 },
] as const

function NutritionRing({ nutrition }: { nutrition: Nutrition }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const macroCalories = macroConfig.map(
    (macro) => nutrition[macro.key] * macro.caloriesPerGram,
  )
  const totalMacroCalories = macroCalories.reduce((total, value) => total + value, 0)
  let usedLength = 0

  return (
    <div className="nutrition-block">
      <div className="nutrition-ring">
        <svg viewBox="0 0 150 150" role="img" aria-label={`总热量 ${nutrition.calories} 千卡`}>
          <circle className="ring-track" cx="75" cy="75" r={radius} />
          {macroConfig.map((macro, index) => {
            const length = (macroCalories[index] / totalMacroCalories) * circumference
            const offset = -usedLength
            usedLength += length
            return (
              <circle
                key={macro.key}
                className="ring-segment"
                cx="75"
                cy="75"
                r={radius}
                stroke={macro.color}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={offset}
              />
            )
          })}
        </svg>
        <div className="ring-center">
          <strong>{nutrition.calories}</strong>
          <span>千卡</span>
        </div>
      </div>
      <div className="macro-list">
        {macroConfig.map((macro) => (
          <div className="macro-row" key={macro.key}>
            <span className="macro-dot" style={{ backgroundColor: macro.color }} />
            <span>{macro.label}</span>
            <strong>{nutrition[macro.key]}g</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function CookingTimeline({ prep, cook }: { prep: number; cook: number }) {
  const total = prep + cook
  return (
    <div className="timeline" aria-label={`预计总耗时 ${total} 分钟`}>
      <div className="timeline-head">
        <span>从备料到开饭</span>
        <strong>约 {total} 分钟</strong>
      </div>
      <div className="timeline-track">
        <div className="timeline-step prep-step" style={{ flexGrow: prep }}>
          <span className="timeline-icon">🔪</span>
          <div>
            <b>备料</b>
            <small>{prep} 分钟</small>
          </div>
        </div>
        <div className="timeline-arrow" aria-hidden="true">→</div>
        <div className="timeline-step cook-step" style={{ flexGrow: cook }}>
          <span className="timeline-icon">🍳</span>
          <div>
            <b>烹饪</b>
            <small>{cook} 分钟</small>
          </div>
        </div>
        <span className="finish-flag" aria-hidden="true">🚩</span>
      </div>
    </div>
  )
}

export function RecommendationCard({
  recommendation,
  onRefresh,
}: RecommendationCardProps) {
  const { item } = recommendation
  const nutrition = item.nutrition

  return (
    <article className="result-card" aria-live="polite">
      <div className="result-ribbon">今日签</div>
      <header className="result-header">
        <div className="dish-icon" aria-hidden="true">{item.emoji}</div>
        <div>
          <p className="eyebrow">{recommendation.kind === 'home' ? '今晚下厨' : '出门觅食'}</p>
          <h2>{item.name}</h2>
          <p className="dish-description">{item.description}</p>
        </div>
      </header>

      <div className="reason-note">
        <span aria-hidden="true">💡</span>
        <p>{recommendation.reason}</p>
      </div>

      <NutritionRing nutrition={nutrition} />

      {recommendation.kind === 'home' ? (
        <>
          <div className="match-panel">
            <div className="match-copy">
              <span>库存匹配度</span>
              <strong>{recommendation.matchPercent}%</strong>
            </div>
            <div
              className="match-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={recommendation.matchPercent}
            >
              <span style={{ width: `${recommendation.matchPercent}%` }} />
            </div>
            {recommendation.matchedIngredients.length > 0 ? (
              <p>家里已有：{recommendation.matchedIngredients.join('、')}</p>
            ) : (
              <p>从核心主料开始准备，购物清单已尽量精简。</p>
            )}
          </div>

          <CookingTimeline
            prep={recommendation.item.prepMinutes}
            cook={recommendation.item.cookMinutes}
          />

          <section className="shopping-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">顺路补齐</p>
                <h3>{recommendation.shoppingGroups.length > 0 ? '采购清单' : '不用买啦'}</h3>
              </div>
              <span className="basket-icon" aria-hidden="true">🧺</span>
            </div>
            {recommendation.shoppingGroups.length > 0 ? (
              <div className="shopping-groups">
                {recommendation.shoppingGroups.map((group) => (
                  <div className="shopping-group" key={group.area}>
                    <h4>{group.area}</h4>
                    <ul>
                      {group.items.map((ingredient) => (
                        <li key={ingredient.name}>
                          <span>{ingredient.name}</span>
                          <small>{ingredient.amount}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="all-set">现有食材已经足够，直接开火！</p>
            )}
          </section>
        </>
      ) : (
        <section className="outside-tip">
          <span className="map-pin" aria-hidden="true">📍</span>
          <div>
            <p className="eyebrow">附近搜索提示</p>
            <h3>{recommendation.item.orderTip}</h3>
            <p>这里只推荐餐饮品类，不会虚构或读取真实商户信息。</p>
          </div>
        </section>
      )}

      <button type="button" className="refresh-button" onClick={onRefresh}>
        <span aria-hidden="true">↻</span>
        换一个
        <small>保持当前条件</small>
      </button>
    </article>
  )
}
