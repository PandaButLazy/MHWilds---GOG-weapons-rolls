import {
  bonusSkillCategory,
  bonusSkills,
  groupSkillCategory,
  groupSkills,
  isValidSkillValue,
  MAX_OCCURRENCE_COUNT,
  MIN_OCCURRENCE_COUNT,
} from '../data/skills'
import { FieldLabel } from './FieldLabel'
import { SkillInput } from './SkillInput'

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
          <FieldLabel iconUrl={bonusSkillCategory?.image_url}>Set Bonus Skill</FieldLabel>
          <SkillInput
            id="target-bonus-skills-list"
            skills={bonusSkills}
            value={target.bonusSkill}
            onChange={(value) => onTargetChange({ ...target, bonusSkill: value })}
            placeholder="Target bonus skill..."
            invalid={!isBonusTargetValid}
          />
          {!isBonusTargetValid && <span className="field-error">Unknown skill</span>}
        </label>
        <label>
          <FieldLabel iconUrl={groupSkillCategory?.image_url}>Group Skill</FieldLabel>
          <SkillInput
            id="target-group-skills-list"
            skills={groupSkills}
            value={target.groupSkill}
            onChange={(value) => onTargetChange({ ...target, groupSkill: value })}
            placeholder="Target group skill..."
            invalid={!isGroupTargetValid}
          />
          {!isGroupTargetValid && <span className="field-error">Unknown skill</span>}
        </label>
        <input
          type="number"
          className="occurrence-count-input"
          min={MIN_OCCURRENCE_COUNT}
          max={MAX_OCCURRENCE_COUNT}
          value={occurrenceCount}
          onChange={(e) => onOccurrenceCountChange(clampOccurrenceCount(e.target.value))}
          placeholder="Occurrences"
          title="Number of occurrences"
        />
      </div>
    </div>
  )
}
