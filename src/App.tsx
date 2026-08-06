import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { RecommendationCard } from './components/RecommendationCard'
import {
  cuisines,
  ingredientSuggestions,
  type Duration,
  type Goal,
  type Scene,
} from './data/recipes'
import { useLocale } from './i18n/LocaleContext'
import { readHistory, rememberRecommendation } from './lib/history'
import {
  normalizeIngredient,
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
  const {
    locale,
    setLocale,
    t,
    labelIngredient,
    labelCuisine,
  } = useLocale()
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
      .map((entry) => normalizeIngredient(entry.trim()))
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
    const draftEntries = ingredientDraft
      .split(/[,，、]/)
      .map((item) => normalizeIngredient(item.trim()))
      .filter(Boolean)
    const nextInput = draftEntries.length
      ? {
          ...form,
          ingredients: [...new Set([...form.ingredients, ...draftEntries])],
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
        <a className="brand" href="#top" aria-label={t.brandAria}>
          <span className="brand-mark" aria-hidden="true">🌱</span>
          <span>{t.brand}</span>
        </a>
        <div className="header-tools">
          <p className="header-tagline">{t.tagline}</p>
          <div className="lang-switch" role="group" aria-label={t.langAria}>
            <button
              type="button"
              className={locale === 'zh' ? 'active' : ''}
              onClick={() => setLocale('zh')}
              aria-pressed={locale === 'zh'}
            >
              {t.langZh}
            </button>
            <button
              type="button"
              className={locale === 'en' ? 'active' : ''}
              onClick={() => setLocale('en')}
              aria-pressed={locale === 'en'}
            >
              {t.langEn}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="page-grid">
        <section className="planner-card">
          <div className="planner-heading">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.heading}</h1>
            <p>{t.subheading}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset className="form-section">
              <legend>
                <span className="step-number">01</span>
                {t.stepWorkout}
              </legend>
              <div className="choice-grid two-columns">
                <ChoiceButton
                  active={form.workout}
                  icon="🏋️"
                  title={t.workoutYes}
                  subtitle={t.workoutYesSub}
                  onClick={() => updateForm('workout', true)}
                />
                <ChoiceButton
                  active={!form.workout}
                  icon="🌿"
                  title={t.workoutNo}
                  subtitle={t.workoutNoSub}
                  onClick={() => updateForm('workout', false)}
                />
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>
                <span className="step-number">02</span>
                {t.stepDuration}
              </legend>
              <div className="segmented-control">
                <SegmentButton
                  active={form.duration === 'quick'}
                  onClick={() => updateForm('duration', 'quick' as Duration)}
                  icon="⚡"
                  label={t.durationQuick}
                  detail={t.durationQuickDetail}
                />
                <SegmentButton
                  active={form.duration === 'full'}
                  onClick={() => updateForm('duration', 'full' as Duration)}
                  icon="🕰️"
                  label={t.durationFull}
                  detail={t.durationFullDetail}
                />
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>
                <span className="step-number">03</span>
                {t.stepScene}
              </legend>
              <div className="scene-tabs">
                <button
                  type="button"
                  className={form.scene === 'home' ? 'active' : ''}
                  onClick={() => updateForm('scene', 'home' as Scene)}
                >
                  {t.sceneHome}
                </button>
                <button
                  type="button"
                  className={form.scene === 'out' ? 'active' : ''}
                  onClick={() => updateForm('scene', 'out' as Scene)}
                >
                  {t.sceneOut}
                </button>
              </div>

              {form.scene === 'home' ? (
                <div className="home-options">
                  <div className="field-group">
                    <label>{t.cuisineLabel}</label>
                    <div className="pill-row">
                      {cuisines.map((cuisine) => (
                        <button
                          key={cuisine}
                          type="button"
                          className={form.cuisine === cuisine ? 'pill active' : 'pill'}
                          onClick={() => updateForm('cuisine', cuisine)}
                        >
                          {labelCuisine(cuisine)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field-group">
                    <label>{t.goalLabel}</label>
                    <div className="pill-row">
                      {(
                        [
                          ['all', t.goalAll],
                          ['light', t.goalLight],
                          ['highProtein', t.goalProtein],
                        ] as const
                      ).map(([value, label]) => (
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
                    <label htmlFor="ingredients">{t.ingredientsLabel}</label>
                    <div className="ingredient-input">
                      <input
                        id="ingredients"
                        value={ingredientDraft}
                        onChange={(event) => setIngredientDraft(event.target.value)}
                        onKeyDown={handleIngredientKeyDown}
                        placeholder={t.ingredientsPlaceholder}
                      />
                      <button type="button" onClick={() => addIngredient()}>{t.add}</button>
                    </div>
                    {form.ingredients.length > 0 ? (
                      <div className="ingredient-chips" aria-label={t.ingredientsLabel}>
                        {form.ingredients.map((ingredient) => (
                          <button
                            type="button"
                            key={ingredient}
                            onClick={() => removeIngredient(ingredient)}
                            aria-label={t.removeIngredient(labelIngredient(ingredient))}
                          >
                            {labelIngredient(ingredient)}<span>×</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <div className="suggestions">
                      <span>{t.common}</span>
                      {ingredientSuggestions.slice(0, 6).map((ingredient) => (
                        <button
                          type="button"
                          key={ingredient}
                          disabled={form.ingredients.includes(ingredient)}
                          onClick={() => addIngredient(ingredient)}
                        >
                          + {labelIngredient(ingredient)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="outside-options">
                  <label htmlFor="preference">{t.preferenceLabel}</label>
                  <div className="preference-input">
                    <span aria-hidden="true">🔎</span>
                    <input
                      id="preference"
                      value={form.preference}
                      onChange={(event) => updateForm('preference', event.target.value)}
                      placeholder={t.preferencePlaceholder}
                    />
                  </div>
                  <p>{t.preferenceHint}</p>
                </div>
              )}
            </fieldset>

            <button className="submit-button" type="submit">
              <span aria-hidden="true">🍽️</span>
              {t.submit}
              <small>{t.submitSub}</small>
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
              <p className="eyebrow">{t.emptyEyebrow}</p>
              <h2>{t.emptyTitle}</h2>
              <p>{t.emptyCopy}</p>
              <div className="empty-dots" aria-hidden="true"><span /><span /><span /></div>
            </div>
          )}
        </aside>
      </main>

      <footer>
        <span aria-hidden="true">🌾</span>
        {t.footer}
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
