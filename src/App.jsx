import { Navigate, Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { WeaponPage } from './components/WeaponPage'
import './App.css'

function Home() {
  return (
    <div className="home">
      <h2>Bienvenue</h2>
      <p>Sélectionne un type d'arme dans le menu pour noter les rerolls observés.</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weapon/:weaponId" element={<WeaponPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
