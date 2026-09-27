import { useCallback, useEffect, useState } from 'react'
import { ROLL_ADVANCE_LOG_STORAGE_KEY } from '../data/storageKeys'

function loadLog() {
  try {
    const raw = localStorage.getItem(ROLL_ADVANCE_LOG_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useRollAdvanceLog() {
  const [entries, setEntries] = useState(loadLog)

  useEffect(() => {
    localStorage.setItem(ROLL_ADVANCE_LOG_STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = useCallback((entry) => {
    setEntries((prev) => [...prev, { id: crypto.randomUUID(), createdAt: Date.now(), ...entry }])
  }, [])

  const removeEntry = useCallback((id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }, [])

  return { entries, addEntry, removeEntry }
}
