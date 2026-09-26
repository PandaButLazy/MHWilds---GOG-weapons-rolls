import weaponSkills from '../../weapon_skills.json'
import skillCategoriesData from '../../skill_categories.json'

export const groupSkills = weaponSkills.armor_skills
export const bonusSkills = weaponSkills.attack_skills

const skillCategoriesByName = new Map(
  skillCategoriesData.skills.map((category) => [category.category, category]),
)

export const groupSkillCategory = skillCategoriesByName.get('Group Skills') ?? null
export const bonusSkillCategory = skillCategoriesByName.get('Set Bonus Skills') ?? null

export const MIN_TABLE_ROWS = 10

export function isValidSkillValue(value, skills) {
  if (!value) return true
  return skills.some((skill) => skill.name === value)
}
