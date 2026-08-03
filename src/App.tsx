import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { RecommendationCard } from './components/RecommendationCard'
import {
  cuisines,
  ingredientSuggestions,
  type Duration,
  type Goal,
  type Scene,
} from './data/recipes'
import { readHistory, rememberRecommendation } from './lib/history'
import {
  recommend,
  type RecommendInput,
  type Recommendation,
} from './lib/recommender'
import './styles.css'
import './pixel-theme.css'

const initialInput: RecommendInput = {
  workout: false,
  duration: 'quick',
  scene: 'home',
  cuisine: '不限',
  goal: 'all',
  ingredients: [],
  preference: '',
}

function App() {
  const [form, setForm] = useState<RecommendInput>(initialInput)
  const [ingredientDraft, setIngredientDraft] = useState('')
  const [result, setResult] = useState<Recommendation | null>(null)
  const [submittedInput, setSubmittedInput] = useState<RecommendInput | null>(null)

  const updateForm = <K extends keyof RecommendInput>(key: K, value: RecommendInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const addIngredient = (value = ingredientDraft) => {
    const entries = value
      .split(/[,，、]/)
      .map((entry) => entry.trim())
      .filter(Boolean)

    if (entries.length === 0) return
    setForm((current) => ({
      ...current,
      ingredients: [...new Set([...current.ingredients, ...entries])],
    }))
    setIngredientDraft('')
  }

  const removeIngredient = (ingredient: string) => {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.filter((item) => item !== ingredient),
    }))
  }

  const handleIngredientKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === '，') {
      event.preventDefault()
      addIngredient()
    }
  }

  const generateResult = (input: RecommendInput) => {
    const next = recommend(input, readHistory())
    setResult(next)
    rememberRecommendation(next.item.id)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextInput = ingredientDraft.trim()
      ? {
          ...form,
          ingredients: [
            ...new Set([
              ...form.ingredients,
              ...ingredientDraft.split(/[,，、]/).map((item) => item.trim()).filter(Boolean),
            ]),
          ],
        }
      : form

    setForm(nextInput)
    setIngredientDraft('')
    setSubmittedInput(nextInput)
    generateResult(nextInput)
  }

  const handleRefresh = () => {
    if (submittedInput) generateResult(submittedInput)
  }

  return (
    <div className="app-shell">
      <div className="sky-strip" aria-hidden="true">
        <span className="cloud cloud-one" />
        <span className="cloud cloud-two" />
        <span className="sun">☀</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="回到页面顶部">
          <span className="brand-mark" aria-hidden="true">🌱</span>
          <span>小宝想吃啥</span>
        </a>
        <p>把今天的选择困难，交给农场小厨房</p>
      </header>

      <main id="top" className="page-grid">
        <section className="planner-card">
          <div className="planner-heading">
            <p className="eyebrow">TODAY'S MENU</p>
            <h1>今天吃什么？</h1>
            <p>告诉我三个小条件，马上为你翻开今日菜单。</p>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset className="form-section">
              <legend>
                <span className="step-number">01</span>
                今天健身吗？
              </legend>
              <div className="choice-grid two-columns">
                <ChoiceButton
                  active={form.workout}
                  icon="🏋️"
                  title="是，练了！"
                  subtitle="过滤油炸高糖，优选高蛋白"
                  onClick={() => updateForm('workout', true)}
                />
                <ChoiceButton
                  active={!form.workout}
                  icon="🌿"
                  title="今天休息"
                  subtitle="轻松一点，快乐最重要"
                  onClick={() => updateForm('workout', false)}
                />
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>
                <span className="step-number">02</span>
                留给吃饭多少时间？
              </legend>
              <div className="segmented-control">
                <SegmentButton
                  active={form.duration === 'quick'}
                  onClick={() => updateForm('duration', 'quick' as Duration)}
                  icon="⚡"
                  label="快速解决"
                  detail="25 分钟内"
                />
                <SegmentButton
                  active={form.duration === 'full'}
                  onClick={() => updateForm('duration', 'full' as Duration)}
                  icon="🕰️"
                  label="时间充足"
                  detail="慢慢做好吃的"
                />
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>
                <span className="step-number">03</span>
                在哪儿吃？
              </legend>
              <div className="scene-tabs">
                <button
                  type="button"
                  className={form.scene === 'home' ? 'active' : ''}
                  onClick={() => updateForm('scene', 'home' as Scene)}
                >
                  🏡 在家下厨
                </button>
                <button
                  type="button"
                  className={form.scene === 'out' ? 'active' : ''}
                  onClick={() => updateForm('scene', 'out' as Scene)}
                >
                  🚲 外出觅食
                </button>
              </div>

              {form.scene === 'home' ? (
                <div className="home-options">
                  <div className="field-group">
                    <label>想吃哪个菜系？</label>
                    <div className="pill-row">
                      {cuisines.map((cuisine) => (
                        <button
                          key={cuisine}
                          type="button"
                          className={form.cuisine === cuisine ? 'pill active' : 'pill'}
                          onClick={() => updateForm('cuisine', cuisine)}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field-group">
                    <label>今天的饮食目标</label>
                    <div className="pill-row">
                      {[
                        ['all', '随心吃'],
                        ['light', '🥬 减脂'],
                        ['highProtein', '💪 高蛋白'],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          className={form.goal === value ? 'pill active' : 'pill'}
                          onClick={() => updateForm('goal', value as Goal)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field-group">
                    <label htmlFor="ingredients">冰箱里有什么？</label>
                    <div className="ingredient-input">
                      <input
                        id="ingredients"
                        value={ingredientDraft}
                        onChange={(event) => setIngredientDraft(event.target.value)}
                        onKeyDown={handleIngredientKeyDown}
                        placeholder="例如：鸡蛋、番茄、米饭"
                      />
                      <button type="button" onClick={() => addIngredient()}>添加</button>
                    </div>
                    {form.ingredients.length > 0 ? (
                      <div className="ingredient-chips" aria-label="已添加食材">
                        {form.ingredients.map((ingredient) => (
                          <button
                            type="button"
                            key={ingredient}
                            onClick={() => removeIngredient(ingredient)}
                            aria-label={`移除 ${ingredient}`}
                          >
                            {ingredient}<span>×</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <div className="suggestions">
                      <span>常见：</span>
                      {ingredientSuggestions.slice(0, 6).map((ingredient) => (
                        <button
                          type="button"
                          key={ingredient}
                          disabled={form.ingredients.includes(ingredient)}
                          onClick={() => addIngredient(ingredient)}
                        >
                          + {ingredient}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="outside-options">
                  <label htmlFor="preference">想吃的口味或品类（选填）</label>
                  <div className="preference-input">
                    <span aria-hidden="true">🔎</span>
                    <input
                      id="preference"
                      value={form.preference}
                      onChange={(event) => updateForm('preference', event.target.value)}
                      placeholder="例如：清淡、牛肉、汤粉、日料"
                    />
                  </div>
                  <p>我们只推荐适合搜索的品类，不读取或虚构附近商家。</p>
                </div>
              )}
            </fieldset>

            <button className="submit-button" type="submit">
              <span aria-hidden="true">🍽️</span>
              帮小宝决定
              <small>生成今日菜单</small>
            </button>
          </form>
        </section>

        <aside className={result ? 'result-column has-result' : 'result-column'}>
          {result ? (
            <RecommendationCard recommendation={result} onRefresh={handleRefresh} />
          ) : (
            <div className="empty-result">
              <div className="empty-art" aria-hidden="true">
                <span className="plate">🍽️</span>
                <span className="sprout">🌱</span>
              </div>
              <p className="eyebrow">等待开饭</p>
              <h2>菜单还是一张白纸</h2>
              <p>选好左边的条件，今天的答案就会从农场小厨房送来。</p>
              <div className="empty-dots" aria-hidden="true"><span /><span /><span /></div>
            </div>
          )}
        </aside>
      </main>

      <footer>
        <span aria-hidden="true">🌾</span>
        好好吃饭，就是今天最重要的小事
        <span aria-hidden="true">🌾</span>
      </footer>
    </div>
  )
}

interface ChoiceButtonProps {
  active: boolean
  icon: string
  title: string
  subtitle: string
  onClick: () => void
}

function ChoiceButton({ active, icon, title, subtitle, onClick }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      className={active ? 'choice-card active' : 'choice-card'}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="choice-icon" aria-hidden="true">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className="check-mark" aria-hidden="true">✓</span>
    </button>
  )
}

interface SegmentButtonProps {
  active: boolean
  icon: string
  label: string
  detail: string
  onClick: () => void
}

function SegmentButton({ active, icon, label, detail, onClick }: SegmentButtonProps) {
  return (
    <button
      type="button"
      className={active ? 'active' : ''}
      onClick={onClick}
      aria-pressed={active}
    >
      <span aria-hidden="true">{icon}</span>
      <b>{label}</b>
      <small>{detail}</small>
    </button>
  )
}

export default App
