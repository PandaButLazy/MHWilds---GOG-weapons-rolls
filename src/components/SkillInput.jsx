export function SkillInput({ id, skills, value, onChange, placeholder, invalid }) {
  return (
    <>
      <input
        type="text"
        list={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={invalid ? 'input-invalid' : undefined}
        aria-invalid={invalid || undefined}
      />
      <datalist id={id}>
        {skills.map((skill) => (
          <option key={skill.name} value={skill.name} />
        ))}
      </datalist>
    </>
  )
}
