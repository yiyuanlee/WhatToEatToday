const STORAGE_KEY = 'xiaobao-meal-history-v1'
const MAX_HISTORY = 6

interface StoredHistory {
  version: 1
  ids: string[]
}

export function readHistory(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredHistory
    return parsed.version === 1 && Array.isArray(parsed.ids) ? parsed.ids : []
  } catch {
    return []
  }
}

export function rememberRecommendation(id: string) {
  if (typeof window === 'undefined') return

  const next = [id, ...readHistory().filter((storedId) => storedId !== id)].slice(0, MAX_HISTORY)
  const payload: StoredHistory = { version: 1, ids: next }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // 推荐功能不应因隐私模式或存储空间限制而中断。
  }
}
