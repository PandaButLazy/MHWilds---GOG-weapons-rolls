import { NavLink } from 'react-router-dom'
import { weaponTypes } from '../data/weaponTypes'

export function Sidebar() {
  return (
    <nav className="sidebar">
      <h1 className="sidebar-title">Gogmazios Rerolls</h1>
      <ul className="sidebar-list">
        {weaponTypes.map((weapon) => (
          <li key={weapon.id}>
            <NavLink
              to={`/weapon/${weapon.id}`}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {weapon.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
