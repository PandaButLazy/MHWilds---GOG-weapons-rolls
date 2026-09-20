import { useEffect, useRef, useState } from 'react'

export function SkillInput({ id, skills, value, onChange, placeholder, invalid }) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef(null)

  const filtered = value
    ? skills.filter((skill) => skill.name.toLowerCase().includes(value.toLowerCase()))
    : skills

  useEffect(() => {
    setHighlightedIndex(0)
  }, [value, isOpen])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectSkill(name) {
    onChange(name)
    setIsOpen(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (isOpen && filtered.length > 0) {
        e.preventDefault()
        selectSkill(filtered[highlightedIndex]?.name ?? filtered[0].name)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="combobox" ref={containerRef}>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={invalid ? 'input-invalid' : undefined}
        aria-invalid={invalid || undefined}
        autoComplete="off"
      />
      {isOpen && filtered.length > 0 && (
        <ul className="combobox-list">
          {filtered.map((skill, index) => (
            <li
              key={skill.name}
              className={index === highlightedIndex ? 'combobox-option highlighted' : 'combobox-option'}
              onMouseDown={(e) => {
                e.preventDefault()
                selectSkill(skill.name)
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {skill.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
