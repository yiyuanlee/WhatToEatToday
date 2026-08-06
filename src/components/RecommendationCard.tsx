import type { Nutrition } from '../data/recipes'
import { useLocale } from '../i18n/LocaleContext'
import type { ReasonCode, Recommendation } from '../lib/recommender'

interface RecommendationCardProps {
  recommendation: Recommendation
  onRefresh: () => void
}

const macroKeys = [
  { key: 'protein', color: '#e7875d', caloriesPerGram: 4 },
  { key: 'carbs', color: '#e7bd4f', caloriesPerGram: 4 },
  { key: 'fat', color: '#76a86b', caloriesPerGram: 9 },
] as const

function NutritionRing({ nutrition }: { nutrition: Nutrition }) {
  const { t } = useLocale()
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const macroCalories = macroKeys.map(
    (macro) => nutrition[macro.key] * macro.caloriesPerGram,
  )
  const totalMacroCalories = macroCalories.reduce((total, value) => total + value, 0)
  let usedLength = 0
  const labels = {
    protein: t.protein,
    carbs: t.carbs,
    fat: t.fat,
  }

  return (
    <div className="nutrition-block">
      <div className="nutrition-ring">
        <svg viewBox="0 0 150 150" role="img" aria-label={`${nutrition.calories} ${t.calories}`}>
          <circle className="ring-track" cx="75" cy="75" r={radius} />
          {macroKeys.map((macro, index) => {
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
          <span>{t.calories}</span>
        </div>
      </div>
      <div className="macro-list">
        {macroKeys.map((macro) => (
          <div className="macro-row" key={macro.key}>
            <span className="macro-dot" style={{ backgroundColor: macro.color }} />
            <span>{labels[macro.key]}</span>
            <strong>{nutrition[macro.key]}g</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function CookingTimeline({ prep, cook }: { prep: number; cook: number }) {
  const { t } = useLocale()
  const total = prep + cook
  return (
    <div className="timeline" aria-label={t.timelineTotal(total)}>
      <div className="timeline-head">
        <span>{t.timelineLabel}</span>
        <strong>{t.timelineTotal(total)}</strong>
      </div>
      <div className="timeline-track">
        <div className="timeline-step prep-step" style={{ flexGrow: prep }}>
          <span className="timeline-icon">🔪</span>
          <div>
            <b>{t.prep}</b>
            <small>{t.minutes(prep)}</small>
          </div>
        </div>
        <div className="timeline-arrow" aria-hidden="true">→</div>
        <div className="timeline-step cook-step" style={{ flexGrow: cook }}>
          <span className="timeline-icon">🍳</span>
          <div>
            <b>{t.cook}</b>
            <small>{t.minutes(cook)}</small>
          </div>
        </div>
        <span className="finish-flag" aria-hidden="true">🚩</span>
      </div>
    </div>
  )
}

function formatReason(
  code: ReasonCode,
  items: string[],
  t: ReturnType<typeof useLocale>['t'],
  joinList: (items: string[]) => string,
  labelIngredient: (name: string) => string,
) {
  const labeled = joinList(items.map(labelIngredient))
  switch (code) {
    case 'highMatch':
      return t.reasonHighMatch(labeled)
    case 'partialMatch':
      return t.reasonPartialMatch(labeled)
    case 'scarce':
      return t.reasonScarce
    case 'workout':
      return t.reasonWorkout
    case 'outWorkout':
      return t.reasonOutWorkout
    case 'outDefault':
      return t.reasonOutDefault
    default:
      return t.reasonDefault
  }
}

export function RecommendationCard({
  recommendation,
  onRefresh,
}: RecommendationCardProps) {
  const {
    t,
    labelIngredient,
    labelArea,
    labelAmount,
    recipeName,
    recipeDescription,
    diningName,
    diningDescription,
    diningTip,
    joinList,
  } = useLocale()
  const { item } = recommendation
  const nutrition = item.nutrition
  const title =
    recommendation.kind === 'home'
      ? recipeName(item.id, item.name)
      : diningName(item.id, item.name)
  const description =
    recommendation.kind === 'home'
      ? recipeDescription(item.id, item.description)
      : diningDescription(item.id, item.description)
  const reason = formatReason(
    recommendation.reasonCode,
    recommendation.reasonItems,
    t,
    joinList,
    labelIngredient,
  )

  return (
    <article className="result-card" aria-live="polite">
      <div className="result-ribbon">{t.ribbon}</div>
      <header className="result-header">
        <div className="dish-icon" aria-hidden="true">{item.emoji}</div>
        <div>
          <p className="eyebrow">
            {recommendation.kind === 'home' ? t.homeEyebrow : t.outEyebrow}
          </p>
          <h2>{title}</h2>
          <p className="dish-description">{description}</p>
        </div>
      </header>

      <div className="reason-note">
        <span aria-hidden="true">💡</span>
        <p>{reason}</p>
      </div>

      <NutritionRing nutrition={nutrition} />

      {recommendation.kind === 'home' ? (
        <>
          <div className="match-panel">
            <div className="match-copy">
              <span>{t.matchLabel}</span>
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
              <p>
                {t.matchedHave(
                  joinList(recommendation.matchedIngredients.map(labelIngredient)),
                )}
              </p>
            ) : (
              <p>{t.matchedNone}</p>
            )}
          </div>

          <CookingTimeline
            prep={recommendation.item.prepMinutes}
            cook={recommendation.item.cookMinutes}
          />

          <section className="shopping-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.shoppingEyebrow}</p>
                <h3>
                  {recommendation.shoppingGroups.length > 0
                    ? t.shoppingTitle
                    : t.shoppingDone}
                </h3>
              </div>
              <span className="basket-icon" aria-hidden="true">🧺</span>
            </div>
            {recommendation.shoppingGroups.length > 0 ? (
              <div className="shopping-groups">
                {recommendation.shoppingGroups.map((group) => (
                  <div className="shopping-group" key={group.area}>
                    <h4>{labelArea(group.area)}</h4>
                    <ul>
                      {group.items.map((ingredient) => (
                        <li key={ingredient.name}>
                          <span>{labelIngredient(ingredient.name)}</span>
                          <small>{labelAmount(ingredient.amount)}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="all-set">{t.allSet}</p>
            )}
          </section>
        </>
      ) : (
        <section className="outside-tip">
          <span className="map-pin" aria-hidden="true">📍</span>
          <div>
            <p className="eyebrow">{t.outTipEyebrow}</p>
            <h3>{diningTip(item.id, recommendation.item.orderTip)}</h3>
            <p>{t.outTipNote}</p>
          </div>
        </section>
      )}

      <button type="button" className="refresh-button" onClick={onRefresh}>
        <span aria-hidden="true">↻</span>
        {t.refresh}
        <small>{t.refreshSub}</small>
      </button>
    </article>
  )
}
