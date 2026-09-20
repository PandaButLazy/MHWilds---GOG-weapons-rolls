import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'gog-rerolls-v1'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function cellKey(weaponId, element, occurrence) {
  return `${weaponId}::${element}::${occurrence}`
}

export function useRollData() {
  const [data, setData] = useState(loadAll)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const getCell = useCallback(
    (weaponId, element, occurrence) => data[cellKey(weaponId, element, occurrence)] || null,
    [data],
  )

  const setCell = useCallback((weaponId, element, occurrence, value) => {
    setData((prev) => {
      const key = cellKey(weaponId, element, occurrence)
      if (!value) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: value }
    })
  }, [])

  return { getCell, setCell }
}
