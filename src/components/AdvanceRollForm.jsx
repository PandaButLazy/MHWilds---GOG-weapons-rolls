import { useState } from 'react'
import { useTarredDevices } from '../context/TarredDevicesContext'
import { createEmptyDeviceUsage, TARRED_DEVICE_TYPES, totalRollsFromUsage } from '../data/tarredDevices'
import { useRollAdvanceLog } from '../hooks/useRollAdvanceLog'
import { DeviceUsageFields } from './DeviceUsageFields'

export function AdvanceRollForm({ advanceAllRolls }) {
  const { adjustCount } = useTarredDevices()
  const { addEntry } = useRollAdvanceLog()
  const [isOpen, setIsOpen] = useState(false)
  const [deviceUsage, setDeviceUsage] = useState(createEmptyDeviceUsage)
  const [error, setError] = useState('')

  const rollsToAdvance = totalRollsFromUsage(deviceUsage)

  function updateUsage(deviceId, patch) {
    setDeviceUsage((prev) => ({ ...prev, [deviceId]: { ...prev[deviceId], ...patch } }))
  }

  function resetForm() {
    setDeviceUsage(createEmptyDeviceUsage())
    setError('')
  }

  function handleCancel() {
    resetForm()
    setIsOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (rollsToAdvance < 1) {
      setError('Enter enough Tarred Devices for at least one roll')
      return
    }

    const confirmed = window.confirm(
      `Advance the roll sequence by ${rollsToAdvance} roll${rollsToAdvance > 1 ? 's' : ''}? ` +
        'This shifts every logged roll on every weapon back by that many, and drops any that reach zero.',
    )
    if (!confirmed) return

    const removedEntries = advanceAllRolls(rollsToAdvance)

    TARRED_DEVICE_TYPES.forEach((device) => {
      const used = deviceUsage[device.id].used
      if (used > 0) adjustCount(device.id, -used)
    })

    addEntry({ deviceUsage, rollsAdvanced: rollsToAdvance, removedEntries })

    resetForm()
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <div className="advance-roll-trigger">
        <button type="button" className="btn-primary" onClick={() => setIsOpen(true)}>
          Advance Rolls
        </button>
      </div>
    )
  }

  return (
    <div className="log-roll-panel">
      <h3>Advance Rolls</h3>
      <p className="advance-roll-hint">
        Crafting or reinforcing another Gogma weapon advances the shared roll sequence. Log the
        Tarred Devices spent doing that here to shift every weapon's recorded rolls back by the
        right amount.
      </p>
      <form onSubmit={handleSubmit}>
        <DeviceUsageFields usage={deviceUsage} onChange={updateUsage} />
        {error && <span className="field-error">{error}</span>}
        <div className="computed-roll">
          Rolls to advance: <strong>{rollsToAdvance || '—'}</strong>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Confirm Advance
          </button>
        </div>
      </form>
    </div>
  )
}
