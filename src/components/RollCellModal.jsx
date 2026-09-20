import { useEffect, useState } from 'react'
import { bonusSkills, groupSkills } from '../data/skills'

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
            Group Skill
            <input
              type="text"
              list="group-skills-list"
              value={groupSkill}
              onChange={(e) => setGroupSkill(e.target.value)}
              placeholder="Rechercher ou choisir..."
            />
            <datalist id="group-skills-list">
              {groupSkills.map((skill) => (
                <option key={skill.name} value={skill.name} />
              ))}
            </datalist>
          </label>
          <label>
            Bonus Skill
            <input
              type="text"
              list="bonus-skills-list"
              value={bonusSkill}
              onChange={(e) => setBonusSkill(e.target.value)}
              placeholder="Rechercher ou choisir..."
            />
            <datalist id="bonus-skills-list">
              {bonusSkills.map((skill) => (
                <option key={skill.name} value={skill.name} />
              ))}
            </datalist>
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
