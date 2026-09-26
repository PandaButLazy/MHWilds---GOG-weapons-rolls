import {
  INVENTORY_STORAGE_KEY,
  ROLLS_STORAGE_KEY,
  TARGETS_STORAGE_KEY,
  TARRED_DEVICES_STORAGE_KEY,
} from './storageKeys'

const EXPORT_VERSION = 1

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function buildExportData() {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    rolls: readJSON(ROLLS_STORAGE_KEY, {}),
    targets: readJSON(TARGETS_STORAGE_KEY, {}),
    inventory: readJSON(INVENTORY_STORAGE_KEY, []),
    tarredDevices: readJSON(TARRED_DEVICES_STORAGE_KEY, {}),
  }
}

export function downloadExport() {
  const data = buildExportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `gogmazios-rerolls-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function applyImportData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid file: expected a JSON object')
  }
  localStorage.setItem(ROLLS_STORAGE_KEY, JSON.stringify(data.rolls ?? {}))
  localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(data.targets ?? {}))
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(data.inventory ?? []))
  localStorage.setItem(TARRED_DEVICES_STORAGE_KEY, JSON.stringify(data.tarredDevices ?? {}))
}

export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        applyImportData(data)
        resolve()
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'))
    reader.readAsText(file)
  })
}
