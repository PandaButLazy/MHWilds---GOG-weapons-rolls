import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { weaponTypes } from '../data/weaponTypes'
import { ImportExportControls } from './ImportExportControls'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen && <div className="sidebar-backdrop" onClick={closeMenu} />}

      <nav className={isOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <h1 className="sidebar-title">
          <img
            className="app-logo"
            src={`${import.meta.env.BASE_URL}gogmazios-icon.png`}
            alt=""
            width={36}
            height={36}
          />
          Gogmazios Rerolls
        </h1>

        <ul className="sidebar-list">
          <li>
            <NavLink
              to="/inventory"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              Weapon Inventory
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tarred-devices"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              Tarred Devices
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/roll-log"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              Roll Log
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-divider" />

        <ul className="sidebar-list">
          {weaponTypes.map((weapon) => (
            <li key={weapon.id}>
              <NavLink
                to={`/weapon/${weapon.id}`}
                onClick={closeMenu}
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
    </>
  )
}
