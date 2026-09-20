import { useState } from 'react'
import { elements } from '../data/elements'
import { bonusSkillCategory, bonusSkills, groupSkillCategory, groupSkills, isValidSkillValue } from '../data/skills'
import { weaponTypes } from '../data/weaponTypes'
import { FieldLabel } from './FieldLabel'
import { SkillInput } from './SkillInput'

export function InventoryEntryModal({ initialValue, onSave, onDelete, onClose }) {
  const [weaponId, setWeaponId] = useState(initialValue?.weaponId ?? weaponTypes[0].id)
  const [element, setElement] = useState(initialValue?.element ?? elements[0])
  const [bonusSkill, setBonusSkill] = useState(initialValue?.bonusSkill ?? '')
  const [groupSkill, setGroupSkill] = useState(initialValue?.groupSkill ?? '')
  const [name, setName] = useState(initialValue?.name ?? '')
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedBonus = bonusSkill.trim()
    const trimmedGroup = groupSkill.trim()

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

    onSave({
      weaponId,
      element,
      bonusSkill: trimmedBonus,
      groupSkill: trimmedGroup,
      name: name.trim(),
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initialValue ? 'Edit Weapon' : 'Add Weapon'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Weapon Type
            <select value={weaponId} onChange={(e) => setWeaponId(e.target.value)}>
              {weaponTypes.map((weapon) => (
                <option key={weapon.id} value={weapon.id}>
                  {weapon.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Element
            <select value={element} onChange={(e) => setElement(e.target.value)}>
              {elements.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </label>
          <label>
            <FieldLabel iconUrl={bonusSkillCategory?.image_url}>Set Bonus Skill</FieldLabel>
            <SkillInput
              id="inventory-bonus-skills-list"
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
              id="inventory-group-skills-list"
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
          <label>
            Name (optional)
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Fire Great Sword"
            />
          </label>
          <div className="modal-actions">
            {onDelete && (
              <button type="button" className="btn-danger" onClick={onDelete}>
                Delete
              </button>
            )}
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
