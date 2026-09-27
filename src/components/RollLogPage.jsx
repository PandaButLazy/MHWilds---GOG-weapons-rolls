import { useTarredDevices } from '../context/TarredDevicesContext'
import { TARRED_DEVICE_TYPES } from '../data/tarredDevices'
import { weaponTypes } from '../data/weaponTypes'
import { useRollAdvanceLog } from '../hooks/useRollAdvanceLog'
import { useRollData } from '../hooks/useRollData'

function describeDeviceUsage(deviceUsage) {
  const parts = TARRED_DEVICE_TYPES.filter((device) => deviceUsage[device.id].used > 0).map(
    (device) => `${device.name}: ${deviceUsage[device.id].used}${deviceUsage[device.id].matchesFocus ? ' (focus)' : ''}`,
  )
  return parts.length > 0 ? parts.join(', ') : 'No devices'
}

function findWeaponName(weaponId) {
  return weaponTypes.find((w) => w.id === weaponId)?.name ?? weaponId
}

export function RollLogPage() {
  const { adjustCount } = useTarredDevices()
  const { revertAdvance } = useRollData()
  const { entries, removeEntry } = useRollAdvanceLog()

  const latestEntryId = entries.length > 0 ? entries[entries.length - 1].id : null

  function handleRevert(entry) {
    const confirmed = window.confirm(
      `Revert this advance? This restores ${entry.rollsAdvanced} roll${entry.rollsAdvanced > 1 ? 's' : ''} and the devices spent for it.`,
    )
    if (!confirmed) return

    revertAdvance(entry.rollsAdvanced, entry.removedEntries)

    TARRED_DEVICE_TYPES.forEach((device) => {
      const used = entry.deviceUsage[device.id].used
      if (used > 0) adjustCount(device.id, used)
    })

    removeEntry(entry.id)
  }

  const displayEntries = [...entries].reverse()

  return (
    <div className="roll-log-page">
      <h2>Roll Log</h2>
      <p className="page-intro">
        History of every time you advanced the shared roll sequence from a weapon page. Only the
        most recent advance can be reverted, restoring its devices and shifting rolls back up.
      </p>

      <div className="roll-log-list">
        {displayEntries.length === 0 && <p className="page-intro">No advances logged yet.</p>}
        {displayEntries.map((entry) => (
          <div className="roll-log-entry" key={entry.id}>
            <div className="roll-log-entry-header">
              <span>{new Date(entry.createdAt).toLocaleString()}</span>
              <span className="roll-log-entry-rolls">+{entry.rollsAdvanced} rolls</span>
            </div>
            <div className="roll-log-entry-devices">{describeDeviceUsage(entry.deviceUsage)}</div>
            {entry.removedEntries.length > 0 && (
              <details className="roll-log-removed">
                <summary>
                  {entry.removedEntries.length} roll{entry.removedEntries.length > 1 ? 's' : ''} dropped
                  (sequence moved past them)
                </summary>
                <ul>
                  {entry.removedEntries.map((removed, index) => (
                    <li key={index}>
                      {findWeaponName(removed.weaponId)} — {removed.element} (was roll #{removed.occurrence}):{' '}
                      {removed.value.bonusSkill} / {removed.value.groupSkill}
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {entry.id === latestEntryId ? (
              <button type="button" className="btn-secondary" onClick={() => handleRevert(entry)}>
                Revert
              </button>
            ) : (
              <span className="roll-log-locked">Only the most recent advance can be reverted</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
