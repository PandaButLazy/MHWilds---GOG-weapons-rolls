import { useEffect, useState } from 'react'
import { bonusSkillCategory, bonusSkills, groupSkillCategory, groupSkills, isValidSkillValue } from '../data/skills'
import { FieldLabel } from './FieldLabel'
import { SkillInput } from './SkillInput'

export function RollCellModal({ weaponName, element, occurrence, initialValue, onSave, onClear, onClose }) {
  const [groupSkill, setGroupSkill] = useState(initialValue?.groupSkill ?? '')
  const [bonusSkill, setBonusSkill] = useState(initialValue?.bonusSkill ?? '')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setGroupSkill(initialValue?.groupSkill ?? '')
    setBonusSkill(initialValue?.bonusSkill ?? '')
    setErrors({})
  }, [initialValue])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedBonus = bonusSkill.trim()
    const trimmedGroup = groupSkill.trim()

    if (!trimmedBonus && !trimmedGroup) {
      onClear()
      return
    }

    const nextErrors = {}
    if (!trimmedBonus) {
      nextErrors.bonusSkill = 'Set Bonus Skill required'
    } else if (!isValidSkillValue(trimmedBonus, bonusSkills)) {
      nextErrors.bonusSkill = 'Unknown skill'
    }
    if (!trimmedGroup) {
      nextErrors.groupSkill = 'Group Skill required'
    } else if (!isValidSkillValue(trimmedGroup, groupSkills)) {
      nextErrors.groupSkill = 'Unknown skill'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSave({ groupSkill: trimmedGroup, bonusSkill: trimmedBonus })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          {weaponName} — {element} — Roll #{occurrence}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            <FieldLabel iconUrl={bonusSkillCategory?.image_url}>Set Bonus Skill</FieldLabel>
            <SkillInput
              id="modal-bonus-skills-list"
              skills={bonusSkills}
              value={bonusSkill}
              onChange={(value) => {
                setBonusSkill(value)
                setErrors((prev) => ({ ...prev, bonusSkill: undefined }))
              }}
              placeholder="Search or choose..."
              invalid={Boolean(errors.bonusSkill)}
            />
            {errors.bonusSkill && <span className="field-error">{errors.bonusSkill}</span>}
          </label>
          <label>
            <FieldLabel iconUrl={groupSkillCategory?.image_url}>Group Skill</FieldLabel>
            <SkillInput
              id="modal-group-skills-list"
              skills={groupSkills}
              value={groupSkill}
              onChange={(value) => {
                setGroupSkill(value)
                setErrors((prev) => ({ ...prev, groupSkill: undefined }))
              }}
              placeholder="Search or choose..."
              invalid={Boolean(errors.groupSkill)}
            />
            {errors.groupSkill && <span className="field-error">{errors.groupSkill}</span>}
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
