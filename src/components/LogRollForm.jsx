import { useState } from 'react'
import { useTarredDevices } from '../context/TarredDevicesContext'
import { elements } from '../data/elements'
import { bonusSkillCategory, bonusSkills, groupSkillCategory, groupSkills, isValidSkillValue } from '../data/skills'
import { createEmptyDeviceUsage, TARRED_DEVICE_TYPES, totalRollsFromUsage } from '../data/tarredDevices'
import { DeviceUsageFields } from './DeviceUsageFields'
import { FieldLabel } from './FieldLabel'
import { SkillInput } from './SkillInput'

export function LogRollForm({ onLogRoll }) {
  const { adjustCount } = useTarredDevices()
  const [element, setElement] = useState(elements[0])
  const [deviceUsage, setDeviceUsage] = useState(createEmptyDeviceUsage)
  const [bonusSkill, setBonusSkill] = useState('')
  const [groupSkill, setGroupSkill] = useState('')
  const [errors, setErrors] = useState({})

  const computedRoll = totalRollsFromUsage(deviceUsage)

  function updateUsage(deviceId, patch) {
    setDeviceUsage((prev) => ({ ...prev, [deviceId]: { ...prev[deviceId], ...patch } }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedBonus = bonusSkill.trim()
    const trimmedGroup = groupSkill.trim()

    const nextErrors = {}
    if (computedRoll < 1) {
      nextErrors.devices = 'Enter enough Tarred Devices for at least one roll'
    }
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

    const wasLogged = onLogRoll({
      element,
      occurrence: computedRoll,
      bonusSkill: trimmedBonus,
      groupSkill: trimmedGroup,
    })
    if (wasLogged === false) return

    TARRED_DEVICE_TYPES.forEach((device) => {
      const used = deviceUsage[device.id].used
      if (used > 0) adjustCount(device.id, -used)
    })

    setDeviceUsage(createEmptyDeviceUsage())
    setBonusSkill('')
    setGroupSkill('')
    setErrors({})
  }

  return (
    <div className="log-roll-panel">
      <h3>Log a Roll</h3>
      <form onSubmit={handleSubmit}>
        <label className="log-roll-element">
          Element
          <select value={element} onChange={(e) => setElement(e.target.value)}>
            {elements.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </label>

        <DeviceUsageFields usage={deviceUsage} onChange={updateUsage} />
        {errors.devices && <span className="field-error">{errors.devices}</span>}

        <div className="computed-roll">
          Roll # from devices used: <strong>{computedRoll || '—'}</strong>
        </div>

        <label>
          <FieldLabel iconUrl={bonusSkillCategory?.image_url}>Set Bonus Skill</FieldLabel>
          <SkillInput
            id="log-roll-bonus-skills-list"
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
            id="log-roll-group-skills-list"
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

        <button type="submit" className="btn-primary">
          Log Roll
        </button>
      </form>
    </div>
  )
}
