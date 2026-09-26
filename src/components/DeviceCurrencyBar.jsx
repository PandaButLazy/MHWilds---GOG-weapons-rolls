import { useTarredDevices } from '../context/TarredDevicesContext'
import { TARRED_DEVICE_TYPES } from '../data/tarredDevices'
import { DeviceIcon } from './DeviceIcon'

export function DeviceCurrencyBar() {
  const { counts } = useTarredDevices()

  return (
    <div className="device-currency-bar">
      {TARRED_DEVICE_TYPES.map((device) => (
        <div
          key={device.id}
          className={`device-currency-pill device-currency-${device.id}`}
          title={`${device.name} Tarred Devices`}
        >
          <DeviceIcon type={device.id} />
          <span>{counts[device.id] ?? 0}</span>
        </div>
      ))}
    </div>
  )
}
