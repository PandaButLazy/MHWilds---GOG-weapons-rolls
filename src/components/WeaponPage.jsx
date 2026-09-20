import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { elements } from '../data/elements'
import { bonusSkillCategory, groupSkillCategory } from '../data/skills'
import { weaponTypes } from '../data/weaponTypes'
import { useRollData } from '../hooks/useRollData'
import { RollCellModal } from './RollCellModal'
import { TargetBar } from './TargetBar'

function getMatchClass(value, target) {
  if (!value) return null
  const hasGroupTarget = Boolean(target.groupSkill)
  const hasBonusTarget = Boolean(target.bonusSkill)
  if (!hasGroupTarget && !hasBonusTarget) return null

  const groupMatches = hasGroupTarget && value.groupSkill === target.groupSkill
  const bonusMatches = hasBonusTarget && value.bonusSkill === target.bonusSkill
  const matchCount = (groupMatches ? 1 : 0) + (bonusMatches ? 1 : 0)
  const targetCount = (hasGroupTarget ? 1 : 0) + (hasBonusTarget ? 1 : 0)

  if (matchCount === 0) return null
  if (matchCount === targetCount) return 'cell-match-full'
  return 'cell-match-partial'
}

export function WeaponPage() {
  const { weaponId } = useParams()
  const {
    getCell,
    setCell,
    getTarget,
    setTarget,
    getOccurrenceCount,
    setOccurrenceCount,
    clearWeapon,
  } = useRollData()
  const [activeCell, setActiveCell] = useState(null)

  const weapon = useMemo(
    () => weaponTypes.find((w) => w.id === weaponId),
    [weaponId],
  )

  if (!weapon) {
    return <p>Unknown weapon type.</p>
  }

  const target = getTarget(weapon.id)
  const occurrenceCount = getOccurrenceCount(weapon.id)
  const occurrences = Array.from({ length: occurrenceCount }, (_, i) => i + 1)

  function handleClearAll() {
    const confirmed = window.confirm(
      `Clear all reroll data for "${weapon.name}"? This action cannot be undone.`,
    )
    if (!confirmed) return
    clearWeapon(weapon.id)
  }

  return (
    <div className="weapon-page">
      <h2 className="weapon-page-title">
        {weapon.iconUrl && <img src={weapon.iconUrl} alt="" width={28} height={28} />}
        {weapon.name}
      </h2>

      <TargetBar
        target={target}
        onTargetChange={(value) => setTarget(weapon.id, value)}
        occurrenceCount={occurrenceCount}
        onOccurrenceCountChange={(value) => setOccurrenceCount(weapon.id, value)}
      />

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
                  const matchClass = getMatchClass(value, target)
                  const classNames = [value ? 'cell-filled' : 'cell-empty', matchClass]
                    .filter(Boolean)
                    .join(' ')
                  return (
                    <td
                      key={element}
                      className={classNames}
                      onClick={() => setActiveCell({ element, occurrence, value })}
                    >
                      {value ? (
                        <div className="cell-content">
                          <span className="cell-bonus">
                            {bonusSkillCategory?.image_url && (
                              <img className="cell-icon" src={bonusSkillCategory.image_url} alt="" />
                            )}
                            {value.bonusSkill || '—'}
                          </span>
                          <span className="cell-group">
                            {groupSkillCategory?.image_url && (
                              <img className="cell-icon" src={groupSkillCategory.image_url} alt="" />
                            )}
                            {value.groupSkill || '—'}
                          </span>
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

      <div className="danger-zone">
        <button type="button" className="btn-danger" onClick={handleClearAll}>
          Clear all for this weapon
        </button>
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
