import { Navigate, Route, Routes } from 'react-router-dom'
import { DeviceCurrencyBar } from './components/DeviceCurrencyBar'
import { InventoryPage } from './components/InventoryPage'
import { Sidebar } from './components/Sidebar'
import { TarredDevicesPage } from './components/TarredDevicesPage'
import { WeaponPage } from './components/WeaponPage'
import './App.css'

function Home() {
  return (
    <div className="home">
      <h2>Welcome</h2>
      <p>Select a weapon type from the menu to log the rerolls you've observed.</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="app-layout">
      <DeviceCurrencyBar />
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weapon/:weaponId" element={<WeaponPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/tarred-devices" element={<TarredDevicesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
