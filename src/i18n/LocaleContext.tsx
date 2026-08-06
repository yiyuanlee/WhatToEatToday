import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  amountLabels,
  cuisineLabels,
  diningCopy,
  ingredientLabels,
  recipeCopy,
  storeAreaLabels,
  type Locale,
} from './content'
import { ui, type UiCopy } from './ui'

const STORAGE_KEY = 'xiaobao-locale'

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: UiCopy
  labelIngredient: (name: string) => string
  labelCuisine: (name: string) => string
  labelArea: (name: string) => string
  labelAmount: (amount: string) => string
  recipeName: (id: string, fallback: string) => string
  recipeDescription: (id: string, fallback: string) => string
  diningName: (id: string, fallback: string) => string
  diningDescription: (id: string, fallback: string) => string
  diningTip: (id: string, fallback: string) => string
  joinList: (items: string[]) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale())

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    document.title = ui[locale].pageTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', ui[locale].pageDesc)
  }, [locale])

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: ui[locale],
    labelIngredient: (name) => ingredientLabels[locale][name] ?? name,
    labelCuisine: (name) => cuisineLabels[locale][name] ?? name,
    labelArea: (name) => storeAreaLabels[locale][name] ?? name,
    labelAmount: (amount) => amountLabels[locale](amount),
    recipeName: (id, fallback) => recipeCopy[id]?.name[locale] ?? fallback,
    recipeDescription: (id, fallback) => recipeCopy[id]?.description[locale] ?? fallback,
    diningName: (id, fallback) => diningCopy[id]?.name[locale] ?? fallback,
    diningDescription: (id, fallback) => diningCopy[id]?.description[locale] ?? fallback,
    diningTip: (id, fallback) => diningCopy[id]?.orderTip[locale] ?? fallback,
    joinList: (items) => items.join(locale === 'zh' ? '、' : ', '),
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
