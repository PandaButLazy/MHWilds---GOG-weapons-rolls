import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { elements } from '../data/elements'
import { MAX_ROLLS } from '../data/skills'
import { weaponTypes } from '../data/weaponTypes'
import { useRollData } from '../hooks/useRollData'
import { RollCellModal } from './RollCellModal'

export function WeaponPage() {
  const { weaponId } = useParams()
  const { getCell, setCell } = useRollData()
  const [activeCell, setActiveCell] = useState(null)

  const weapon = useMemo(
    () => weaponTypes.find((w) => w.id === weaponId),
    [weaponId],
  )

  const occurrences = useMemo(
    () => Array.from({ length: MAX_ROLLS }, (_, i) => i + 1),
    [],
  )

  if (!weapon) {
    return <p>Type d'arme inconnu.</p>
  }

  return (
    <div className="weapon-page">
      <h2>{weapon.name}</h2>
      <div className="table-wrapper">
        <table className="rolls-table">
          <thead>
            <tr>
              <th>Roll #</th>
              {elements.map((element) => (
                <th key={element}>{element}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {occurrences.map((occurrence) => (
              <tr key={occurrence}>
                <th scope="row">{occurrence}</th>
                {elements.map((element) => {
                  const value = getCell(weapon.id, element, occurrence)
                  return (
                    <td
                      key={element}
                      className={value ? 'cell-filled' : 'cell-empty'}
                      onClick={() => setActiveCell({ element, occurrence, value })}
                    >
                      {value ? (
                        <div className="cell-content">
                          <span className="cell-group">{value.groupSkill || '—'}</span>
                          <span className="cell-bonus">{value.bonusSkill || '—'}</span>
                        </div>
                      ) : (
                        <span className="cell-placeholder">+</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeCell && (
        <RollCellModal
          weaponName={weapon.name}
          element={activeCell.element}
          occurrence={activeCell.occurrence}
          initialValue={activeCell.value}
          onSave={(value) => {
            setCell(weapon.id, activeCell.element, activeCell.occurrence, value)
            setActiveCell(null)
          }}
          onClear={() => {
            setCell(weapon.id, activeCell.element, activeCell.occurrence, null)
            setActiveCell(null)
          }}
          onClose={() => setActiveCell(null)}
        />
      )}
    </div>
  )
}
