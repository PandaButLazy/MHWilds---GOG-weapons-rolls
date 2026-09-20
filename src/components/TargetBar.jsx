import { bonusSkills, groupSkills, MAX_OCCURRENCE_COUNT, MIN_OCCURRENCE_COUNT } from '../data/skills'
import { SkillInput } from './SkillInput'

function isValidSkillValue(value, skills) {
  if (!value) return true
  return skills.some((skill) => skill.name === value)
}

function clampOccurrenceCount(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return MIN_OCCURRENCE_COUNT
  return Math.min(MAX_OCCURRENCE_COUNT, Math.max(MIN_OCCURRENCE_COUNT, Math.round(parsed)))
}

export function TargetBar({ target, onTargetChange, occurrenceCount, onOccurrenceCountChange }) {
  const isBonusTargetValid = isValidSkillValue(target.bonusSkill, bonusSkills)
  const isGroupTargetValid = isValidSkillValue(target.groupSkill, groupSkills)

  return (
    <div className="target-panel">
      <div className="target-fields">
        <label>
          Set Bonus Skill
          <SkillInput
            id="target-bonus-skills-list"
            skills={bonusSkills}
            value={target.bonusSkill}
            onChange={(value) => onTargetChange({ ...target, bonusSkill: value })}
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
            onChange={(value) => onTargetChange({ ...target, groupSkill: value })}
            placeholder="Group skill cible..."
            invalid={!isGroupTargetValid}
          />
          {!isGroupTargetValid && <span className="field-error">Skill inconnu</span>}
        </label>
        <input
          type="number"
          className="occurrence-count-input"
          min={MIN_OCCURRENCE_COUNT}
          max={MAX_OCCURRENCE_COUNT}
          value={occurrenceCount}
          onChange={(e) => onOccurrenceCountChange(clampOccurrenceCount(e.target.value))}
          placeholder="Occurrences"
          title="Nombre d'occurrences"
        />
      </div>
    </div>
  )
}
