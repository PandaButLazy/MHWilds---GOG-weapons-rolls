import weaponSkills from '../../weapon_skills.json'

export const groupSkills = weaponSkills.armor_skills
export const bonusSkills = weaponSkills.attack_skills

export const DEFAULT_OCCURRENCE_COUNT = 20
export const MIN_OCCURRENCE_COUNT = 1
export const MAX_OCCURRENCE_COUNT = 200

export function isValidSkillValue(value, skills) {
  if (!value) return true
  return skills.some((skill) => skill.name === value)
}
