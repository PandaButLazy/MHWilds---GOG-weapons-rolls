import { useCallback, useEffect, useState } from 'react'
import { INVENTORY_STORAGE_KEY } from '../data/storageKeys'

function loadInventory() {
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useInventory() {
  const [items, setItems] = useState(loadInventory)

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item) => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), createdAt: Date.now(), ...item },
    ])
  }, [])

  const updateItem = useCallback((id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { items, addItem, updateItem, removeItem }
}
