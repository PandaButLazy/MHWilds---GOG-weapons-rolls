import { useEffect, useState } from 'react'
import { bonusSkills, groupSkills } from '../data/skills'
import { SkillInput } from './SkillInput'

export function RollCellModal({ weaponName, element, occurrence, initialValue, onSave, onClear, onClose }) {
  const [groupSkill, setGroupSkill] = useState(initialValue?.groupSkill ?? '')
  const [bonusSkill, setBonusSkill] = useState(initialValue?.bonusSkill ?? '')

  useEffect(() => {
    setGroupSkill(initialValue?.groupSkill ?? '')
    setBonusSkill(initialValue?.bonusSkill ?? '')
  }, [initialValue])

  function handleSubmit(e) {
    e.preventDefault()
    if (!groupSkill && !bonusSkill) {
      onClear()
      return
    }
    onSave({ groupSkill, bonusSkill })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          {weaponName} — {element} — Roll #{occurrence}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            Set Bonus Skill
            <SkillInput
              id="modal-bonus-skills-list"
              skills={bonusSkills}
              value={bonusSkill}
              onChange={setBonusSkill}
              placeholder="Rechercher ou choisir..."
            />
          </label>
          <label>
            Group Skill
            <SkillInput
              id="modal-group-skills-list"
              skills={groupSkills}
              value={groupSkill}
              onChange={setGroupSkill}
              placeholder="Rechercher ou choisir..."
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClear}>
              Clear
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
