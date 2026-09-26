import { useCallback, useEffect, useState } from 'react'
import { ROLLS_STORAGE_KEY as STORAGE_KEY, TARGETS_STORAGE_KEY } from '../data/storageKeys'

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

  const getMaxOccurrence = useCallback(
    (weaponId) => {
      const prefix = `${weaponId}::`
      let max = 0
      for (const key of Object.keys(data)) {
        if (!key.startsWith(prefix)) continue
        const occurrence = Number(key.slice(prefix.length).split('::')[1])
        if (Number.isFinite(occurrence) && occurrence > max) max = occurrence
      }
      return max
    },
    [data],
  )

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

  return {
    getCell,
    setCell,
    getMaxOccurrence,
    getTarget,
    setTarget,
    clearWeapon,
  }
}
