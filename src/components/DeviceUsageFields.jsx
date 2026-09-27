import { useTarredDevices } from '../context/TarredDevicesContext'
import { TARRED_DEVICE_TYPES } from '../data/tarredDevices'

export function DeviceUsageFields({ usage, onChange }) {
  const { counts } = useTarredDevices()

  return (
    <div className="device-usage-fields">
      {TARRED_DEVICE_TYPES.map((device) => {
        const deviceUsage = usage[device.id]
        const remaining = (counts[device.id] ?? 0) - (Number(deviceUsage.used) || 0)
        return (
          <div className="device-usage-field" key={device.id}>
            <label>
              {device.name} used
              <input
                type="number"
                min={0}
                value={deviceUsage.used}
                onChange={(e) =>
                  onChange(device.id, { used: Math.max(0, Number(e.target.value) || 0) })
                }
              />
            </label>
            <label className="device-usage-checkbox">
              <input
                type="checkbox"
                checked={deviceUsage.matchesFocus}
                onChange={(e) => onChange(device.id, { matchesFocus: e.target.checked })}
              />
              Matches weapon focus
            </label>
            <span className={remaining < 0 ? 'device-remaining device-remaining-negative' : 'device-remaining'}>
              {remaining} left in inventory
            </span>
          </div>
        )
      })}
    </div>
  )
}
