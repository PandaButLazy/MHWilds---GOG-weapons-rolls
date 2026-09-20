import { NavLink } from 'react-router-dom'
import { weaponTypes } from '../data/weaponTypes'
import { ImportExportControls } from './ImportExportControls'

export function Sidebar() {
  return (
    <nav className="sidebar">
      <h1 className="sidebar-title">
        <img className="app-logo" src="/gogmazios-icon.png" alt="" width={36} height={36} />
        Gogmazios Rerolls
      </h1>

      <ul className="sidebar-list">
        <li>
          <NavLink
            to="/inventory"
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            Weapon Inventory
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tarred-devices"
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            Tarred Devices
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-divider" />

      <ul className="sidebar-list">
        {weaponTypes.map((weapon) => (
          <li key={weapon.id}>
            <NavLink
              to={`/weapon/${weapon.id}`}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {weapon.iconUrl && (
                <img className="sidebar-icon" src={weapon.iconUrl} alt="" width={20} height={20} />
              )}
              {weapon.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <ImportExportControls />
      </div>
    </nav>
  )
}
