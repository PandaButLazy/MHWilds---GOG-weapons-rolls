export function SkillInput({ id, skills, value, onChange, placeholder }) {
  return (
    <>
      <input
        type="text"
        list={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <datalist id={id}>
        {skills.map((skill) => (
          <option key={skill.name} value={skill.name} />
        ))}
      </datalist>
    </>
  )
}
