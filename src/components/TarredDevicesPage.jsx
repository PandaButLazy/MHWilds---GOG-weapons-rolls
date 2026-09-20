import { TARRED_DEVICE_TYPES } from '../data/tarredDevices'
import { useTarredDevices } from '../hooks/useTarredDevices'

export function TarredDevicesPage() {
  const { counts, setCount, adjustCount } = useTarredDevices()

  return (
    <div className="devices-page">
      <h2>Tarred Devices</h2>
      <p className="page-intro">
        Tarred Devices are Gogmazios' special currency for Gogma weapons. There are 3 types, each
        matching a weapon focus. They're obtained by hunting Gogmazios, from rewards and by
        breaking its glowing parts during the hunt — the materials you get are converted into
        these three Device categories.
      </p>

      <div className="table-wrapper">
        <table className="devices-table">
          <thead>
            <tr>
              <th>Tarred Device</th>
              <th>Focus</th>
              <th>Effect on crafting</th>
              <th>Owned</th>
            </tr>
          </thead>
          <tbody>
            {TARRED_DEVICE_TYPES.map((device) => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.focus}</td>
                <td>{device.effect}</td>
                <td>
                  <div className="device-count">
                    <button type="button" className="btn-secondary" onClick={() => adjustCount(device.id, -1)}>
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={counts[device.id] ?? 0}
                      onChange={(e) => setCount(device.id, e.target.value)}
                    />
                    <button type="button" className="btn-secondary" onClick={() => adjustCount(device.id, 1)}>
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="devices-cost-note">
        <h3>Skill reset cost</h3>
        <p>
          Forge → Gogma Reinforce → Reset Skills costs 3 Tarred Devices matching your weapon's
          focus, or 6 Devices of any other type.
        </p>
      </div>
    </div>
  )
}
