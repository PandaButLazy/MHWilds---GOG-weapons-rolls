import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { TARRED_DEVICES_STORAGE_KEY } from '../data/storageKeys'
import { DEFAULT_TARRED_DEVICE_COUNTS } from '../data/tarredDevices'

const TarredDevicesContext = createContext(null)

function loadCounts() {
  try {
    const raw = localStorage.getItem(TARRED_DEVICES_STORAGE_KEY)
    return raw
      ? { ...DEFAULT_TARRED_DEVICE_COUNTS, ...JSON.parse(raw) }
      : { ...DEFAULT_TARRED_DEVICE_COUNTS }
  } catch {
    return { ...DEFAULT_TARRED_DEVICE_COUNTS }
  }
}

export function TarredDevicesProvider({ children }) {
  const [counts, setCounts] = useState(loadCounts)

  useEffect(() => {
    localStorage.setItem(TARRED_DEVICES_STORAGE_KEY, JSON.stringify(counts))
  }, [counts])

  const setCount = useCallback((type, value) => {
    const parsed = Math.max(0, Math.round(Number(value) || 0))
    setCounts((prev) => ({ ...prev, [type]: parsed }))
  }, [])

  const adjustCount = useCallback((type, delta) => {
    setCounts((prev) => ({ ...prev, [type]: Math.max(0, (prev[type] ?? 0) + delta) }))
  }, [])

  return (
    <TarredDevicesContext.Provider value={{ counts, setCount, adjustCount }}>
      {children}
    </TarredDevicesContext.Provider>
  )
}

export function useTarredDevices() {
  const context = useContext(TarredDevicesContext)
  if (!context) {
    throw new Error('useTarredDevices must be used within a TarredDevicesProvider')
  }
  return context
}
