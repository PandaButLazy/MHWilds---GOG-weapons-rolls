import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'gog-rerolls-v1'
const TARGETS_STORAGE_KEY = 'gog-rerolls-targets-v1'

function loadJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function cellKey(weaponId, element, occurrence) {
  return `${weaponId}::${element}::${occurrence}`
}

export function useRollData() {
  const [data, setData] = useState(() => loadJSON(STORAGE_KEY))
  const [targets, setTargets] = useState(() => loadJSON(TARGETS_STORAGE_KEY))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(targets))
  }, [targets])

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

  const getTarget = useCallback(
    (weaponId) => targets[weaponId] || { groupSkill: '', bonusSkill: '' },
    [targets],
  )

  const setTarget = useCallback((weaponId, value) => {
    setTargets((prev) => ({ ...prev, [weaponId]: value }))
  }, [])

  const clearWeapon = useCallback((weaponId) => {
    const prefix = `${weaponId}::`
    setData((prev) => {
      const next = {}
      for (const key of Object.keys(prev)) {
        if (!key.startsWith(prefix)) next[key] = prev[key]
      }
      return next
    })
    setTargets((prev) => {
      const next = { ...prev }
      delete next[weaponId]
      return next
    })
  }, [])

  return { getCell, setCell, getTarget, setTarget, clearWeapon }
}
