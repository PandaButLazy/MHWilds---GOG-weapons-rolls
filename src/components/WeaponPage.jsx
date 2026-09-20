import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { elements } from '../data/elements'
import { bonusSkills, groupSkills, MAX_ROLLS } from '../data/skills'
import { weaponTypes } from '../data/weaponTypes'
import { useRollData } from '../hooks/useRollData'
import { RollCellModal } from './RollCellModal'
import { SkillInput } from './SkillInput'

function isValidSkillValue(value, skills) {
  if (!value) return true
  return skills.some((skill) => skill.name === value)
}

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
  const { getCell, setCell, getTarget, setTarget, clearWeapon } = useRollData()
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

  const target = getTarget(weapon.id)
  const isGroupTargetValid = isValidSkillValue(target.groupSkill, groupSkills)
  const isBonusTargetValid = isValidSkillValue(target.bonusSkill, bonusSkills)

  function handleClearAll() {
    const confirmed = window.confirm(
      `Effacer toutes les données de rerolls pour "${weapon.name}" ? Cette action est irréversible.`,
    )
    if (!confirmed) return
    clearWeapon(weapon.id)
  }

  return (
    <div className="weapon-page">
      <h2>{weapon.name}</h2>

      <div className="target-panel">
        <h3>Combinaison recherchée</h3>
        <div className="target-fields">
          <label>
            Set Bonus Skill
            <SkillInput
              id="target-bonus-skills-list"
              skills={bonusSkills}
              value={target.bonusSkill}
              onChange={(value) => setTarget(weapon.id, { ...target, bonusSkill: value })}
              placeholder="Bonus skill cible..."
              invalid={!isBonusTargetValid}
            />
            {!isBonusTargetValid && <span className="field-error">Skill inconnu</span>}
          </label>
          <label>
            Group Skill
            <SkillInput
              id="target-group-skills-list"
              skills={groupSkills}
              value={target.groupSkill}
              onChange={(value) => setTarget(weapon.id, { ...target, groupSkill: value })}
              placeholder="Group skill cible..."
              invalid={!isGroupTargetValid}
            />
            {!isGroupTargetValid && <span className="field-error">Skill inconnu</span>}
          </label>
        </div>
      </div>

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
                          <span className="cell-bonus">{value.bonusSkill || '—'}</span>
                          <span className="cell-group">{value.groupSkill || '—'}</span>
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
          Tout effacer pour cette arme
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
