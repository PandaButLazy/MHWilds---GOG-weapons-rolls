import { useRef } from 'react'
import { downloadExport, importFromFile } from '../data/importExport'

export function ImportExportControls() {
  const fileInputRef = useRef(null)

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const confirmed = window.confirm(
      'Import this file? It will replace all current rolls, targets, inventory and Tarred Device counts.',
    )
    if (!confirmed) return

    try {
      await importFromFile(file)
      window.location.reload()
    } catch {
      window.alert('Could not import this file: it is not a valid export.')
    }
  }

  return (
    <div className="import-export">
      <button type="button" className="btn-secondary" onClick={downloadExport}>
        Export
      </button>
      <button type="button" className="btn-secondary" onClick={handleImportClick}>
        Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="visually-hidden"
      />
    </div>
  )
}
