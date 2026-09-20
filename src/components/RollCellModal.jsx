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
            <select value={groupSkill} onChange={(e) => setGroupSkill(e.target.value)}>
              <option value="">—</option>
              {groupSkills.map((skill) => (
                <option key={skill.name} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Bonus Skill
            <select value={bonusSkill} onChange={(e) => setBonusSkill(e.target.value)}>
              <option value="">—</option>
              {bonusSkills.map((skill) => (
                <option key={skill.name} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
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
