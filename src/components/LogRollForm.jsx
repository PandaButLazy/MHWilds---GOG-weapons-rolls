import { useMemo, useState } from 'react'
import { useTarredDevices } from '../context/TarredDevicesContext'
import { elements } from '../data/elements'
import { bonusSkillCategory, bonusSkills, groupSkillCategory, groupSkills, isValidSkillValue } from '../data/skills'
import { rollsFromDeviceUsage, TARRED_DEVICE_TYPES } from '../data/tarredDevices'
import { FieldLabel } from './FieldLabel'
import { SkillInput } from './SkillInput'

const EMPTY_USAGE = TARRED_DEVICE_TYPES.reduce(
  (acc, device) => ({ ...acc, [device.id]: { used: 0, matchesFocus: false } }),
  {},
)

export function LogRollForm({ onLogRoll }) {
  const { counts, adjustCount } = useTarredDevices()
  const [element, setElement] = useState(elements[0])
  const [deviceUsage, setDeviceUsage] = useState(EMPTY_USAGE)
  const [bonusSkill, setBonusSkill] = useState('')
  const [groupSkill, setGroupSkill] = useState('')
  const [errors, setErrors] = useState({})

  const computedRoll = useMemo(
    () =>
      TARRED_DEVICE_TYPES.reduce(
        (total, device) => total + rollsFromDeviceUsage(deviceUsage[device.id].used, deviceUsage[device.id].matchesFocus),
        0,
      ),
    [deviceUsage],
  )

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

    setDeviceUsage(EMPTY_USAGE)
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

        <div className="device-usage-fields">
          {TARRED_DEVICE_TYPES.map((device) => {
            const usage = deviceUsage[device.id]
            const remaining = (counts[device.id] ?? 0) - (Number(usage.used) || 0)
            return (
              <div className="device-usage-field" key={device.id}>
                <label>
                  {device.name} used
                  <input
                    type="number"
                    min={0}
                    value={usage.used}
                    onChange={(e) => updateUsage(device.id, { used: Math.max(0, Number(e.target.value) || 0) })}
                  />
                </label>
                <label className="device-usage-checkbox">
                  <input
                    type="checkbox"
                    checked={usage.matchesFocus}
                    onChange={(e) => updateUsage(device.id, { matchesFocus: e.target.checked })}
                  />
                  Matches weapon focus
                </label>
                <span className={remaining < 0 ? 'device-remaining device-remaining-negative' : 'device-remaining'}>
                  {remaining} left in inventory
                </span>
              </div>
            )
          })}
        </div>
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
